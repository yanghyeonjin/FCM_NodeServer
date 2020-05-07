var express = require('express');
var router = express.Router();

const firebaseAdmin = require('firebase-admin');
const serviceAccount = require("../config/firebase-adminsdk.json");

/* Firebase Admin SDK 초기화 */
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* 단일 기기 PUSH 전송*/
router.post("/ajax/sendNotificationOne", function (req, res, next) {
  // This registration token comes from the client FCM SDKs.
  const registrationToken = "";

  const message = {
    notification: {
      title: "Test",
      body: "Test Push!"
    },
    data: {
      score: '850',
      time: '2:45'
    },
    token: registrationToken
  }

  // Send a message to the device corresponding to the provided
  // registration token.
  firebaseAdmin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      res.json(response);
    })
    .catch((error) => {
      console.log('Error sending message:', error)
    })
})

module.exports = router;
