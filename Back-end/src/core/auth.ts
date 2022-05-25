import userService from "../service/user";
import Koa from "koa";

export const requireAuthentication = async (ctx: Koa.Context, next: Koa.Next) => {
  const { authorization } = ctx.headers;

  const { authToken, ...session } = await userService.checkAndParseSession(authorization);

  ctx.state.session = session;
  ctx.state.authToken = authToken;

  return next();
};
