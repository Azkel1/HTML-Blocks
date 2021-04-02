const pgp = require('pg-promise')();

// Get these values from configuration
const user = "postgres";
const password = "root";
const host = "localhost";
const port = "5432";
const database = "test";

// Use a symbol to store a global instance of a connection, and to access it from the singleton.
const DB_KEY = Symbol.for("HTMLBlocks.db");
const globalSymbols = Object.getOwnPropertySymbols(global);
const hasDb = (globalSymbols.indexOf(DB_KEY) > -1);
if (!hasDb) {
    global[DB_KEY] = pgp(`postgres://${user}:${password}@${host}:${port}/${database}`);
}

// Create and freeze the singleton object so that it has an instance property.
const singleton = {};
Object.defineProperty(singleton, "instance", {
    get: function () {
        return global[DB_KEY];
    }
});
Object.freeze(singleton);

module.exports = singleton;