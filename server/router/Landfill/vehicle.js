var express = require('express');
var router = express.Router();
const pool = require('../../db');
const authorization = require('../../middlewares/authorization');


router.get('/',authorization, async(req, res, next) => {
    try{
        const vehicles = await pool.query(`SELECT 
        V.registration_no,
        V.model,
        VT.type AS vehicle_type,
        VT.vehicle_capacity,
        VT.loaded_cost,
        VT.unloaded_cost,
        STS.sts_id,
        STS.sts_capacity,
        STS.latitude,
        STS.longitude,
        STS.address,
        STS.ward_no,
        STS.landfill_id
    FROM 
        VEHICLE V
    JOIN 
        VEHICLE_TYPE VT ON V.type_id = VT.id
    JOIN 
        STS_VEHICLE_ASSIGNMENT SVA ON V.registration_no = SVA.registration_no
    JOIN 
        STS ON SVA.sts_id = STS.sts_id;
    `);
        res.json(vehicles.rows);
    }
    catch(err){
        console.error(err.message);
    }
});


router.post('/', authorization, async(req, res, next) => {
    
    try{
        const {registration_no, type_id, model, sts_id} = req.body;
        const assign_id = req.user;
        if(![registration_no, type_id, model].every(Boolean)){
            return res.status(401).json('Missing Credentials');
        }
        await pool.query(`
            INSERT INTO vehicle (registration_no, type_id, model)
            VALUES ($1, $2, $3)
        `, [registration_no, type_id, model]);

        await pool.query(`
            INSERT INTO STS_VEHICLE_ASSIGNMENT (sts_id, registration_no, assign_id)
            VALUES ($1, $2, $3)
        `, [sts_id, registration_no, assign_id]);
        const vehicles = await pool.query(`SELECT 
        V.registration_no,
        V.model,
        VT.type AS vehicle_type,
        VT.vehicle_capacity,
        VT.loaded_cost,
        VT.unloaded_cost,
        STS.sts_id,
        STS.sts_capacity,
        STS.latitude,
        STS.longitude,
        STS.address,
        STS.ward_no,
        STS.landfill_id
    FROM 
        VEHICLE V
    JOIN 
        VEHICLE_TYPE VT ON V.type_id = VT.id
    JOIN 
        STS_VEHICLE_ASSIGNMENT SVA ON V.registration_no = SVA.registration_no
    JOIN 
        STS ON SVA.sts_id = STS.sts_id;
    `);
        res.json(vehicles.rows);
    }
    catch(err){
        console.error(err.message);
    }
})


module.exports = router;