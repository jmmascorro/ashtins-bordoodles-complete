const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Puppy = sequelize.define('Puppy', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    breed: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING
    },
    gender: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Available'
    },
    dob: {
        type: DataTypes.DATEONLY
    },
    description: {
        type: DataTypes.TEXT
    },
    images: {
        type: DataTypes.JSON, // Stores array of strings: ["/img1.png", "/img2.png"]
        defaultValue: []
    }
});

module.exports = Puppy;
