import {NextFunction, Request, Response} from "express";
import {auth} from "firebase-admin";

export async function authValidator(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization?.split(" ")?.at(1);
    if (!authHeader) {
      throw Error("bearer token is missing");
    }
    const user = await auth().verifyIdToken(authHeader);
    req.body.user = user;
    next()
  } catch (error:any) {
    res.status(401).send({
      data: null,
      errors: [error.message],
    })
  }
}
