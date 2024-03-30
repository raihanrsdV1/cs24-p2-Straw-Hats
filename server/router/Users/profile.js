var express = require('express');
var router = express.Router();

const pool = require('../../db');

router.get('/', async(req, res, next) => {
    // retrieve all info of a user based on the user_id given from frontend
    // also return the permissions of the user based on the role_id

    try{
        console.log(req.body);

        const user_id = req.body.user_id;
        const user = await pool.query(`SELECT * FROM person P 
            JOIN USER_ROLE U ON P.role_id = U.role_id
            WHERE id = $1
        `, [user_id]);
        // use subquery to retrieve all permissions of the user based on the role_id
        // btw i need the page infos of the permission
        const permissions = await pool.query(`SELECT PP.* FROM PERMISSIONS P
            JOIN PAGES PP ON P.page_id = PP.page_id
            WHERE role_id = $1
        `, [user.rows[0].role_id]);

        res.json({
            user: user.rows[0],
            permissions: permissions.rows
        });
    }
    catch(err){
        console.error(err.message);
    }
})



router.put('/', async(req, res, next) => {
    try{
        console.log(req.body);
        const {user_id, username, first_name, last_name, email, contact_no} = req.body;
        const user = await pool.query(`UPDATE person SET username = $1, first_name = $2, last_name = $3, email = $4, contact_no = $5
            WHERE id = $6
            RETURNING *
        `, [username, first_name, last_name, email, contact_no, user_id]);

        res.json(user.rows[0]);
    }
    catch(err){
        console.error(err.message);
    }
})

module.exports = router;