/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('users', (table) => {
		table.increments('id').primary();
		table.string('google_id').unique().notNullable();
		table.boolean('isLive').notNullable().defaultTo(true);
		table.string('image_url').unique().primary();

		table.string('status').notNullable().defaultTo('public');
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('users');
};
