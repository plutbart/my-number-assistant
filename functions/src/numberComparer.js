const DatabaseManager = require('./databaseManager.js').DatabaseManager;

function NumberComparer() {
    this.compareWithDatabaseValue = function(db, userID, type, number, callbackLarger, callbackSmaller, callbackEqual, callbackNo, callbackCannot) {
      let dbManager = new DatabaseManager()
      return dbManager.getNumber(db,userID,(value) => {
        const databaseValue = parseInt(value)
        if (type === "mniej") {
          if (databaseValue < number) { callbackSmaller() }
          else { callbackNo() }
        }
        else if (type === "więcej") {
          if (databaseValue > number) { callbackLarger() }
          else { callbackNo() }
        }
        else if (type === "równy") {
          if (databaseValue == number) { callbackEqual() }
          else { callbackNo() }
        }
        else { callbackCannot() }
      })
    }
}

module.exports.NumberComparer = NumberComparer
