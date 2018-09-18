const { generateAndHash } = require('../../src/utils/crypto-gen');

exports.seed = (knex) => {
    // Deletes ALL existing entries
    let hashedAdmin = generateAndHash('BFR5pa');

    return knex('USERS').del()
        .then(() =>
            // Inserts seed entries
            knex('USERS').insert([
                { id: 1, username: 'admin', realname:'Administrator', pw: hashedAdmin.hashed, salt: hashedAdmin.salt, iterations: hashedAdmin.iteration} //pw: 'admin'
            ])
        );
};