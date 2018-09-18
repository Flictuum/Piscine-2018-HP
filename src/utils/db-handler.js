const knexconfig = require('../../knexfile');
const knex = require('knex')(knexconfig);

const database = new Proxy(knex, {
    get: (target, name) => {
        if (name === 'then') {
            return new Promise((resolve, reject) => target.then(resolve, reject));
        } else {
            return target[name];
        }
    }
});

function migrate() {
    return new Promise((resolve, reject) => {
        database.migrate.latest()
            .then(function () {
                return database.seed.run();
            })
            .then(function () {
                resolve();
            })
            .catch((error) => reject(error));
    });
}

function createEntry(tablename, entryObj) {
    return new Promise((resolve, reject) => {
        database(tablename).insert(entryObj).then((result) => resolve(result)).catch((error) => reject(error));
    });
}

function getEntry(tablename, whereObj, selectedObj) {
    return new Promise((resolve, reject) => {
        database(tablename).select(selectedObj).where(whereObj).then((result) => resolve(result)).catch((error) => reject(error));
    });
}

function eraseEntry(tablename, whereObj) {
    return database(tablename)
        .del()
        .where(whereObj);
}

function erase() {
    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') console.log('Removing database file ...');
        let filename = knex.client.config.connection.filename;
        try {
            if (fs.existsSync(filename))
                fs.unlinkSync(filename);
        } catch (err) {
            return reject(err);
        }
        return resolve();
    });
}

module.exports = { database, migrate, createEntry, getEntry, eraseEntry, erase };