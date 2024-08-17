import ERROR_MESSAGES from "./error-messages";

export function errorResponse(error: any) {
  let errorMessage = ERROR_MESSAGES[error.code];
  if (!errorMessage) {
    errorMessage = error.messages;
  }
  if (!errorMessage) {
    errorMessage = "Something went wrong, please check logs for details"
  }
  return {
    data: null,
    errors: [errorMessage],
  }
}

export function successResponse(data: any, resourceName: string) {
  const object: any = {};
  object[resourceName] = data
  return {
    data: object,
    errors: [],
  }
}
