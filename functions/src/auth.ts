import {logger} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import {generateOTPEmailHTML, generateOTPEmailText} from "./emailTemplates";
import {getFirestore} from "firebase-admin/firestore";
import {defineSecret} from "firebase-functions/params";

const jwtSecretKey = defineSecret("JWT_SECRET");
const gmailAppPassword = defineSecret("GMAIL_APP_PASSWORD");

export const sendOTP = onRequest({
  secrets: [gmailAppPassword],
}, async (request, response) => {
  if (request.method !== "POST") {
    response.status(405).send({
      code: 405,
      status: "error",
      message: "Method not allowed. Use POST request.",
    });
    return;
  }

  try {
    const {email} = request.body;
    const otp = Math.random().toString(36).substring(2, 8).toUpperCase();
    const db = getFirestore();

    // Store OTP in Firestore with expiration timestamp
    const otpData = {
      email: email,
      otp: otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      isUsed: false,
    };

    const mailOptions = {
      from: "ExpenseDiary <amdevprojects@gmail.com>",
      to: email,
      subject: "🔐 Your ExpenseDiary Verification Code",
      text: generateOTPEmailText(otp),
      html: generateOTPEmailHTML(otp),
    };
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "amdevprojects@gmail.com",
        pass: gmailAppPassword.value(),
      },
    });

    // Store OTP in Firestore and send email
    try {
      await db.collection("auth-otps").doc(email).set(otpData);

      // Promisify sendMail to use with async/await
      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        });
      });

      logger.info("Email sent and OTP stored", {structuredData: true});
      response.send({
        code: 200,
        status: "success",
        message: "OTP sent to email",
        // OTP is NOT included in response for security
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("sendMail")) {
        logger.error("Error sending email", {structuredData: true});
        response.status(500).send({
          code: 500,
          status: "error",
          message: "Error sending email",
        });
      } else {
        logger.error("Error storing OTP in Firestore", {
          structuredData: true,
          error: error,
        });
        response.status(500).send({
          code: 500,
          status: "error",
          message: "Error processing request",
        });
      }
    }
  } catch (error) {
    logger.error("Error in sendOTP function", {structuredData: true});
    response.status(500).send({
      code: 500,
      status: "error",
      message: "Error processing request",
    });
  }
});

export const verifyOTP = onRequest({
  secrets: [jwtSecretKey],
}, async (request, response) => {
  if (request.method !== "POST") {
    response.status(405).send({
      code: 405,
      status: "error",
      message: "Method not allowed. Use POST request.",
    });
    return;
  }

  try {
    const {email, otp} = request.body;

    if (!email || !otp) {
      response.status(400).send({
        code: 400,
        status: "error",
        message: "Email and OTP are required",
      });
      return;
    }

    const db = getFirestore();

    // Query for valid OTP
    try {
      const querySnapshot = await db.collection("auth-otps").doc(email).get();

      if (!querySnapshot.exists) {
        response.status(400).send({
          code: 400,
          status: "error",
          message: "Invalid or expired OTP",
        });
        return;
      }

      const otpData = querySnapshot.data();

      // Check if OTP is expired
      if (new Date() > otpData?.expiresAt?.toDate()) {
        response.status(400).send({
          code: 400,
          status: "error",
          message: "OTP has expired",
        });
        return;
      }

      // Mark OTP as used
      await querySnapshot.ref.update({isUsed: true});

      // Generate JWT token
      const jwtSecret = jwtSecretKey.value();
      const token = jwt.sign(
        {
          email: email,
          userId: email, // Using email as userId for now
          verified: true,
        },
        jwtSecret,
        {
          expiresIn: "7d", // Token expires in 7 days
          issuer: "ExpenseDiary",
        }
      );

      // Create or update user in Firestore
      const userRef = db.collection("users").doc(email);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // Create new user
        await userRef.set({
          email: email,
          createdAt: new Date(),
          lastLogin: new Date(),
          isVerified: true,
        });
      } else {
        // Update existing user's last login
        await userRef.update({
          lastLogin: new Date(),
          isVerified: true,
        });
      }

      logger.info("OTP verified successfully", {structuredData: true});
      response.send({
        code: 200,
        status: "success",
        message: "OTP verified successfully",
        token: token,
      });
    } catch (error) {
      logger.error("Error in OTP verification process", {
        structuredData: true,
        error: error,
      });
      response.status(500).send({
        code: 500,
        status: "error",
        message: "Error processing verification",
      });
    }
  } catch (error) {
    logger.error("Error verifying OTP", {structuredData: true});
    response.status(500).send({
      code: 500,
      status: "error",
      message: "Error verifying OTP",
    });
  }
});

