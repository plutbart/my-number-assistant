'use strict';

const {
  dialogflow,
  BasicCard,
  Button,
  RegisterUpdate,
  Suggestions,
  UpdatePermission,
  DialogflowApp,
} = require('actions-on-google');
const LocaleManager = require('./localeManager.js').LocaleManager;
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const getNumber = require('./src/databaseManager.js').getNumber;
const setNumber = require('./src/databaseManager.js').setNumber;
const setNotification = require('./src/databaseManager.js').setNotification;

admin.initializeApp();
const db = admin.firestore();
const locale = new LocaleManager();

const builder = require("./src/randomNumberServiceBuilder").getBuilder(db)
const xService = builder.buildService();

const app = dialogflow({debug: true});

app.intent('Default Welcome Intent', (conv) => {
    const welcomeMessage = locale.getResponse('welcome',conv.user.locale)
    return conv.ask(welcomeMessage);
});

app.intent('setup_push', (conv) => {
  conv.ask(new UpdatePermission({intent: 'get_number'}));
});

app.intent('finish_push_setup', (conv, params) => {
  if (conv.arguments.get('PERMISSION')) {
    const userID = conv.user.id;

    return xService.setNotification(db, userID, () => {
      conv.ask(locale.getResponse('pushAccepted',conv.user.locale))
    })
  } else {
    conv.ask(locale.getResponse('pushDenied',conv.user.locale));
  }
});

app.intent('set_number',(conv,params) => {
  const newNumber = conv.parameters.number
  const userID = conv.user.id

  return xService.setNumber(db, newNumber, userID, (liczba) => {
    notify(conv)
    conv.ask(locale.getResponse('newNumber',conv.user.locale) +  liczba)
  })
})

app.intent('set_random_number',(conv,params) => {
  const newNumber = xService.updateX()
  const userID = conv.user.id

  return xService.setNumber(db, newNumber.toString(), userID, (liczba) => {
    notify(conv)
    conv.ask(locale.getResponse('newRandomNumber',conv.user.locale) + liczba)
  })
})

app.intent('get_number',(conv,params) => {
  const userID = conv.user.id;
  return xService.getNumber(db, userID,(liczba) => {
    conv.ask(locale.getResponse('currentNumber',conv.user.locale) + liczba)
  })
})

app.intent('guess_number',(conv,params) => {
  const type = params['tip-category']
  const number = parseInt(params['number'])
  const userID = conv.user.id

  return xService.guessNumber(db,userID,type,number,
    () => conv.ask(locale.getResponse('guessIsLarger',conv.user.locale)),
    () => conv.ask(locale.getResponse('guessIsSmaller',conv.user.locale)),
    () => conv.ask(locale.getResponse('guessIsEqual',conv.user.locale)),
    () => conv.ask(locale.getResponse('guessIsMissed',conv.user.locale)),
    () => conv.ask(locale.getResponse('guessIsUndefinied',conv.user.locale))
  )
})

app.intent('send_notifications',(conv,params) => {
  notify(conv);
  return conv.ask(locale.getResponse('notificationSent',conv.user.locale))
})

function notify(conv) {
  const request = require('request');
  const google = require('googleapis');
  const serviceAccount = require('./service-account.json');
  const jwtClient = new google.auth.JWT(
    serviceAccount.client_email, null, serviceAccount.private_key,
    ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
    null
  );
  let notification = {
    userNotification: {
      title: locale.getResponse('notificationTitle',conv.user.locale),
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

exports.mojaLiczba = functions.https.onRequest(app);
