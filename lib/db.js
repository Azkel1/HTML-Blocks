const pgp = require("pg-promise")();

// Get these values from configuration
const user = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const database = process.env.DB_NAME;

// Use a symbol to store a global instance of a connection, and to access it from the singleton.
const DB_KEY = Symbol.for("HTMLBlocks.db");
const globalSymbols = Object.getOwnPropertySymbols(global);
const hasDb = (globalSymbols.indexOf(DB_KEY) > -1);
if (!hasDb) {
    global[DB_KEY] = pgp(`postgres://${user}:${password}@${host}/${database}`);
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