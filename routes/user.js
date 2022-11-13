const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');

// Get all users
router.get('/', async (req, res) => {
    const users = await sequelize.models.users.findAndCountAll();
    return res.status(200).json({ data: users });
});

// Get one user
router.get('/:id', async (req, res) => {
    const { params: { id } } = req;
    const user = await sequelize.models.user.findOne({
        where: { id },
        include: [      //Specifying the role
            { model: sequelize.models.roles, attributes: ['id', 'role'] }
        ]
    });
    return res.status(200).json({ data: user });
});

// Creating a new user
router.post('/', async (req, res) => {
    const { body } = req;
    const user = await sequelize.models.users.create({
        name: body.name,
        surname: body.surname,
        email: body.email,
        roleId: 3, //Any id is allowed except admin? verification?
        password: body.password
    });
    await user.save();
    return res.status(201).json({ data: user });
});

// Update a user by id
router.put('/:id', async (req, res) => {
    const { body, params: { id } } = req;
    const user = await sequelize.models.users.findByPk(id);
    if (!user) {
        return res.status(404).json({ code: 404, message: 'User not found' });
    }
    const updatedUser = await user.update({
        name: body.name,
        surname: body.surname,
        email: body.email,
        // password: body.password  check it
    });
    return res.json({ data: updatedUser });
});

// Delete a user by id
router.delete('/:id', async (req, res) => {
    const { params: { id } } = req;
    const user = await sequelize.models.users.findByPk(id);
    if (!user) {
        return res.status(404).json({ code: 404, message: 'User not found' });
    }
    await user.destroy();
    return res.json();
});

module.exports = router;