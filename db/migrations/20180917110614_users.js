
exports.up = (knex) => {
    return knex.schema.createTable('USERS', (table) => {
        table.increments('id').primary();
        table.text('username').notNullable();
        table.text('realname').notNullable();
        table.text('pw').notNullable();
        table.text('salt').notNullable();
        table.integer('iterations').notNullable();
        table.unique(['username']);
    })
};

exports.down = (knex) => { return knex.schema.droptable('USERS');}
