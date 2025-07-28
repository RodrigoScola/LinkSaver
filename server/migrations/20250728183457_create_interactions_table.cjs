exports.up = function (knex) {
	return knex.schema.createTable('interactions', (table) => {
		table.increments('id').primary();
		table.string('type').notNullable();
		table.integer('userId').notNullable();
		table.integer('postId').notNullable();
		table.string('status').notNullable().defaultTo('public');

		table.timestamps(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('interactions');
};
