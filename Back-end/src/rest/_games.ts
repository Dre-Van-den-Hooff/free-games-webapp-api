import Koa from "koa";
import Router from "@koa/router";
import gamesService from "../service/games";
import Joi from "joi";
import { validate } from "./_validation";
import { requireAuthentication } from "../core/auth";

/* returnt alle games */
const getAllGames = async (ctx: Koa.Context) => {
  ctx.body = await gamesService.getAll();
};

/* post een game */
const createGame = async (ctx: Koa.Context) => {
  const newGame = await gamesService.create(ctx.request.body);
  ctx.body = newGame;
};

createGame.validationScheme = {
  body: {
    title: Joi.string(),
    thumbnail: Joi.string().allow(""),
    genre: Joi.string().allow(""),
    developer: Joi.string().allow(""),
    release_date: Joi.string().allow(""),
  },
};

/* returnt een game met specifiek id */
const getGameById = async (ctx: Koa.Context) => {
  ctx.body = await gamesService.getById(ctx.params.id);
};

getGameById.validationScheme = {
  params: {
    id: Joi.number().integer(),
  },
};

/* returnt een game met zoekterm */
const getBySearchTerm = async (ctx: Koa.Context) => {
  ctx.body = await gamesService.getBySearchTerm(ctx.params.query);
};

getBySearchTerm.validationScheme = {
  params: {
    query: Joi.string(),
  },
};

/* delete een game met specifiek id  */
const deleteGame = async (ctx: Koa.Context) => {
  ctx.body = await gamesService.deleteById(ctx.params.id);
};

deleteGame.validationScheme = {
  params: {
    id: Joi.number().integer(),
  },
};

/* exporteert games router */
export const installGamesRouter = (app: Router) => {
  const router = new Router({
    prefix: "/games",
  });

  router.get("/", getAllGames);
  router.post("/", validate(createGame.validationScheme), createGame);
  router.get("/id/:id", validate(getGameById.validationScheme), getGameById);
  router.get("/query/:query", validate(getBySearchTerm.validationScheme), getBySearchTerm);
  router.delete("/:id", validate(deleteGame.validationScheme), deleteGame);

  app.use(router.routes()).use(router.allowedMethods());
};
