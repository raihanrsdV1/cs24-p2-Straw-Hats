
var express = require('express');
var router = express.Router();
const pool = require('../../db');
const authorization = require('../../middlewares/authorization');


router.get('/',authorization, async(req, res, next) => {
    try{
        const landfill = await pool.query(`SELECT *, (SELECT username FROM person WHERE id = L.creator_id) AS creator_name FROM landfill L`);
        res.json(landfill.rows);
    }
    catch(err){
        console.error(err.message);
    }
});

router.post('/', authorization, async(req, res, next) => {
    try{
        const user_id = req.user;
        const {latitude, longitude, address, landfill_capacity, operation_time} = req.body;
        if(![latitude, longitude, address, landfill_capacity, operation_time].every(Boolean)){
            return res.status(401).json('Missing Credentials');
        }
        await pool.query(`
            INSERT INTO landfill (latitude, longitude, address, landfill_capacity, operation_time, creator_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [latitude, longitude, address, landfill_capacity, operation_time, user_id]);
        const landfill = await pool.query(`SELECT *, (SELECT username FROM person WHERE id = L.creator_id) AS creator_name FROM landfill`);
        res.json(landfill.rows);
    }
    catch(err){
        console.error(err.message);
    }
});


router.get('/assigned/:id', authorization, async(req, res, next) => {
    try{
        const { id } = req.params;
        const landfill_managers = await pool.query(`
            SELECT * FROM PERSON P JOIN LANDFILL_MANAGEMENT LM ON LM.MANAGER_ID = P.ID WHERE LM.LANDFILL_ID = $1
        `, [id]);
        res.json(landfill_managers.rows);
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
                WHERE role_name = 'Landfill Manager'
            )
            EXCEPT
            SELECT id
            FROM PERSON
            WHERE id IN (
                SELECT manager_id
                FROM LANDFILL_MANAGEMENT
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
        const landfill = await pool.query(`SELECT *, (SELECT username FROM person WHERE id = L.creator_id) AS creator_name FROM landfill L WHERE L.landfill_id = $1`, [id]);
        res.json(landfill.rows[0]);
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
            WHERE location_id = $1 AND arrived_at = 'Landfill';
        `, [id])
        res.json(logs.rows);
    }
    catch(err){
        console.error(err.message);
    }
});

router.post('/assign_manager', authorization, async(req, res, next) => {
    try{
        const { manager_id, landfill_id } = req.body;
        const admin_id = req.user;
        const admin = await pool.query('SELECT * FROM person WHERE id = $1', [admin_id]);
        if(admin.rows[0].role_id !== 1){
            return res.status(401).json('Not Authorized');
        }

        if(![manager_id, landfill_id].every(Boolean)){
            return res.status(401).json('Missing Credentials');
        }
        await pool.query(`
            INSERT INTO landfill_management(manager_id, landfill_id, admin_id)
            VALUES ($1, $2, $3)
        `, [manager_id, landfill_id, admin_id]);


        const landfill_managers = await pool.query(`
            SELECT * FROM PERSON P JOIN LANDFILL_MANAGEMENT LM ON LM.MANAGER_ID = P.ID WHERE LM.LANDFILL_ID = $1
        `, [landfill_id]);

        res.json(landfill_managers.rows);

        
    }
    catch(err){
        console.error(err.message);
    }
});


router.post('/remove_manager', authorization, async(req, res, next) => {
    try{
        const { manager_id, landfill_id } = req.body;
        console.log(manager_id, landfill_id);
        const admin_id = req.user;
        const admin = await pool.query('SELECT * FROM person WHERE id = $1', [admin_id]);
        if(admin.rows[0].role_id !== 1){
            return res.status(401).json({
                message: 'Not Authorized',
            });
        }

        if(![manager_id, landfill_id].every(Boolean)){
            return res.status(401).json({
                message: 'Missing Credentials',
            });
        }
        const record = await pool.query(`
            SELECT * FROM landfill_management WHERE manager_id = $1 AND landfill_id = $2`, 
            [manager_id, parseInt(landfill_id)]);
        console.log(record.rows);
        
        await pool.query(`
            DELETE FROM landfill_management WHERE manager_id = $1 AND landfill_id = $2
        `, [manager_id, landfill_id]);

        const available_managers = await pool.query(`
        SELECT * FROM person WHERE id IN (SELECT id
            FROM PERSON
            WHERE role_id IN (
                SELECT role_id
                FROM USER_ROLE
                WHERE role_name = 'Landfill Manager'
            )
            EXCEPT
            SELECT id
            FROM PERSON
            WHERE id IN (
                SELECT manager_id
                FROM LANDFILL_MANAGEMENT
            ))
        `)

        res.json(available_managers.rows);

    }
    catch(err){
        console.error(err.message);
    }
})
module.exports = router;