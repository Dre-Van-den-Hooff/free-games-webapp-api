import { Knex } from "knex";
import { SuperTest, Test } from "supertest";

export interface Game {
  id: number;
  title: string;
  thumbnail: string;
  genre: string;
  developer: string;
  release_date: string;
}

export interface Favourites {
  id: number;
  title: string;
  thumbnail: string;
  genre: string;
  developer: string;
  release_date: string;
  username: string;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  roles: string;
}

export interface KnexOptions {
  client: string;
  connection: {
    host: string;
    port: number;
    user: string;
    password: string;
    database?: string;
    debug?: boolean;
  };
  migrations: {
    tableName: string;
    directory: string;
  };
  seeds: {
    directory: string;
  };
}

export interface Errors {
  query?: string;
  params?: string;
  body?: string;
}

export interface Setter {
  knex: Knex;
  supertest: SuperTest<Test>;
}
