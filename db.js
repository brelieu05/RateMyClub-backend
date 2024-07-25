require('dotenv').config()
const Pool = require("pg").Pool;

const pool = new Pool({
    ssl: {
        rejectUnauthorized: false
    },
    user: process.env.REACT_APP_USER,
    password: process.env.REACT_APP_PASSWORD,
    host: process.env.REACT_APP_HOST,
    port: process.env.REACT_APP_PORT,
    database: process.env.REACT_APP_DATABASE
});

module.exports = pool;