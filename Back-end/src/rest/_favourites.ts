import Koa from "koa";
import Router from "@koa/router";
import favouritesService from "../service/favourites";
import Joi from "joi";
import { validate } from "./_validation";
import { requireAuthentication } from "../core/auth";

/* returnt alle games van de favourites */
const getAllGames = async (ctx: Koa.Context) => {
  ctx.body = await favouritesService.getAll();
};

/* post een game naar de favourites */
const createGame = async (ctx: Koa.Context) => {
  const newGame = await favouritesService.create(ctx.request.body);
  ctx.body = newGame;
};

createGame.validationScheme = {
  body: {
    title: Joi.string(),
    thumbnail: Joi.string(),
    genre: Joi.string(),
    developer: Joi.string(),
    release_date: Joi.string(),
    username: Joi.string(),
  },
};

/* returnt een game van de favourites met specifiek id */
const getGameById = async (ctx: Koa.Context) => {
  ctx.body = await favouritesService.getById(ctx.params.id);
};

getGameById.validationScheme = {
  params: {
    id: Joi.number().integer(),
  },
};

/* delete een game van de favourites met specifiek id */
const deleteGame = async (ctx: Koa.Context) => {
  ctx.body = await favouritesService.deleteById(ctx.params.id);
};

deleteGame.validationScheme = {
  params: {
    id: Joi.number().integer(),
  },
};

/* exporteert favourites router */
export const installFavouritesRouter = (app: Router) => {
  const router = new Router({
    prefix: "/favourites",
  });

  router.get("/", requireAuthentication, getAllGames);
  router.post("/", requireAuthentication, validate(createGame.validationScheme), createGame);
  router.get("/:id", requireAuthentication, validate(getGameById.validationScheme), getGameById);
  router.delete("/:id", requireAuthentication, validate(deleteGame.validationScheme), deleteGame);

  app.use(router.routes()).use(router.allowedMethods());
};
