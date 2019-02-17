const implementjs = require('implement-js')
const implement = implementjs.default
const IServiceBuilder = require('./serviceBuilder').IServiceBuilder
const XService = require('./XService.js').XService
const randomNumberStrategy = require("./randomNumberStrategy").randomNumberStrategy;
const rowName = require('./constants').DATABASE_X_ROW_NAME;
const NumberComparer = require('./numberComparer').NumberComparer;
const DatabaseManager = require('./databaseManager').DatabaseManager;

function RandomNumberServiceBuilder(database) {
    this.database = database;

    this.buildService = function() {
        const databaseManager = new DatabaseManager()
        const numberComparer = new NumberComparer()
        const service = new XService(randomNumberStrategy, databaseManager, numberComparer);
        return service;
    }
}

const getBuilder = (db) => {
    const builder = implement(IServiceBuilder)(new RandomNumberServiceBuilder(db));
    return builder;
}

module.exports.RandomNumberServiceBuilder = RandomNumberServiceBuilder
module.exports.getBuilder = getBuilder
