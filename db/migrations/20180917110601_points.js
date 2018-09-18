
exports.up = (knex) => {
    return knex.schema.createTable('POINTS', (table) => {
        table.increments('id').primary();
        table.integer('house').notNullable().references('id').inTable('HOUSES');
        table.integer('user').notNullable().references('id').inTable('USERS');
        table.integer('points').notNullable();
        table.text('comment').nullable();
        table.text('title').notNullable();
        table.text('date').notNullable().defaultTo(knex.fn.now());
    });
}

exports.down = (knex) => knex.schema.droptable('POINTS');
