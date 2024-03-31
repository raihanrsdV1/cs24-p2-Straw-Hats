var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../../db');
const authorization = require('../../middlewares/authorization');


router.get('/', authorization, async(req, res, next) => {
    try{
        const users = await pool.query(`SELECT * FROM person P 
            LEFT JOIN USER_ROLE U ON P.role_id = U.role_id
        `);
        

        // console.log('these are all the users', users.rows);
        res.json(users.rows);

    }
    catch(err){
        console.error(err.message);
    }
})


router.get('/:id', authorization, async(req, res, next) => {
    try{
        const { id } = req.params;
        const user = await pool.query(`SELECT * FROM person P 
            JOIN USER_ROLE U ON P.role_id = U.role_id
            WHERE P.id = $1
        `, [id]);

        res.json(user.rows[0]);

    }
    catch(err){
        console.error(err.message);
    }
})

// function validEmail(userEmail) {
//     return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
//   }


router.post('/', authorization, async(req, res, next) => {
    try{
        const { username, full_name, email, contact_no, password, confirmed_password, role_id } = req.body;

        
        if(confirmed_password !== password){
            return res.status(401).json('Passwords do not match');
        }

        console.log("point 2");
        console.log(username, full_name, email, contact_no, password, role_id);
        if(![username, full_name, email, contact_no, password, role_id].every(Boolean)){
            return res.status(401).json('Missing Credentials');
        }

        
        console.log("point 1");
        const user = await pool.query('SELECT * FROM person WHERE email = $1 OR username = $2 OR contact_no = $3', [email, username, contact_no]);
        if(user.rows.length !== 0){
            return res.status(401).send('User already exists');
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);
        let newUser;
        if(role_id !== '0'){
            newUser = await pool.query(`INSERT INTO person (username, full_name, email, password, role_id, contact_no) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `, [username, full_name, email, bcryptPassword, role_id, contact_no]);
        }
        else{
            newUser = await pool.query(`INSERT INTO person (username, full_name, email, password, contact_no) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `, [username, full_name, email, bcryptPassword, contact_no]);
        }

        res.json({
            message: 'User Created',
            user: newUser.rows[0]
        });

    }
    catch(err){
        console.error(err.message);
    }
});

router.put('/:id', authorization, async(req, res, next) => {
    try{
        const current_user = req.user;
        const role = await pool.query(`SELECT R.role_name FROM person P JOIN user_role R on P.role_id = R.role_id WHERE P.id = $1`, [current_user]);

        if(role.rows[0].role_name !== 'System Admin' && current_user !== req.params.id){
            return res.status(401).json('Unauthorized');
        }
        const { id } = req.params;
        const { username, full_name, email, contact_no } = req.body;

        const user = await pool.query(`SELECT * FROM person WHERE id = $1`, [id]);

        if(user.rows.length === 0){
            return res.status(401).json('User does not exist');
        }

        const updatedUser = await pool.query(`UPDATE person SET username = $1, full_name = $2, email = $3, contact_no = $4 WHERE id = $5 RETURNING *`, [username, full_name, email, contact_no, id]);

        res.json({
            message: 'User Updated',
            user: updatedUser.rows[0]
        });
    }
    catch(err){
        console.error(err.message);
    }
})


router.delete('/:id', authorization, async(req, res, next) => {
    try{
        const current_user = req.user;
        const role = await pool.query(`SELECT R.role_name FROM person P JOIN user_role R on P.role_id = R.role_id WHERE P.id = $1`, [current_user]);

        if(role.rows[0].role_name !== 'System Admin'){
            return res.status(401).json('Unauthorized');
        }
        const { id } = req.params;
        const user = await pool.query(`SELECT * FROM person WHERE id = $1`, [id]);

        if(user.rows.length === 0){
            return res.status(401).json('User does not exist');
        }

        await pool.query(`DELETE FROM person WHERE id = $1`, [id]);

        res.json('User Deleted');
    }
    catch(err){
        console.error(err.message);
    }
})


router.put('/:id/roles', authorization, async(req, res, next) => {
    try{
        const current_user = req.user;
        const role = await pool.query(`SELECT R.role_name FROM person P JOIN user_role R on P.role_id = R.role_id WHERE P.id = $1`, [current_user]);

        if(role.rows[0].role_name !== 'System Admin'){
            return res.status(401).json('Unauthorized');
        }
        const { id } = req.params;
        const { role_id } = req.body;

        const user = await pool.query(`SELECT * FROM person WHERE id = $1`, [id]);

        if(user.rows.length === 0){
            return res.status(401).json('User does not exist');
        }
        let updatedUser;
        if(role_id === '0'){
            updatedUser = await pool.query(`UPDATE person SET role_id = NULL WHERE id = $1 RETURNING *`, [id]);
        }
        else{
            updatedUser = await pool.query(`UPDATE person SET role_id = $1 WHERE id = $2 RETURNING *`, [role_id, id]);
        }

        

        res.json({
            message: 'User Role Updated',
            user: updatedUser.rows[0]
        });
    }
    catch(err){
        console.error(err.message);
    }
})


module.exports = router;