const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const permission = require('../middleware/permission')

// Get all purchases
router.get('/', permission(3), async (req, res) => {
  const purchases = await sequelize.models.purchases.findAndCountAll();
  return res.status(200).json({ data: purchases });
});

// Get one purchase
router.get('/:id', permission(3), async (req, res) => {
  const { params: { id } } = req;
  const purchase = await sequelize.models.purchases.findOne({
                  where: { id },
                  include: [  //Specifyng buyer's name and course's
                    { model: sequelize.models.users, attributes: ['id', 'name', 'surname']},
                    { model: sequelize.models.courses, attributes: ['id', 'name']},
                  ]
  });
  return res.status(200).json({ data: purchase });
});

// Creating a new purchase
router.post('/', permission(1,3), async (req, res) => {
  const { body } = req;
  const purchase = await sequelize.models.purchases.create({
    studentId: body.studentId,
    courseId: body.courseId
  });
  await purchase.save();
  return res.status(201).json({ data: purchase });
});

// Update a purchase by id
router.put('/:id', permission(3), async (req, res) => {
  const { body, params: { id } } = req;
  const purchase = await sequelize.models.purchases.findByPk(id);
  if (!purchase) {
    return res.status(404).json({ code: 404, message: 'Purchase not found' });
  }
  const updatedPurchase = await purchase.update({
    studentId: body.studentId,
    courseId: body.courseId
  });
  return res.json({ data: updatedPurchase });
});

// Delete a purchase by id
router.delete('/:id', permission(3), async (req, res) => {
  const { params: { id } } = req;
  const purchase = await sequelize.models.purchases.findByPk(id);
  if (!purchase) {
    return res.status(404).json({ code: 404, message: 'Purchase not found' });
  }
  await purchase.destroy();
  return res.json();
});

module.exports = router;