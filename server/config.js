module.exports = {
  host: process.env.DB_HOST || 'defaultHost',
  user: process.env.DB_USER || 'defaultUser',
  password: process.env.DB_PASSWORD || 'defaultPassword',
  database: process.env.DB_NAME || 'defaultDatabase',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
