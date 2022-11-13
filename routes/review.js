const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const permission = require('../middleware/permission')

// Get all reviews
router.get('/', async (req, res) => {
    return await sequelize.models.reviews.findAndCountAll()
        .then((reviews) => {
            res.status(200).json({ data: reviews })
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });
});

// Get one review
router.get('/:id', async (req, res) => {   
    const { params: { id } } = req;
    // const review = await sequelize.models.reviews.findOne({
    //     where: { id },
    //     include: [      //Specifying author's name and course's
    //         { model: sequelize.models.users, attributes: ['id', 'name', 'surname'] },
    //         { model: sequelize.models.courses, attributes: ['id', 'name'] },
    //     ]
    // });
    // return res.status(200).json({ data: review });
    return await sequelize.models.reviews.findOne({
        where: { id },
        include: [      //Specifying author's name and course's
            { model: sequelize.models.users, attributes: ['name', 'surname'] }, //Detalle con foreign key de usuario
            { model: sequelize.models.courses, attributes: ['name'] },
        ]
    })
        .then((review) => {
            if (!review) {
                res.status(404).json({ code: 404, message: 'Review not found' })
            }
            else res.status(200).json({ data: review })
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });
});

// Creating a new review
router.post('/', permission(1,3), async (req, res) => {
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
        return await sequelize.models.reviews.create({
            studentId: body.studentId,
            courseId: body.courseId,
            score: body.score,
            comment: body.comment
        })
            .then(async (review) => {
                await review.save()
                res.status(201).json({ data: review })
            }).catch((err) => {
                res.status(404).json({ message: 'Error', data: err })
            });
    }
});

// Update a review by id
router.put('/:id', permission(1,3), async (req, res) => {
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
    return await sequelize.models.reviews.findByPk(id)
        .then(async (review) => {
            if (!review) {
                return res.status(404).json({ code: 404, message: 'Review not found' });
            }
            else {
                const updatedReview = await review.update({
                    studentId: body.studentId,
                    courseId: body.courseId,
                    score: body.score,
                    comment: body.comment
                });
                res.status(200).json({ data: updatedReview })
            }
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });
});

// Delete a review by id
router.delete('/:id', permission(1,3), async (req, res) => {
    const { params: { id } } = req;
    return await sequelize.models.reviews.findByPk(id)
        .then(async (review) => {
            if (!review) {
                return res.status(404).json({ code: 404, message: 'Review not found' });
            }
            else {
                await review.destroy();
                res.status(200).json({ message: `Review ${id} has been deleted` });
            }
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });
});

module.exports = router;