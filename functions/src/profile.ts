import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import {logger} from "firebase-functions";
import {getFirestore} from "firebase-admin/firestore";
import jwt from "jsonwebtoken";

const jwtSecretKey = defineSecret("JWT_SECRET");

export const updateProfile = onRequest({
  secrets: [jwtSecretKey],
}, async (request, response) => {
  if (request.method !== "PUT") {
    response.status(405).send({
      code: 405,
      status: "error",
      message: "Method not allowed. Use PUT request.",
    });
    return;
  }

  if (!request.body) {
    response.status(400).send({
      code: 400,
      status: "error",
      message: "No body provided",
    });
    return;
  }

  if (!request.body.name) {
    response.status(400).send({
      code: 400,
      status: "error",
      message: "Name is required",
    });
    return;
  }

  try {
    const jwtSecret = jwtSecretKey.value();
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      response.status(401).send({
        code: 401,
        status: "error",
        message: "No token provided",
      });
      return;
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as unknown as {email: string};
    } catch (jwtError) {
      response.status(401).send({
        code: 401,
        status: "error",
        message: "Invalid or expired token",
      });
      return;
    }
    const db = getFirestore();
    const userDoc = await db.collection("users").doc(decoded.email).get();
    if (!userDoc.exists) {
      response.status(404).send({
        code: 404,
        status: "error",
        message: "User not found",
      });
      return;
    }

    const userData = userDoc.data();
    if (!userData) {
      response.status(404).send({
        code: 404,
        status: "error",
        message: "User not found",
      });
      return;
    }

    await userDoc.ref.update({
      name: request.body.name,
      updatedAt: new Date(),
    });
    const updatedUserDoc = await userDoc.ref.get();
    response.send({
      code: 200,
      status: "success",
      message: "Profile updated",
      updatedUserData: updatedUserDoc.data(),
    });
  } catch (error) {
    logger.error("Error updating profile", {
      structuredData: true,
      error: error,
    });
    response.status(500).send({
      code: 500,
      status: "error",
      message: "Error updating profile",
    });
  }
});

export const getProfile = onRequest({
  secrets: [jwtSecretKey],
}, async (request, response) => {
  if (request.method !== "GET") {
    response.status(405).send({
      code: 405,
      status: "error",
      message: "Method not allowed. Use GET request.",
    });
    return;
  }

  try {
    const jwtSecret = jwtSecretKey.value();
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      response.status(401).send({
        code: 401,
        status: "error",
        message: "No token provided",
      });
      return;
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as unknown as {email: string};
    } catch (jwtError) {
      response.status(401).send({
        code: 401,
        status: "error",
        message: "Invalid or expired token",
      });
      return;
    }
    const db = getFirestore();
    const userDoc = await db.collection("users").doc(decoded.email).get();
    if (!userDoc.exists) {
      response.status(404).send({
        code: 404,
        status: "error",
        message: "User not found",
      });
      return;
    }
    response.send({
      code: 200,
      status: "success",
      message: "Profile fetched",
      userData: userDoc.data(),
    });
  } catch (error) {
    logger.error("Error fetching profile", {
      structuredData: true,
      error: error,
    });
    response.status(500).send({
      code: 500,
      status: "error",
      message: "Error fetching profile",
    });
  }
});
