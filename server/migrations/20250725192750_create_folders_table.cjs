/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('folders', (table) => {
		table.increments('id').primary();
		table.string('title').notNullable();
		table.string('description');
		table.string('color');

		table.integer('userId').notNullable();
		table.integer('parent_folder').notNullable().defaultTo(-1);
		table.timestamps(true, true);
		table.string('status').notNullable().defaultTo('public');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists('folders');
};
