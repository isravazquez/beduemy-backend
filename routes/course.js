const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const permission = require('../middleware/permission')

// Get all courses
router.get('/', async (req, res) => {
  const courses = await sequelize.models.courses.findAndCountAll();
  return res.status(200).json({ data: courses });
});

// Get one course
router.get('/:id', async (req, res) => {
  const { params: { id } } = req;
  const order = await sequelize.models.courses.findOne({
      where: { id },
      include: [      //Specifying the instructor's name
          { model: sequelize.models.users, attributes: ['id', 'name', 'surname'] }
      ]
  });
  return res.status(200).json({ data: order });
});

// Create a new course
router.post('/', permission(3), async (req, res) => {
  const { body } = req;
  const course = await sequelize.models.courses.create({
    instructorId: body.instructorId,
    name: body.name,
    price: body.price,
    description: body.description
  });
  await course.save();
  return res.status(201).json({ data: course })
});

// Update a course by id
router.put('/:id', permission(3), async (req, res) => {
  const { body, params: { id } } = req;
  const course = await sequelize.models.courses.findByPk(id);
  if (!course) {
    return res.status(404).json({ code: 404, message: 'Course not found' });
  }
  const updatedCourse = await course.update({
    instructorId: body.instructorId,
    name: body.name,
    price: body.price,
    description: body.description
  });
  return res.json({ data: updatedCourse });
});

// Delete a course by id
router.delete('/:id', permission(3), async (req, res) => {
  const { params: { id } } = req;
  const course = await sequelize.models.courses.findByPk(id);
  if (!course) {
    return res.status(404).json({ code: 404, message: 'Course not found' });
  }
  await course.destroy();
  return res.json();
});

module.exports = router;