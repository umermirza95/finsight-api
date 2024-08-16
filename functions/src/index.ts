import cors from "cors";
import express from "express";
import {onRequest} from "firebase-functions/v1/https";

const app: express.Application = express();
app.use(
  cors({
    origin: true,
  }),
);
app.use(express.urlencoded({extended: true}));
app.use(express.json());


exports.api = onRequest(app);
