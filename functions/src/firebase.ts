import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import {initializeApp, getApps} from "firebase/app";


dotenv.config({path: __dirname + "/./../../.env"});

export default function initFirebase() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),

      }),
    });
  }
  if (!getApps().length) {
    initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    }, {

    });
  }
}

