import { Knex } from "knex";
import { tables } from "../index";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tables.user, (table: Knex.CreateTableBuilder) => {
    table.increments("id").primary().notNullable();
    table.string("username", 100).notNullable;
    table.string("email", 100).notNullable;
    table.string("password", 100).notNullable;
    table.jsonb("roles").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(tables.user);
}
