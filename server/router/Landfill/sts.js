
var express = require('express');
var router = express.Router();
const pool = require('../../db');
const authorization = require('../../middlewares/authorization');


router.get('/',authorization, async(req, res, next) => {
    try{
        const landfill = await pool.query(`SELECT *, (SELECT username FROM person WHERE id = S.creator_id) AS creator_name FROM STS S`);
        res.json(landfill.rows);
    }
    catch(err){
        console.error(err.message);
    }
});

router.post('/', authorization, async(req, res, next) => {
    try{
        const user_id = req.user;
        const {sts_capacity, latitude, longitude, address, ward_no, landfill_id} = req.body;
        if(![sts_capacity, latitude, longitude, address, ward_no, landfill_id].every(Boolean)){
            return res.status(401).json('Missing Credentials');
        }
        await pool.query(`
            INSERT INTO STS (sts_capacity, latitude, longitude, address, ward_no, landfill_id, creator_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [sts_capacity, latitude, longitude, address, ward_no, landfill_id, user_id]);

        const stss = await pool.query(`SELECT *, (SELECT username FROM person WHERE id = S.creator_id) AS creator_name, (SELECT address FROM LANDFILL WHERE LANDFILL_ID = S.LANDFILL_ID) AS landfill_name FROM STS S`);
        res.json(stss.rows);
    }
    catch(err){
        console.error(err.message);
    }
});


router.get('/assigned/:id', authorization, async(req, res, next) => {
    try{
        const { id } = req.params;
        const sts_managers = await pool.query(`
            SELECT * FROM PERSON P JOIN STS_MANAGEMENT SM ON SM.MANAGER_ID = P.ID WHERE SM.sts_id = $1
        `, [id]);
        res.json(sts_managers.rows);
    }
    catch(err){
        console.error(err.message);
    }
});

router.get('/available', authorization, async(req, res, next) => {
    try{
        
        const available_managers = await pool.query(`
        SELECT * FROM person WHERE id IN (SELECT id
            FROM PERSON
            WHERE role_id IN (
                SELECT role_id
                FROM USER_ROLE
                WHERE role_name = 'STS Manager'
            )
            EXCEPT
            SELECT id
            FROM PERSON
            WHERE id IN (
                SELECT manager_id
                FROM STS_MANAGEMENT
            ))
        `)

        res.json(available_managers.rows);
    }
    catch(err){
        console.error(err.message);
    }
});


router.get('/:id', authorization, async(req, res, next) => {
    try{
        const { id } = req.params;
        const sts = await pool.query(`SELECT *, (SELECT username FROM person WHERE id = S.creator_id) AS creator_name, (SELECT address FROM LANDFILL WHERE LANDFILL_ID = S.LANDFILL_ID) AS landfill_name  FROM sts S WHERE S.sts_id = $1`, [id]);
        res.json(sts.rows[0]);
    }
    catch(err){
        console.error(err.message);
    }
});


router.get('/vehicle_logs/:id', authorization, async(req, res, next) => {
    try{
        const { id } = req.params;
        const logs = await pool.query(`
            SELECT *, (SELECT username FROM person WHERE ID = VE.manager_id) as username FROM VEHICLE_ENTRY VE
            WHERE location_id = $1 AND arrived_at = 'STS';
        `, [id])
        res.json(logs.rows);
    }
    catch(err){
        console.error(err.message);
    }
});

router.post('/assign_manager', authorization, async(req, res, next) => {
    try{
        const { manager_id, sts_id } = req.body;
        const admin_id = req.user;
        const admin = await pool.query('SELECT * FROM person WHERE id = $1', [admin_id]);
        if(admin.rows[0].role_id !== 1){
            return res.status(401).json('Not Authorized');
        }

        if(![manager_id, sts_id].every(Boolean)){
            return res.status(401).json('Missing Credentials');
        }
        await pool.query(`
            INSERT INTO sts_management(manager_id, sts_id, admin_id)
            VALUES ($1, $2, $3)
        `, [manager_id, sts_id, admin_id]);


        const sts_managers = await pool.query(`
            SELECT * FROM PERSON P JOIN STS_MANAGEMENT SM ON SM.MANAGER_ID = P.ID WHERE SM.STS_ID = $1
        `, [sts_id]);

        res.json(sts_managers.rows);

        
    }
    catch(err){
        console.error(err.message);
    }
});


router.post('/remove_manager', authorization, async(req, res, next) => {
    try{
        const { manager_id, sts_id } = req.body;
        console.log(manager_id, sts_id);
        const admin_id = req.user;
        const admin = await pool.query('SELECT * FROM person WHERE id = $1', [admin_id]);
        if(admin.rows[0].role_id !== 1){
            return res.status(401).json({
                message: 'Not Authorized',
            });
        }

        if(![manager_id, sts_id].every(Boolean)){
            return res.status(401).json({
                message: 'Missing Credentials',
            });
        }
        
        
        await pool.query(`
            DELETE FROM sts_management WHERE manager_id = $1 AND sts_id = $2
        `, [manager_id, sts_id]);

        const available_managers = await pool.query(`
        SELECT * FROM person WHERE id IN (SELECT id
            FROM PERSON
            WHERE role_id IN (
                SELECT role_id
                FROM USER_ROLE
                WHERE role_name = 'STS Manager'
            )
            EXCEPT
            SELECT id
            FROM PERSON
            WHERE id IN (
                SELECT manager_id
                FROM STS_MANAGEMENT
            ))
        `)

        res.json(available_managers.rows);

    }
    catch(err){
        console.error(err.message);
    }
})
module.exports = router;