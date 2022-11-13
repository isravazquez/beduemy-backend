const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const permission = require('../middleware/permission')

// Get all courses
router.get('/', async (req, res) => {
  return await sequelize.models.courses.findAndCountAll()
    .then((courses) => {
      res.status(200).json({ data: courses })
    }).catch((err) => {
      res.status(404).json({ message: 'Error', data: err })
    });
});

// Get one course
router.get('/:id', async (req, res) => {
  const { params: { id } } = req;
  // const order = await sequelize.models.courses.findOne({
  //     where: { id },
  //     include: [      //Specifying the instructor's name
  //         { model: sequelize.models.users, attributes: ['id', 'name', 'surname'] }
  //     ]
  // });
  // return res.status(200).json({ data: order });
  return await sequelize.models.courses.findOne({
    where: { id },
    include: [      //Specifying the instructor's name
      //{ model: sequelize.models.roles, attributes: ['name', 'surname'] } //Detalle con foreign key de usuario
    ]
  })
    .then((course) => {
      if (!course) {
        res.status(404).json({ code: 404, message: 'Course not found' })
      }
      else res.status(200).json({ data: course })
    }).catch((err) => {
      res.status(404).json({ message: 'Error', data: err })
    });
});

// Create a new course
router.post('/', permission(3), async (req, res) => {
  const { body } = req;
  const instructorId = body.instructorId;
  const instructor = await sequelize.models.users.findOne({
    where: {
      id: instructorId,
      roleId: 2
    }
  })
  if (!instructor) {
    return res.status(404).json({ code: 404, message: 'Instructor not found' });
  }
  else {
    return await sequelize.models.courses.create({
      instructorId: body.instructorId,
      name: body.name,
      price: body.price,
      description: body.description
    })
      .then(async (course) => {
        await course.save()
        res.status(201).json({ data: course })
      }).catch((err) => {
        res.status(404).json({ message: 'Error', data: err })
      });
  }
});

// Update a course by id
router.put('/:id', permission(3), async (req, res) => {
  const { body, params: { id } } = req;
  const instructorId = body.instructorId;
  if (instructorId) {
    const instructor = await sequelize.models.users.findOne({
      where: {
        id: instructorId,
        roleId: 2
      }
    })
    if (!instructor) {
      return res.status(404).json({ code: 404, message: 'Instructor not found' });
    }
  }
  return await sequelize.models.courses.findByPk(id)
    .then(async (course) => {
      if (!course) {
        return res.status(404).json({ code: 404, message: 'Course not found' });
      }
      else {
        const updatedCourse = await course.update({
          instructorId: body.instructorId,
          name: body.name,
          price: body.price,
          description: body.description,
        });
        res.status(200).json({ data: updatedCourse })
      }
    }).catch((err) => {
      res.status(404).json({ message: 'Error', data: err })
    });
});

// Delete a course by id
router.delete('/:id', permission(3), async (req, res) => {
  const { params: { id } } = req;
  return await sequelize.models.courses.findByPk(id)
    .then(async (course) => {
      if (!course) {
        return res.status(404).json({ code: 404, message: 'Course not found' });
      }
      else {
        await course.destroy();
        res.status(200).json({ message: `Course ${id} has been deleted` });
      }
    }).catch((err) => {
      res.status(404).json({ message: 'Error', data: err })
    });
});

module.exports = router;