const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('roles', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    role: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})