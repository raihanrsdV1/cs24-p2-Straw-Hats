var express = require('express');
var router = express.Router();
const pool = require('../../db');
const authorization = require('../../middlewares/authorization');


router.get('/',authorization, async(req, res, next) => {
    try{
        const vehicleTypes = await pool.query(`SELECT * FROM vehicle_type`);
        res.json(vehicleTypes.rows);
    }
    catch(err){
        console.error(err.message);
    }
});

router.post('/', authorization, async(req, res, next) => {
    try{
        const { type, vehicle_capacity, loaded_cost, unloaded_cost } = req.body;
        if(![type, vehicle_capacity, loaded_cost, unloaded_cost].every(Boolean)){
            return res.status(401).json('Missing Credentials');
        }
        await pool.query(`
            INSERT INTO vehicle_type (type, vehicle_capacity, loaded_cost, unloaded_cost)
            VALUES ($1, $2, $3, $4)
        `, [type, vehicle_capacity, loaded_cost, unloaded_cost]);
        const vehicleTypes = await pool.query(`SELECT * FROM vehicle_type`);
        res.json(vehicleTypes.rows);
    }
    catch(err){
        console.error(err.message);
    }
});

router.put('/:id', authorization, async(req, res, next) => {
    try{
        const { id } = req.params;
        const { type, vehicle_capacity, loaded_cost, unloaded_cost } = req.body;
        if(![type, vehicle_capacity, loaded_cost, unloaded_cost].every(Boolean)){
            return res.status(401).json('Missing Credentials');
        }
        await pool.query(`
            UPDATE vehicle_type SET type = $1, vehicle_capacity = $2, loaded_cost = $3, unloaded_cost = $4 WHERE type_id = $5
        `, [type, vehicle_capacity, loaded_cost, unloaded_cost, id]);
        const vehicleTypes = await pool.query(`SELECT * FROM vehicle_type`);
        res.json(vehicleTypes.rows);
    }
    catch(err){
        console.error(err.message);
    }
});

router.delete('/:id', authorization, async(req, res, next) => {
    try{
        const { id } = req.params;
        await pool.query(`DELETE FROM vehicle_type WHERE type_id = $1`, [id]);
        const vehicleTypes = await pool.query(`SELECT * FROM vehicle_type`);
        res.json(vehicleTypes.rows);
    }
    catch(err){
        console.error(err.message);
    }
});

module.exports = router;