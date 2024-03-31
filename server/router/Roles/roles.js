
var express = require('express');
var router = express.Router();

const pool = require('../../db');
const authorization = require('../../middlewares/authorization');



router.get('/', authorization, async(req, res, next) => {
    try{
        const roles = await pool.query(`SELECT * FROM user_role`);
        res.json(roles.rows);
    }
    catch(err){
        console.error(err.message);
    }
});

router.post('/', authorization, async(req, res, next) => {
    try{
        const user = await pool.query('SELECT * FROM person WHERE id = $1', [req.user]);
        if(user.rows[0].role_id !== 1){
            return res.status(401).json('Not Authorized');
        }
        console.log(req.body);
        const { roleName } = req.body;

        if(!roleName){
            return res.status(401).json('Missing Credentials');
        }
        await pool.query(`INSERT INTO user_role (role_name) VALUES ($1) `, [roleName]);
        const roles = await pool.query(`SELECT * FROM user_role`);
        res.json({
            roles: roles.rows,
            message: 'Role Added Successfully',
            success: true,
        });
    }
    catch(err){
        console.error(err.message);
    }
});

router.put('/:id', authorization, async(req, res, next) => {
    try{
        const user = await pool.query('SELECT * FROM person WHERE id = $1', [req.user]);
        if(user.rows[0].role_id !== 1){
            return res.status(401).json('Not Authorized');
        }
        const { id } = req.params;
        const { roleName } = req.body;

        if(!roleName){
            return res.status(401).json('Missing Credentials');
        }
        await pool.query(`UPDATE user_role SET role_name = $1 WHERE role_id = $2`, [roleName, id]);
        const roles = await pool.query(`SELECT * FROM user_role`);
        res.json({
            roles: roles.rows,
            message: 'Role Updated Successfully',
            success: true,
        });
    }
    catch(err){
        console.error(err.message);
    }
});

router.delete('/:id', authorization, async(req, res, next) => {
    try{
        const user = await pool.query('SELECT * FROM person WHERE id = $1', [req.user]);
        if(user.rows[0].role_id !== 1){
            return res.status(401).json('Not Authorized');
        }
        const { id } = req.params;

        await pool.query(`DELETE FROM user_role WHERE role_id = $1`, [id]);
        const roles = await pool.query(`SELECT * FROM user_role`);
        res.json({
            roles: roles.rows,
            message: 'Role Deleted Successfully',
            success: true,
        });
    }
    catch(err){
        console.error(err.message);
    }
});



module.exports = router;

