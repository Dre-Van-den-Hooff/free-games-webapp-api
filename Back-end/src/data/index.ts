import knex, { Knex } from "knex";
import config from "config";
import logger from "../core/logging";
import { join } from "path";
import { KnexOptions } from "../interfaces";

const NODE_ENV: string = config.get("env");
const isDevelopment: boolean = NODE_ENV === "development";

const DATABASE_CLIENT: string = config.get("database.client");
const DATABASE_NAME: string = config.get("database.name");
const DATABASE_HOST: string = config.get("database.host");
const DATABASE_PORT: number = config.get("database.port");
const DATABASE_USERNAME: string = config.get("database.username");
const DATABASE_PASSWORD: string = config.get("database.password");

let knexInstance: Knex | null;

/* Maakt knex instantie aan en returnt deze */
export async function initializeData() {
  const knexOptions: KnexOptions = {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
    },
    migrations: {
      tableName: "knex_meta",
      directory: join("src", "data", "migrations"),
    },
    seeds: {
      directory: join("src", "data", "seeds"),
    },
  };

  knexInstance = knex(knexOptions);

  try {
    await knexInstance.raw("SELECT 1+1 AS result");
    await knexInstance.raw(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);
    logger.info("Created database");

    await knexInstance.destroy();

    knexOptions.connection.database = DATABASE_NAME;
    knexInstance = knex(knexOptions);
    await knexInstance.raw("SELECT 1+1 AS result");
  } catch (error) {
    logger.error(error);
    throw new Error("Could not initialize the data layer");
  }

  let migrationsFailed: boolean = true;
  try {
    await knexInstance.migrate.latest();
    migrationsFailed = false;
  } catch (error) {
    logger.error(error);
    logger.error("Error while migrating the database", {
      error,
    });
  }

  if (migrationsFailed) {
    try {
      await knexInstance.migrate.down();
    } catch (error) {
      logger.error("Error while undoing last migration", {
        error,
      });
    }
    throw new Error("Migrations failed");
  }

  if (isDevelopment) {
    try {
      await knexInstance.seed.run();
      logger.info("Successfully ran seeds");
    } catch (error) {
      logger.error("Error while seeding database", {
        error,
      });
    }
  }

  return knexInstance;
}

/* returnt knex-instantie */
export function getKnex() {
  if (!knexInstance) throw new Error("Please initialize the data layer before getting the Knex instance");
  return knexInstance;
}

export async function shutdownData() {
  logger.info("Shutting down database connection");

  //@ts-ignore "knexInstance is possibly 'null' "
  await knexInstance.destroy();
  knexInstance = null;

  logger.info("Database connection closed");
}

/* exporteert tables */
export const tables = Object.freeze({
  game: "games",
  user: "user",
  favourites: "favourites",
});
