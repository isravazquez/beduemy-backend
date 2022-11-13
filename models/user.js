const { DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            validate: {
                is: /^[a-zA-Z]+$/
            }
        },
        surname: {
            type: DataTypes.STRING(64),
            allowNull: false,
            validate: {
                is: /^[a-zA-Z]+$/
            }
        },
        email: {
            type: DataTypes.STRING(64),
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
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        hooks: {
            beforeCreate: (user) => {
                const salt = bcrypt.genSaltSync()
                user.password = bcrypt.hashSync(user.password, salt)
            }
        }
    })

    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password)
    }

    return User
}