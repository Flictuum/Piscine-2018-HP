
exports.up = function(knex, Promise) {
    return knex.schema.createTable('CITIES', (table) => {
        table.increments('id').primary();
        table.text('name').notNullable();
        table.unique(['name']);
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.droptable('CITIES')
};
