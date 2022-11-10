const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => sequelize.define('reviews', {
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
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            is: /^[0-5]$/
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})