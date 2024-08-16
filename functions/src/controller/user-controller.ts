import {Request, Response} from "express";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import ERROR_MESSAGES from "../utils/error-messages";

export async function signIn(req: Request, res: Response) {
  try {
    const response = await signInWithEmailAndPassword(getAuth(), req.body.email, req.body.password);
    const token = await response.user.getIdToken();
    res.status(200).send({
      data: {
        token: token,
      },
      errors: [],
    });
  } catch (error: any) {
    res.status(400).send({
      data: null,
      errors: [ERROR_MESSAGES[error.code]],
    });
  }
  return;
}
