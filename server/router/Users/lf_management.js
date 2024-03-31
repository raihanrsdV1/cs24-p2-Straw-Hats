var express = require('express');
var router = express.Router();

const pool = require('../../db');

router.post('/add_entry', async (req, res, next) => {
    try {
        const { registration_no, landfill_id, manager_id, weight_of_waste, toa, tod } = req.body;
        const entry = await pool.query(`
            INSERT INTO LANDFILL_VEHICLE_ENTRY (registration_no, landfill_id, manager_id, arrival_time, departure_time, weight_of_waste)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [registration_no, landfill_id, manager_id, toa, tod, weight_of_waste]);
        // return all entries of the landfill
        const entries = await pool.query(`SELECT * FROM LANDFILL_VEHICLE_ENTRY WHERE landfill_id = $1`, [landfill_id]);
        res.json(entries.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res, next) => {
    try {
        const landfill_id = req.body.landfill_id;
        const landfill = await pool.query(`SELECT * FROM LANDFILL WHERE landfill_id = $1`, [landfill_id]);
        const sts = await pool.query(`SELECT * FROM STS WHERE landfill_id = $1`, [landfill_id]);
        res.json({
            landfill: landfill.rows[0],
            sts: sts.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
