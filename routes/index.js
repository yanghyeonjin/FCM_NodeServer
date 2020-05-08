var express = require('express');
var router = express.Router();

const firebaseAdmin = require('firebase-admin');
const serviceAccount = require("../config/firebase-adminsdk.json");
const db = require('../lib/db');

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
  const destination = req.body.destination; // 푸시알림 클릭 시 목적지

  // 목적지 액티비티 (백그라운드에서 작동하기 위해)
  let destActivity = "";
  if (destination == "page1") {
    destActivity = "PAGE_1_ACTIVITY"
  } else if (destination == "page2") {
    destActivity = "PAGE_2_ACTIVITY"
  } else if (destination == "page3") {
    destActivity = "PAGE_3_ACTIVITY"
  }

  // DB에 저장된 토큰 가져오기
  let sql = `
  SELECT token
  FROM device
  `;

  db.query(sql, function (err, rows) {
    if (err) throw err;
    if (rows.length > 0) {
      // This registration token comes from the client FCM SDKs.
      let registrationToken = rows[0].token;

      const message = {
        notification: {
          title: "FCM Notification Example",
          body: `GO TO ${destination}`
        },
        data: {
          destination: destination
        },
        token: registrationToken,
        android: {
          notification: {
            sound: "default",
            click_action: destActivity // 백그라운드에서 작동하기 위해
          }
        }
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
    }
  })
})

module.exports = router;
