
import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": null,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USER,
    "password": null,
    "database": process.env.DB_NAME_TEST,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
