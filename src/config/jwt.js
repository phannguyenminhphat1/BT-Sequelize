import jwt from "jsonwebtoken";

export const createToken = (data) => {
  return jwt.sign({ data: data }, "BI_MAT", { expiresIn: "15m" });
};

export const checkToken = (token) =>
  jwt.verify(token, "BI_MAT", (error) => error);

export const decodeToken = (token) => jwt.decode(token);

export const verifyToken = (req, res, next) => {
  let { token } = req.headers;
  let err = checkToken(token);
  if (err == null) {
    next();
    return;
  }

  res.status(401).send(err.name);
};

export const createRefreshToken = (data) => {
  return jwt.sign({ data: data }, "BI_MAT_REF", { expiresIn: "60d" });
};

export const checkRefreshToken = (token) =>
  jwt.verify(token, "BI_MAT_REF", (error) => error);
