const randomNumberStrategy = require("./randomNumberStrategy").randomNumberStrategy;

function DatabaseManager() {

  this.getNumber = function(db, userID, callback) {
    return db.collection("users")
      .where('userId', "==", userID)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          let newNumber = 10;
          return db.collection('users')
            .add({
              ['intent']: "",
              ['userId']: userID,
              number: newNumber.toString(),
            })
            .then((docRef) => {
              callback(newNumber.toString());
            });
          }
          else {
            callback(querySnapshot.docs[0].get('number'));
          }
      });
  }

  this.setNumber = function(db, newNumber, userID, callback) {
    return db.collection("users").where('userId', "==", userID)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          return db.collection('users')
            .add({
              ['intent']: "",
              ['userId']: userID,
              number: newNumber,
            })
            .then((docRef) => {
              callback(newNumber)
            });
        }
        else {
          querySnapshot.forEach(function(doc) {
            db.collection('users').doc(doc.id).update({
              number: newNumber,
            });
          })
          callback(newNumber)
        }
      });
  }

  this.notify = function() {
    const request = require('request');
    const google = require('googleapis');
    const serviceAccount = require('../service-account.json');
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email, null, serviceAccount.private_key,
      ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
        null
    );
    let notification = {
      userNotification: {
        title: 'Twoja liczba została zaktualizowana',
      },
      target: {},
    };
    jwtClient.authorize((err, tokens) => {
      if (err) {
        throw new Error(`Auth error: ${err}`);
      }
      db.collection('users')
        .where('intent', '==', 'get_number')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((user) => {
            notification.target = {
              userId: user.get('userId'),
              intent: user.get('intent'),
            };
            request.post('https://actions.googleapis.com/v2/conversations:send', {
              'auth': {
                'bearer': tokens.access_token,
              },
              'json': true,
              'body': {'customPushMessage': notification, 'isInSandbox': true},
            }, (err, httpResponse, body) => {
              if (err) {
                throw new Error(`API request error: ${err}`);
              }
              console.log(`${httpResponse.statusCode}: ` +
                `${httpResponse.statusMessage}`);
              console.log(JSON.stringify(body));
            });
          });
        })
        .catch((error) => {
          throw new Error(`Firestore query error: ${error}`);
        });
    });
  }

  this.setNotification = function(db, userID, callback) {
    return db.collection("users").where('userId', "==", userID).get().then(querySnapshot => {
      if (querySnapshot.empty) {
        return db.collection('users')
          .add({
            'intent': 'get_number',
            'userId': userID,
            number: RandomNumberStrategy.getRandomX(),
          })
          .then((docRef) => {
            callback()
          });
      }
      else {
        querySnapshot.forEach(function(doc) {
          db.collection('users').doc(doc.id).update({
            intent: 'get_number',
          });
        })
        callback()
      }
    });
  }
}

module.exports.DatabaseManager = DatabaseManager
