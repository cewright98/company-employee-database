const mysql = require('mysql2');

// connect to company database
const db = mysql.createConnection(
    {
        socketPath: '/tmp/mysql.sock',
        user: 'root',
        password: 'Rolo2020!',
        database: 'company'
    },
    console.log('Connected to the company database.')
);

module.exports = db;