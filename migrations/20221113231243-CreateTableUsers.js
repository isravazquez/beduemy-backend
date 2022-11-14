'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name: {
        type: Sequelize.STRING(32),
        allowNull: false,
        validate: {
            is: /^[a-zA-Z]+$/
        }
    },
    surname: {
        type: Sequelize.STRING(64),
        allowNull: false,
        validate: {
            is: /^[a-zA-Z]+$/
        }
    },
    email: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    roleId: {
        type: Sequelize.INTEGER,

        allowNull: false,

        validate: {
            is: /^[1-3]+$/
        },
        references: {
            model: 'roles',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    }
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users')
  }
};
