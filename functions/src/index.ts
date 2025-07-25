/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {initializeApp} from "firebase-admin/app";
import {sendOTP, verifyOTP} from "./auth";
import {status} from "./status";
import {updateProfile, getProfile} from "./profile";

setGlobalOptions({maxInstances: 10});

initializeApp();

export {sendOTP, verifyOTP, status, updateProfile, getProfile};

