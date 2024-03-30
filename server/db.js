const Pool = require('pg').Pool;

// const pool = new Pool({
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     host: process.env.DB_HOST,
//     post: 5432,
//     database: process.env.DB_NAME
// });

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    post: 5432,
    database: 'my_demo_database'
});


module.exports = pool;
