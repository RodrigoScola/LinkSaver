/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

    return knex.schema.createTable('categories', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('color').notNullable();
        table.string('status').notNullable();
        table.timestamps(true, true);
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
      return knex.schema.dropTableIfExists('categories');
};
