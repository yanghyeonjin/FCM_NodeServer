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

  // 목적지 액티비티
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

      // notification 키를 사용하여 전달했을 때, 백그라운드 알림 이슈 있음.
      // data 키로 모든 값을 전달해서 해결.
      const message = {
        data: {
          title: "FCM Notification Example",
          body: `GO TO ${destination}`,
          destination: destination
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
    }
  })
})

module.exports = router;
