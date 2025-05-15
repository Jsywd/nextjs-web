import mysql from 'mysql2';

export const mysqlPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'petstore',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
