import { response } from "../config/response.js";

export const wrapRequestHandle = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (error) {
      return response(res, "", "Error BE", 500);
    }
  };
};
