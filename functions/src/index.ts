import cors from "cors";
import express from "express";
import {onRequest} from "firebase-functions/v1/https";
import {signIn} from "./controller/user-controller";
import initFirebase from "./firebase";

initFirebase();

const app: express.Application = express();
app.use(
  cors({
    origin: true,
  }),
);
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post("/signIn", signIn);

exports.api = onRequest(app);
