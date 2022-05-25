import Koa from "koa";
import koaCors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import logger from "./core/logging";
import config from "config";
import { initializeData, shutdownData } from "./data/index";
import { installRest } from "./rest/index";
import emoji from "node-emoji";
import { serializeError } from "serialize-error";
import { ServiceError } from "./core/serviceError";

const SERVER_PORT: string | number = process.env.PORT || 9000;
const NODE_ENV: string = config.get("env");
const LOG_LEVEL: string = config.get("log.level");
const LOG_DISABLED: boolean = config.get("log.disabled");
const CORS_ORIGINS: string = config.get("cors.origins");
const CORS_MAX_AGE: number = config.get("cors.maxAge");

export default async function createServer() {
  logger.info(`environment: ${NODE_ENV} | log level: ${LOG_LEVEL} | logs enabled: ${LOG_DISABLED !== true}`);
  await initializeData();

  const app = new Koa();

  app.use(
    koaCors({
      //@ts-ignore
      origin: (ctx: Koa.Context) => {
        //@ts-ignore
        if (CORS_ORIGINS.indexOf(ctx.request.header.origin) !== -1) {
          return ctx.request.header.origin;
        }
        return CORS_ORIGINS[0];
      },
      allowHeaders: ["Accept", "Content-Type", "Authorization"],
      maxAge: CORS_MAX_AGE,
    })
  );

  app.use(bodyParser());

  app.use(async (ctx: Koa.Context, next: Koa.Next) => {
    logger.info(`${emoji.get("fast_forward")} ${ctx.method} ${ctx.url}`);

    const getStatusEmoji = () => {
      if (ctx.status >= 500) return emoji.get("skull");
      if (ctx.status >= 400) return emoji.get("x");
      if (ctx.status >= 300) return emoji.get("rocket");
      if (ctx.status >= 200) return emoji.get("white_check_mark");
      return emoji.get("rewind");
    };

    try {
      await next();

      logger.info(`${getStatusEmoji()} ${ctx.method} ${ctx.status} ${ctx.url}`);
    } catch (error) {
      logger.error(`${emoji.get("x")} ${ctx.method} ${ctx.status} ${ctx.url}`, {
        error,
      });

      throw error;
    }
  });

  app.use(async (ctx, next) => {
    try {
      await next();

      if (ctx.status === 404) {
        ctx.body = {
          code: "NOT_FOUND",
          message: `Unknown resource: ${ctx.url}`,
        };
      }
    } catch (error: any) {
      logger.error("Error occured while handling a request", {
        error: serializeError(error),
      });

      let statusCode = error.status || 500;
      let errorBody = {
        code: error.code || "INTERNAL_SERVER_ERROR",
        message: error.message,
        details: error.details || {},
        stack: NODE_ENV !== "production" ? error.stack : undefined,
      };

      if (error instanceof ServiceError) {
        if (error.isNotFound) {
          statusCode = 404;
        }

        if (error.isValidationFailed) {
          statusCode = 400;
        }

        if (error.isUnauthorized) {
          statusCode = 401;
        }

        if (error.isForbidden) {
          statusCode = 403;
        }
      }

      ctx.status = statusCode;
      ctx.body = errorBody;
    }
  });

  installRest(app);

  return {
    getApp(): Koa {
      return app;
    },

    start(): Promise<void> {
      return new Promise(resolve => {
        app.listen(SERVER_PORT);
        logger.info(`🚀 Server listening on http://localhost:${SERVER_PORT}`);
        resolve();
      });
    },

    async stop(): Promise<void> {
      {
        app.removeAllListeners();
        await shutdownData();
        logger.info("Goodbye");
      }
    },
  };
}
