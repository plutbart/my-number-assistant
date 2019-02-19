function XService(randomStrategy, databaseManager, numberComparer) {
  this.randomStrategy = randomStrategy;
  this.databaseManager = databaseManager;
  this.numberComparer = numberComparer

  this.getCurrentXPromise = function() {
    return databaseManager
      .once("value")
      .then(snapshot => snapshot.val())
      .catch(err => console.error(err));
  };

  this.guessNumber = function(db, userID, type, number, lang, callbackLarger, calbackSmaller, callbackEqual, callbackNo, callbackCannot) {
    return this.numberComparer.compareWithDatabaseValue(db, userID, type, number, lang, callbackLarger, calbackSmaller, callbackEqual, callbackNo, callbackCannot)
  }

  this.updateX = function() {
    const newX = this.randomStrategy.getRandomX();
    return newX
  };

  this.getNumber = function(db,userID,callback) {
    return this.databaseManager.getNumber(db,userID,callback)
  }

  this.setNumber = function(db, newNumber, userID, callback) {
    return this.databaseManager.setNumber(db, newNumber, userID, callback)
  }

  this.setNotification = function(db, userID, callback) {
    return this.databaseManager.setNotification(db, userID, callback)
  }

  this.notify = function(db, userID, callback) {
    return this.databaseManager.notify(db,userID,callback)
  }
}

module.exports.XService = XService;
