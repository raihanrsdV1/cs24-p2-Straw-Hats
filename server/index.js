/*const express = require('express');
const app = express();

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello from backend!');
});

// Define other routes as needed...

// Set the port for the server to listen on
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/


const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();
const bodyParser = require('body-parser');
const router = express.Router();
const adminRouter = require('./router/adminRouter')
const indexRouter = require('./router/indexRouter')
const profileRouter = require('./router/Users/profile')
const sts_managementRouter = require('./router/Users/sts_management')
const lf_managementRouter = require('./router/Users/lf_management')

//const systemRoutes = require('./routes/systemRoutes');

const app = express();
app.use(cors());
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
//app.use('/api', systemRoutes);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.use('/test', async(req, res, next) => {
  try{
      const data = await pool.query('SELECT * from demo_table');
      console.log('test has been called');
     
      res.json(data.rows);
  }
  catch(err){
      console.error(err.message);
      res.status(500).send('Server Error noice');
  }
});

app.use('/insert', async(req, res, next) => {
  try {
    // Insert random data into the demo_table
    const randomName = 'Random Name';
    const randomAge = Math.floor(Math.random() * 100); // Generate a random age
    const randomEmail = 'random@example.com';

    await pool.query('INSERT INTO demo_table (name, age, email) VALUES ($1, $2, $3)', [randomName, randomAge, randomEmail]);

    // Retrieve data from demo_table
    const data = await pool.query('SELECT * FROM demo_table');

    console.log('Data inserted successfully');
    res.json(data.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.use('/something', async(req, res, next) => {
  try {
    // Insert random data into the demo_table
    res.json({
      message: "something"
    })
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/profile', profileRouter);
app.use('/sts_management', sts_managementRouter);
app.use('/lf_management', lf_managementRouter);




