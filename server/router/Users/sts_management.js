const express = require('express');
const router = express.Router();
const pool = require('../../db');
const axios = require('axios'); // Import axios for making HTTP requests

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
    // Extract route information from the response. jsut the distance and duration
    const routes = response.data.routes;
    const routeInfo = routes.map(route => ({
        distance: route.legs[0].distance.text,
        duration: route.legs[0].duration.text
    }));
    // return the shortest route
    return shortestRoute;
}


// Route Optimization View: View and select optimized routes from STS to landfill
router.get('/route_optimization', async (req, res, next) => {
    try {
        // get the sts_id from the request
        let sts_id = req.body.sts_id;
        if (!sts_id) {
            sts_id = 1; // Default STS ID
        }

        console.log(sts_id);

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
        // Implement fleet optimization logic here
        // Consider factors such as maximum number of trips per truck and minimum fuel consumption cost
        // Return the optimized fleet of trucks to the client
        res.send('Fleet optimization view');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// Existing routes for STS management
// Add, delete, or modify existing routes as needed

// Get all info of the STS
router.get('/', async (req, res, next) => {
    try {
        // Retrieve STS info, vehicles, and connected landfill info
        const sts_id = req.body.sts_id;
        const sts = await pool.query(`
            SELECT S.*, L.* FROM STS S
            JOIN LANDFILL L ON S.landfill_id = L.landfill_id
            WHERE sts_id = $1
        `, [sts_id]);
        const vehicles_on_sts = await pool.query(`
            SELECT * FROM VEHICLE WHERE sts_id = $1
        `, [sts_id]);
        
        res.json({
            sts: sts.rows[0],
            vehicles: vehicles.rows
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Add entry of vehicles leaving the STS
router.post('/add_entry', async (req, res, next) => {
    try {
        // Insert vehicle entry into the database

        const { registration_no, location_id, manager_id, weight_of_waste, toa, tod, arrived_at } = req.body;
        const {distance, duration} = await getOptimizedRoute(location_id);
        const entry = await pool.query(`
            INSERT INTO VEHICLE_ENTRY (registration_no, location_id, manager_id, arrival_time, departure_time, weight_of_waste, estimated_distance, arrived_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [registration_no, location_id, manager_id, toa, tod, weight_of_waste, , arrived_at]); // Initialize estimated_distance to 0
        res.json(entry.rows[0]); // Return the inserted entry
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
