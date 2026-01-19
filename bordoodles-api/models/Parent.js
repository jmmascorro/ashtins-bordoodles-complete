const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Parent = sequelize.define('Parent', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING, // Sire or Dam
        allowNull: false
    },
    breed: {
        type: DataTypes.STRING
    },
    color: {
        type: DataTypes.STRING
    },
    weight: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    image: {
        type: DataTypes.STRING
    }
});

module.exports = Parent;
