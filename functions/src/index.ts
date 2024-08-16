import cors from "cors";
import express from "express";
import {onRequest} from "firebase-functions/v1/https";
import {signIn} from "./controller/user-controller";
import initFirebase from "./firebase";
import {authValidator} from "./validators/auth-validator";
import {createCategoryValidator} from "./validators/category-validator";
import {createCategory} from "./controller/cateogry-controller";
import validate from "./validators/validate";

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
app.post("/category", [authValidator, validate(createCategoryValidator)], createCategory);

exports.api = onRequest(app);
