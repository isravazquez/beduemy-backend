const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => sequelize.define('purchases', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
    },
    studentId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    courseId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'courses',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
})