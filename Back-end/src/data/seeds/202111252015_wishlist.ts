import { Knex } from "knex";
import { tables } from "../index";

export async function seed(knex: Knex): Promise<void> {
  await knex(tables.favourites).delete();
}
