import {NextFunction, Request, Response} from "express";
import {ContextRunner} from "express-validator";

const validate = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let errors: string[] = []
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        errors = errors.concat(result.array().map((e) => e.msg))
      }
    }
    if (errors.length) {
      return res.status(400).json({data: null, errors});
    }
    next();
    return;
  };
}

export default validate;
