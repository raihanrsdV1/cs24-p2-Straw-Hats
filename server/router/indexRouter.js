var express = require('express');
var router = express.Router();

const pool = require('../db');
const authorization = require('../middlewares/authorization');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Hello duniya!!');
});


router.use('/auth', require('./Authorization/login'))

router.use('/users', require('./Users/users'))

module.exports = router;