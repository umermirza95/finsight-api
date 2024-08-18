import cors from "cors";
import express from "express";
import {onRequest} from "firebase-functions/v1/https";
import {signIn} from "./controller/user-controller";
import initFirebase from "./firebase";
import {authValidator} from "./validators/auth-validator";
import {createCategoryValidator, createSubCategoryValidator} from "./validators/category-validator";
import {createCategory, createSubCategory, getCategories} from "./controller/cateogry-controller";
import validate from "./validators/validate";
import {createTransactionValidator} from "./validators/transaction-validator";
import {createTransaction, importFromCsv} from "./controller/transaction-controller";

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
app.post("/subCategory", [authValidator, validate(createSubCategoryValidator)], createSubCategory);
app.get("/category", authValidator, getCategories)

app.post("/transaction", [authValidator, validate(createTransactionValidator)], createTransaction)
app.post("/transaction/csv", [authValidator], importFromCsv)

exports.api = onRequest(app);
