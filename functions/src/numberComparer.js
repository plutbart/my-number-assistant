const DatabaseManager = require('./databaseManager.js').DatabaseManager;
const LocaleManager = require('../localeManager.js').LocaleManager;

function NumberComparer() {
    this.compareWithDatabaseValue = function(db, userID, type, number, lang, callbackLarger, callbackSmaller, callbackEqual, callbackNo, callbackCannot) {
      let dbManager = new DatabaseManager()
      const locale = new LocaleManager();
      return dbManager.getNumber(db,userID,(value) => {
        const databaseValue = parseInt(value)

        if (type === locale.getResponse("smaller",lang)) {
          if (databaseValue < number) { callbackSmaller() }
          else { callbackNo() }
        }
        else if (type === locale.getResponse("larger",lang)) {
          if (databaseValue > number) { callbackLarger() }
          else { callbackNo() }
        }
        else if (type === locale.getResponse("equal",lang)) {
          if (databaseValue == number) { callbackEqual() }
          else { callbackNo() }
        }
        else { callbackCannot() }

      })
    }
}

module.exports.NumberComparer = NumberComparer
