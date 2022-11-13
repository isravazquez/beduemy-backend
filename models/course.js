const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => sequelize.define('courses', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    instructorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})