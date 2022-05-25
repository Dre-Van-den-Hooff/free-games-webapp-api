import { Knex } from "knex";
import { tables } from "../index";
import { GAMES } from "../mock-data";

export async function seed(knex: Knex): Promise<void> {
  await knex(tables.game).delete();
  await knex(tables.game).insert(GAMES);
}
