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

module.exports = router;
