const express = require('express');
const router = express.Router();
const pool = require('../../db');
const axios = require('axios'); // Import axios for making HTTP requests
const authorization = require('../../middlewares/authorization');

// a function that takes in the sts_id and returns the optimized route distance and time
async function getOptimizedRoute(sts_id) {
    // Get STS and landfill coordinates
    const stsCoordinates = await pool.query(`
        SELECT latitude, longitude FROM STS WHERE sts_id = $1
    `, [sts_id]);
    const landfillCoordinates = await pool.query(`
        SELECT L.latitude, L.longitude FROM LANDFILL L
        JOIN STS S ON L.landfill_id = S.landfill_id
        WHERE sts_id = $1
    `, [sts_id]);
    // Calculate route using Google Maps Directions API
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
            origin: `${stsCoordinates.rows[0].latitude},${stsCoordinates.rows[0].longitude}`,
            destination: `${landfillCoordinates.rows[0].latitude},${landfillCoordinates.rows[0].longitude}`,
            key: 'AIzaSyDA-D01obIlMkhnyn4JkMRV1gfVnba_2tg',
            // Add other parameters like traffic model, departure time, etc., as needed
            // Add departure time parameter if you want to consider traffic conditions
            // Also add trafic type as truck or equivalent

        }
    });
    // Extract route information from the response. jsut the distance in numeric and duration in minutes
    const route = response.data.routes[0].legs[0];
    const distance = route.distance.value/1000;
    const duration = route.duration.value/60;
    console.log(distance, duration);
    return { distance, duration };
}


// Route Optimization View: View and select optimized routes from STS to landfill
router.get('/route_optimization', async (req, res, next) => {
    try {
        // get the sts_id from the request
        let sts_id = req.body.sts_id;
        if (!sts_id) {
            sts_id = 1; // Default STS ID
        }

        // console.log(req.user);

        // //fetch the sts_id from the user
        // const sts_id_query = `
        //     SELECT sts_id FROM STS_MANAGEMENT WHERE manager_id = $1
        // `;
        // const sts_id_result = await pool.query(sts_id_query, [req.user]);
        // sts_id = sts_id_result.rows[0].sts_id;
        // console.log(sts_id);

        // Get STS and landfill coordinates
        const stsCoordinates = await pool.query(`
            SELECT latitude, longitude FROM STS WHERE sts_id = $1
        `, [sts_id]);
        const landfillCoordinates = await pool.query(`
            SELECT L.latitude, L.longitude FROM LANDFILL L
            JOIN STS S ON L.landfill_id = S.landfill_id
            WHERE sts_id = $1
        `, [sts_id]);

        console.log(stsCoordinates.rows[0]);
        console.log(landfillCoordinates.rows[0]);

        // Send response to the client
        res.json({
            stsCoordinates: stsCoordinates.rows[0],
            landfillCoordinates: landfillCoordinates.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// Fleet Optimization View: Generate the fleet of trucks needed for the day
router.get('/fleet_optimization', async (req, res, next) => {
    try {
        // Will return the list of vehciles and the amount of waste they have to carry also how many trips they have to make so that the cost is minimal then the number of vehciles are also minimal
        // first list all the vehicles that are available
        const vehicles_on_sts_query = `
            SELECT * FROM VEHICLE_ENTRY VE JOIN VEHICLE V ON VE.registration_no = V.registration_no JOIN VEHICLE_TYPE VT ON V.type_id = VT.id
            WHERE location_id = $1 AND departure_time IS NULL AND arrived_at = 'STS'
        `;
        const vehicles_on_sts_result = await pool.query(vehicles_on_sts_query, [sts_id]);
        const vehicles_on_sts = vehicles_on_sts_result.rows;

        // now get the distance and time from the sts to the landfill
        const route_info = await getOptimizedRoute(sts_id);

        let current_waste = 0;
        const sts_info = await pool.query(`
            SELECT current_waste FROM STS WHERE sts_id = $1
        `, [sts_id]);
        current_waste = sts_info.rows[0].current_waste;

        // now take into account the current waste in the sts and the capacity of the vehciles and the time and distance to the landfill
        // create an array from vehicles_on_sts with the capacity of the vehciles
        let vehicles = [];
        for (let i = 0; i < vehicles_on_sts.length; i++) {
            vehicles.push({
                registration_no: vehicles_on_sts[i].registration_no,
                capacity: vehicles_on_sts[i].capacity,
                loaded_cost: vehicles_on_sts[i].loaded_cost,
                unloaded_cost: vehicles_on_sts[i].unloaded_cost,
                assigned_waste: null,
                trips: null
            }); 
        }
        



        res.send('Fleet optimization view');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// Existing routes for STS management
// Add, delete, or modify existing routes as needed

// Get all info of the STS
router.get('/',authorization, async (req, res, next) => {
    try {
        // Retrieve STS info, vehicles, and connected landfill info
        const mid = req.user;
        
        const sts = await pool.query(`
            SELECT sts_id from STS_management WHERE manager_id = $1
        `, [mid])
        const sts_id = sts.rows[0].sts_id;

        // Query to fetch STS info and connected landfill info
        const sts_query = `
            SELECT S.*, L.landfill_id AS landfill_id, L.latitude AS landfill_latitude, L.longitude AS landfill_longitude, L.address AS landfill_address, L.landfill_capacity AS landfill_capacity, L.current_waste AS landfill_current_waste, L.operation_time AS landfill_operation_time, L.creator_id AS landfill_creator_id
            FROM STS S
            JOIN LANDFILL L ON S.landfill_id = L.landfill_id
            WHERE sts_id = $1
        `;

        const sts_result = await pool.query(sts_query, [sts_id]);
        const sts_info = sts_result.rows[0];

        // Query to fetch vehicles on the STS site
        // all info of the vehicles that are on the sts site. they have departure_time null on vehicle entry table
        const vehicles_on_sts_query = `
            SELECT * FROM VEHICLE_ENTRY VE JOIN VEHICLE V ON VE.registration_no = V.registration_no JOIN VEHICLE_TYPE VT ON V.type_id = VT.id
            WHERE location_id = $1 AND departure_time IS NULL AND arrived_at = 'STS'
        `;
        const vehicles_on_sts_result = await pool.query(vehicles_on_sts_query, [sts_id]);
        const vehicles_on_sts = vehicles_on_sts_result.rows;

        // Query to fetch vehicles off the STS site
        // all info of the vehicles that are off the sts site. they have departure_time not null on vehicle entry table
        const vehciles_off_sts_query = `
        SELECT * 
        FROM VEHICLE_ENTRY VE 
        JOIN VEHICLE V ON VE.registration_no = V.registration_no 
        JOIN VEHICLE_TYPE VT ON V.type_id = VT.id
        WHERE location_id = $1 
        AND arrived_at = 'STS'
        AND NOT EXISTS (
            SELECT 1 
            FROM VEHICLE_ENTRY 
            WHERE registration_no = VE.registration_no 
            AND departure_time IS NULL
        ) AND departure_time = (
            SELECT MAX(departure_time) 
            FROM VEHICLE_ENTRY 
            WHERE registration_no = VE.registration_no
        )
        `;
        const vehciles_off_sts_result = await pool.query(vehciles_off_sts_query, [sts_id]);
        const vehciles_off_sts = vehciles_off_sts_result.rows;

        res.json({
            sts: sts_info,
            vehicles_on_sts: vehicles_on_sts,
            vehicles_off_sts: vehciles_off_sts
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// add waste in sts
router.post('/add_waste', async (req, res, next) => {
    try {
        const { sts_id, weight_of_waste } = req.body;
        // simply update the waste in the sts
        const entry = await pool.query(`
            UPDATE STS
            SET current_waste = current_waste + $1
            WHERE sts_id = $2
            RETURNING *
        `, [weight_of_waste, sts_id]);
        res.json(entry.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Add entry of vehicles leaving the STS
router.post('/depart',authorization, async (req, res, next) => {
    try {
        const manager_id = req.user;
        const { registration_no, sts_id, weight_of_waste } = req.body;
        // simply update the departure time of the vehicle entry also update the weight of waste also from the route_optimization function get the distance and time also update manager_id
        const departure_time = new Date();
        const route_info = await getOptimizedRoute(sts_id);
        const distance = route_info.distance;
        const duration = route_info.duration;
        console.log(distance, duration);
        const entry = await pool.query(`
            UPDATE VEHICLE_ENTRY
            SET departure_time = $1, weight_of_waste = $2, estimated_distance = $3, estimated_duration = $4, manager_id = $5
            WHERE registration_no = $6 AND location_id = $7 AND departure_time IS NULL
            RETURNING *
        `, [departure_time, weight_of_waste, distance, duration, manager_id, registration_no, sts_id]);
        // update the current waste in the sts
        const sts_update = await pool.query(`
            UPDATE STS
            SET current_waste = current_waste - $1
            WHERE sts_id = $2
            RETURNING *
        `, [weight_of_waste, sts_id]);
        res.json(entry.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Add entry of vehicles arriving at the STS
router.post('/arrive', authorization, async (req, res, next) => {
    try {
        const manager_id = req.user;
        const { registration_no, sts_id } = req.body;
        // simply insert the vehicle entry with arrival time and weight of waste and manager_id
        const arrival_time = new Date();
        const entry = await pool.query(`
            INSERT INTO VEHICLE_ENTRY (registration_no, location_id, arrival_time, manager_id, arrived_at)
            VALUES ($1, $2, $3, $4, 'STS')
            RETURNING *
        `, [registration_no, sts_id, arrival_time, manager_id]);
        res.json(entry.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
