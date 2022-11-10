const { Sequelize } = require('sequelize')

const userModel = require('../models/user')
const courseModel = require('../models/course')
const purchaseModel = require('../models/purchase')
const reviewModel = require('../models/review')
const roleModel = require('../models/review')

const sequelize = new Sequelize(
    'beduemy',
    'root',
    'password',
    {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306,
        logging: false
    }
)

const models = [userModel, courseModel, purchaseModel, reviewModel, roleModel]

for (let model of models)
    model(sequelize)

const { users, courses, purchases, reviews, roles } = sequelize.models;

users.belongsTo(roles)
courses.belongsTo(users)
purchases.belongsTo(users)
purchases.belongsTo(courses)
reviews.belongsTo(users)
reviews.belongsTo(courses)

module.exports = sequelize
