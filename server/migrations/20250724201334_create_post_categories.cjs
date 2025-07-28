/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('post_categories', (table) => {
		table.increments('id').primary();
		table.integer('post_id').notNullable();
		table.string('userId');
		table.integer('category_id').notNullable();
		table.integer('likes');
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists('post_categories');
};
