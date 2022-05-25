import Koa from "koa";
import Router from "@koa/router";
import userService from "../service/user";
import Joi from "joi";
import { validate } from "./_validation";
import { requireAuthentication } from "../core/auth";

/* returnt alle users */
const getAllUsers = async (ctx: Koa.Context) => {
  ctx.body = await userService.getAll();
};

/* post een user */
const createUser = async (ctx: Koa.Context) => {
  const newUser = await userService.create(ctx.request.body);
  ctx.body = newUser;
};

createUser.validationScheme = {
  body: {
    username: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
  },
};

/* returnt een user met specifiek id */
const getUserById = async (ctx: Koa.Context) => {
  ctx.body = await userService.getById(ctx.params.id);
};

getUserById.validationScheme = {
  params: {
    id: Joi.number().integer(),
  },
};

/* delete een user met specifiek id  */
const deleteUser = async (ctx: Koa.Context) => {
  ctx.body = await userService.deleteById(ctx.params.id);
};

deleteUser.validationScheme = {
  params: {
    id: Joi.number().integer(),
  },
};

const login = async (ctx: Koa.Context) => {
  const loginUser = await userService.login(ctx.request.body);
  ctx.body = loginUser;
};

login.validationScheme = {
  body: {
    email: Joi.string(),
    password: Joi.string(),
  },
};

const updateUser = async (ctx: Koa.Context) => {
  const updatedUser = await userService.updateUser(ctx.request.body);
  ctx.body = updatedUser;
};

updateUser.validationScheme = {
  body: {
    email: Joi.string(),
    username: Joi.string(),
  },
};

/* exporteert user router */
export const installUserRouter = (app: Router) => {
  const router = new Router({
    prefix: "/user",
  });

  /*Login & register */
  router.post("/login", validate(login.validationScheme), login);
  router.post("/register", validate(createUser.validationScheme), createUser);

  router.get("/", requireAuthentication, getAllUsers);
  router.put("/update", requireAuthentication, validate(updateUser.validationScheme), updateUser);
  router.get("/:id", requireAuthentication, validate(getUserById.validationScheme), getUserById);
  router.delete("/:id", requireAuthentication, validate(deleteUser.validationScheme), deleteUser);

  app.use(router.routes()).use(router.allowedMethods());
};
