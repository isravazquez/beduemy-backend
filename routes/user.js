const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const permission = require('../middleware/permission')

// Get all users
router.get('/', permission(2,3), async (req, res) => {
    return await sequelize.models.users.findAndCountAll()
        .then((users) => {
            res.status(200).json({ data: users })
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });
});

// Get one user
router.get('/:id', permission(2,3), async (req, res) => {
    const { params: { id } } = req;
    return await sequelize.models.users.findOne({
        where: { id },
        include: [      //Specifying the role
            { model: sequelize.models.roles, attributes: ['role'] }
        ]
    })
        .then((user) => {
            if (!user) {
                res.status(404).json({ code: 404, message: 'User not found' })
            }
            else res.status(200).json({ data: user })
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });
});

// Creating a new user
router.post('/', permission(3), async (req, res) => {
    const { body } = req;
    return await sequelize.models.users.create({
        name: body.name,
        surname: body.surname,
        email: body.email,
        roleId: 1, //Role 1 = Student
        password: body.password
    })
        .then(async (user) => {
            await user.save()
            res.status(201).json({ data: user })
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });
});

// Update a user by id
router.put('/:id', permission(3), async (req, res) => {
    const { body, params: { id } } = req;
    return await sequelize.models.users.findByPk(id)
        .then(async (user) => {
            if (!user) {
                return res.status(404).json({ code: 404, message: 'User not found' });
            }
            else {
                const updatedUser = await user.update({
                    name: body.name,
                    surname: body.surname,
                    email: body.email
                });
                res.status(200).json({ data: updatedUser })
            }
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });

});

// Delete a user by id
router.delete('/:id', permission(3), async (req, res) => {
    const { params: { id } } = req;
    return await sequelize.models.users.findByPk(id)
        .then(async (user) => {
            if (!user) {
                return res.status(404).json({ code: 404, message: 'User not found' });
            }
            else {
                await user.destroy();
                res.status(200).json({ message: `User ${id} has been deleted` });
            }
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });
});

module.exports = router;