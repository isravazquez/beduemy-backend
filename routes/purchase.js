const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');

// Get all purchases
router.get('/', async (req, res) => {
  return await sequelize.models.purchases.findAndCountAll()
    .then((purchases) => {
      res.status(200).json({ data: purchases })
    }).catch((err) => {
      res.status(404).json({ message: 'Error', data: err })
    });
});

// Get one purchase
router.get('/:id', async (req, res) => {
  const { params: { id } } = req;
  // const purchase = await sequelize.models.purchases.findOne({
  //   where: { id },
  //   include: [  //Specifyng buyer's name and course's
  //     { model: sequelize.models.users, attributes: ['name', 'surname'] },
  //     { model: sequelize.models.courses, attributes: ['name'] },
  //   ]
  // });
  // return res.status(200).json({ data: purchase });
  return await sequelize.models.purchases.findOne({
    where: { id },
    include: [      //Specifying author's name and course's
      { model: sequelize.models.users, attributes: ['name', 'surname'] }, //Detalle con foreign key de usuario
      { model: sequelize.models.courses, attributes: ['name'] },
    ]
  })
    .then((purchase) => {
      if (!purchase) {
        res.status(404).json({ code: 404, message: 'Purchase not found' })
      }
      else res.status(200).json({ data: purchase })
    }).catch((err) => {
      res.status(404).json({ message: 'Error', data: err })
    });
});

// Creating a new purchase
router.post('/', async (req, res) => {
  const { body } = req;
  const studentId = body.studentId;
  const courseId = body.courseId;
  const student = await sequelize.models.users.findOne({
    where: {
      id: studentId,
      roleId: 1
    }
  })
  const course = await sequelize.models.courses.findOne({
    where: {
      id: courseId
    }
  })
  if (!student) {
    return res.status(404).json({ code: 404, message: 'Student not found' });
  }
  else if (!course) {
    return res.status(404).json({ code: 404, message: 'Course not found' });
  }
  else {
    return await sequelize.models.purchases.create({
      studentId: body.studentId,
      courseId: body.courseId
    })
      .then(async (purchase) => {
        await purchase.save()
        res.status(201).json({ data: purchase })
      }).catch((err) => {
        res.status(404).json({ message: 'Error', data: err })
      });
  }
});

// Update a purchase by id
router.put('/:id', async (req, res) => {
  const { body, params: { id } } = req;
  const studentId = body.studentId;
  const courseId = body.courseId;
  if (studentId) {
      const student = await sequelize.models.users.findOne({
          where: {
              id: studentId,
              roleId: 1
          }
      })
      if (!student) {
          return res.status(404).json({ code: 404, message: 'Student not found' });
      }
  }
  if (courseId) {
      const course = await sequelize.models.courses.findOne({
          where: {
              id: courseId
          }
      })
      if (!course) {
          return res.status(404).json({ code: 404, message: 'Course not found' });
      }
  }
  return await sequelize.models.purchases.findByPk(id)
      .then(async (purchase) => {
          if (!purchase) {
              return res.status(404).json({ code: 404, message: 'Purchase not found' });
          }
          else {
              const updatedPurchase = await purchase.update({
                studentId: body.studentId,
                courseId: body.courseId
              });
              res.status(200).json({ data: updatedPurchase })
          }
      }).catch((err) => {
          res.status(404).json({ message: 'Error', data: err })
      });
});

// Delete a purchase by id
router.delete('/:id', async (req, res) => {
  const { params: { id } } = req;
  return await sequelize.models.purchases.findByPk(id)
  .then(async (purchase) => {
      if (!purchase) {
          return res.status(404).json({ code: 404, message: 'Purchase not found' });
      }
      else {
          await purchase.destroy();
          res.status(200).json({ message: `Purchase ${id} has been deleted` });
      }
  }).catch((err) => {
      res.status(404).json({ message: 'Error', data: err })
  });
});

module.exports = router;