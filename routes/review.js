const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const permission = require('../middleware/permission')

// Get all reviews
router.get('/', async (req, res) => {
    const reviews = await sequelize.models.reviews.findAndCountAll();
    return res.status(200).json({ data: reviews });
});

// Get one review
router.get('/:id', async (req, res) => {
    const { params: { id } } = req;
    const review = await sequelize.models.reviews.findOne({
        where: { id },
        include: [      //Specifying author's name and course's
            { model: sequelize.models.users, attributes: ['id', 'name', 'surname'] },
            { model: sequelize.models.courses, attributes: ['id', 'name'] },
        ]
    });
    return res.status(200).json({ data: review });
});

// Creating a new review
router.post('/', permission(1,3), async (req, res) => {
    const { body } = req;
    const review = await sequelize.models.reviews.create({
        studentId: body.studentId,
        courseId: body.courseId,
        score: body.score,
        comment: body.comment
    });
    await review.save();
    return res.status(201).json({ data: review });
});

// Update a review by id
router.put('/:id', permission(1,3), async (req, res) => {
    const { body, params: { id } } = req;
    const review = await sequelize.models.reviews.findByPk(id);
    if (!review) {
        return res.status(404).json({ code: 404, message: 'Review not found' });
    }
    const updatedReview = await product.update({
        studentId: body.studentId,
        courseId: body.courseId,
        score: body.score,
        comment: body.comment
    });
    return res.json({ data: updatedReview });
});

// Delete a review by id
router.delete('/:id', permission(1,3), async (req, res) => {
    const { params: { id } } = req;
    const review = await sequelize.models.reviews.findByPk(id);
    if (!review) {
        return res.status(404).json({ code: 404, message: 'Review not found' });
    }
    await review.destroy();
    return res.json();
});

module.exports = router;