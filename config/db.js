const { Sequelize } = require('sequelize')

const userModel = require('../models/user')
const courseModel = require('../models/course')
const purchaseModel = require('../models/purchase')
const reviewModel = require('../models/review')
const roleModel = require('../models/role')


// const sequelize = new Sequelize('mysql://admin:12345678@beduemy.cgb2tc3redhd.us-east-2.rds.amazonaws.com:3306/mysql', {dialectOptions: {
//     ssl:
//     {
//         require: true, rejectUnauthorized: false
//     }
// }});

const sequelize = new Sequelize(
    'beduemy',
    'root',
    '',
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
