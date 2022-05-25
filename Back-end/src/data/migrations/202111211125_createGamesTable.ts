import { Knex } from "knex";
import { tables } from "../index";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tables.game, (table: Knex.CreateTableBuilder) => {
    table.integer("id").primary().notNullable();
    table.string("title", 100);
    table.string("thumbnail", 100);
    table.string("genre", 100);
    table.string("developer", 100);
    table.string("release_date", 100);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tables.game);
}
