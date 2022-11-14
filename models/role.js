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
}, {
    hooks: {
        beforeCreate: function (order, options) {
            order.createdAt = new Date();
            order.updatedAt = new Date();
        },
        beforeUpdate: function (order, options) {
            order.updatedAt = new Date();
        },
    },
});