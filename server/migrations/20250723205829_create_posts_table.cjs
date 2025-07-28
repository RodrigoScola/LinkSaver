/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('posts', (table) => {
		table.increments('id').primary();
		table.string('title').notNullable();
		table.string('description');
		table.string('post_url');

		table.string('userId').notNullable();
		table.integer('parent').notNullable().defaultTo(-1);
		table.timestamps(true, true);
		table.string('status').notNullable().defaultTo('public');
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists('posts');
};
