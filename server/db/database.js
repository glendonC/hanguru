const mysql = require('mysql2/promise');
const config = require('../config');

const pool = mysql.createPool(config);

module.exports = pool;
