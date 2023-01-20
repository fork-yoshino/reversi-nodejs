import mysql from 'mysql2/promise';

export async function connectMySQL(): Promise<mysql.Connection> {
  return await mysql.createConnection({
    host: 'db',
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });
}
