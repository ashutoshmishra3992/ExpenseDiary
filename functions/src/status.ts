import {logger} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";

export const status = onRequest((request, response) => {
  logger.info("Status request received", {structuredData: true});
  response.send({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});
