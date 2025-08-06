exports.up = function (knex) {
	return knex.schema.table('post_categories', function (table) {
		table.string('status').defaultTo('public'); // or nullable(), or enum if needed
	});
};

exports.down = function (knex) {
	return knex.schema.table('post_categories', function (table) {
		table.dropColumn('status');
	});
};
