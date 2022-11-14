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

users.belongsTo(roles, {
  foreignKey:{
      name: 'roleId'
  }
})
roles.hasMany(users)

courses.belongsTo(users, {
  foreignKey:{
      name: 'instructorId'
  }
})
users.hasMany(courses)

purchases.belongsTo(users, {
  foreignKey:{
      name: 'studentId'
  }
})
users.hasMany(purchases)

purchases.belongsTo(courses, {
  foreignKey:{
      name: 'courseId'
  }
})
courses.hasMany(purchases)

reviews.belongsTo(users, {
  foreignKey:{
      name: 'studentId'
  }
})
users.hasMany(reviews)

reviews.belongsTo(courses, {
  foreignKey:{
      name: 'courseId'
  }
})
courses.hasMany(reviews)

module.exports = sequelize
