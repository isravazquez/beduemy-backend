const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');

// Get all roles
router.get('/', async (req, res) => {
    const roles = await sequelize.models.roles.findAndCountAll();
    return res.status(200).json({ data: roles });
});

// Get one role
router.get('/:id', async (req, res) => {
    const { params: { id } } = req;
    const role = await sequelize.models.roles.findOne({
        where: { id }
    });
    return res.status(200).json({ data: role });
});

// Creating a new role
router.post('/', async (req, res) => {
    const { body } = req;
    const role = await sequelize.models.roles.create({
        role: body.role
    });
    await role.save();
    return res.status(201).json({ data: role });
});

// Update a role by id
router.put('/:id', async (req, res) => {
    const { body, params: { id } } = req;
    const role = await sequelize.models.roles.findByPk(id);
    if (!role) {
        return res.status(404).json({ code: 404, message: 'Role not found' });
    }
    const updatedRole = await role.update({
        role: body.role
    });
    return res.json({ data: updatedRole });
});

// Delete a role by id
router.delete('/:id', async (req, res) => {
    const { params: { id } } = req;
    const role = await sequelize.models.roles.findByPk(id);
    if (!role) {
        return res.status(404).json({ code: 404, message: 'Role not found' });
    }
    await role.destroy();
    return res.json();
});

module.exports = router;