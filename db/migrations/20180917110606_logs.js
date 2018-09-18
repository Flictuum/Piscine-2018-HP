exports.up = (knex) => {
    return knex.schema.createTable('LOGS', (table) => {
        table.increments('id').primary();
        table.text('route').notNullable();
        table.text('body').notNullable();
        table.integer('user').notNullable().references('id').inTable('USERS');
    });
}

exports.down = (knex) => {
    return knex.schema.droptable('LOGS');
}
