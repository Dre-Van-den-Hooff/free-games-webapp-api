import config from "config";
import jwt from "jsonwebtoken";
import { User } from "../interfaces";

const JWT_AUDIENCE: string = config.get("auth.jwt.audience");
const JWT_SECRET: string = config.get("auth.jwt.secret");
const JWT_ISSUER: string = config.get("auth.jwt.issuer");
const JWT_EXPIRATION_INTERVAL: number = config.get("auth.jwt.expirationInterval");

export const generateJWT = (user: User) => {
  const tokenData = {
    userId: user.id,
    roles: user.roles,
  };

  const signOptions = {
    expiresIn: Math.floor(JWT_EXPIRATION_INTERVAL / 1000),
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: "auth",
  };

  return new Promise((resolve, reject) => {
    jwt.sign(tokenData, JWT_SECRET, signOptions, (err, token) => {
      if (err) {
        console.log("Error while signing new token:", err.message);
        return reject(err);
      }
      return resolve(token);
    });
  });
};

export const verifyJWT = (authToken: string) => {
  const verifyOptions = {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: "auth",
  };

  return new Promise((resolve, reject) => {
    jwt.verify(authToken, JWT_SECRET, verifyOptions, (err, decodedToken) => {
      if (err || !decodedToken) {
        //@ts-ignore object is possibly 'null'
        console.log("Error while verifying token:", err.message);
        return reject(err || new Error("Token could not be parsed"));
      }
      return resolve(decodedToken);
    });
  });
};
