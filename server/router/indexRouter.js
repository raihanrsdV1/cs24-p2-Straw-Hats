var express = require('express');
var router = express.Router();

const pool = require('../db');
const authorization = require('../middlewares/authorization');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Hello duniya!!');
});


router.use('/auth', require('./Authorization/login'))

router.get('/users/roles', authorization, async(req, res, next) => {
  try{
      const roles = await pool.query(`SELECT * FROM "user_role"`);
      res.json(roles.rows);
  }
  catch(err){
      console.error(err.message);
  }
})

router.use('/users', require('./Users/users'));

router.use('/rbac/roles', require('./Roles/roles'));

router.use('/landfill', require('./Landfill/landfill'));

router.use('/sts', require('./Landfill/sts'));

router.use('/vehicle', require('./Landfill/vehicle'));

router.use('/vehicleType', require('./Landfill/vehicleType'));



module.exports = router;