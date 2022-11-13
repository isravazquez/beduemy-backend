const { Sequelize } = require('sequelize')

const userModel = require('../models/user')
const courseModel = require('../models/course')
const purchaseModel = require('../models/purchase')
const reviewModel = require('../models/review')
const roleModel = require('../models/role')

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
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
