import Router from "@koa/router";
import Koa from "koa";
import { installGamesRouter } from "./_games";
import { installFavouritesRouter } from "./_favourites";
import { installUserRouter } from "./_user";

/* installeert alle routers */
export const installRest = (app: Koa) => {
  const router = new Router({
    prefix: "/api",
  });

  installGamesRouter(router);
  installFavouritesRouter(router);
  installUserRouter(router);
  app.use(router.routes()).use(router.allowedMethods);
};
