var express = require('express');
var router = express.Router();

const pool = require('../../db');
const authorization = require('../../middlewares/authorization');

router.get('/', authorization, async(req, res, next) => {
    try{
        const users = pool.query(`SELECT * FROM person P 
            JOIN USER_ROLE U ON P.role_id = U.role_id
        `);
        
        res.json(users.rows);

    }
    catch(err){
        console.error(err.message);
    }
})

module.exports = router;