const { Sequelize } = require('sequelize');
const path = require('path');

// Check if we are in a production environment (look for DB_HOST, etc.)
const isProduction = process.env.DB_HOST && process.env.DB_USER;

let sequelize;

if (isProduction) {
    // Production: MySQL
    console.log('Using MySQL Database (Production Mode)');
    sequelize = new Sequelize(
        process.env.DB_NAME || 'bordoodles',
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            logging: false,
            port: process.env.DB_PORT || 3306,
            dialectOptions: {
                ssl: {
                    rejectUnauthorized: false // Often required for cloud DBs
                }
            }
        }
    );
} else {
    // Development: SQLite
    console.log('Using SQLite Database (Development Mode)');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '..', 'data', 'bordoodles.sqlite'),
        logging: false
    });
}

module.exports = sequelize;
