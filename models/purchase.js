const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => sequelize.define('purchases', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'courses',
            key: 'id'
        },
        onDelete: 'CASCADE'
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