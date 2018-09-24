
exports.up = function(knex, Promise) {
    return knex.schema.createTable('HOUSES', (table) => {
        table.increments('id').primary();
        table.text('name').notNullable();
        table.text('image').notNullable();
        table.text('city').notNullable().references('id').inTable('CITIES');
        table.integer('referent').notNullable().references('id').inTable('USERS');
        table.unique(['name']);
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.droptable('HOUSES')
};
