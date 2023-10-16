/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("users", function (table) {
      table.increments();
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.specificType("groups", "json[]");
      table.timestamps(true, true);
    }),
    knex.schema.createTable("groups", function (table) {
      table.increments();
      table.string("groupName").notNullable();
      table.string("adminEmail").notNullable();

      table.timestamps(true, true);
    }),
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable("users"),
    knex.schema.dropTable("groups"),
  ]);
};
