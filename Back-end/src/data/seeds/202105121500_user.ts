import { Knex } from "knex";
import { tables } from "../index";
import { USERS } from "../mock-data";

export async function seed(knex: Knex): Promise<void> {
  await knex(tables.user).delete();
  await knex(tables.user).insert(USERS);
}
