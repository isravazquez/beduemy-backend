const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');

// Get all roles
router.get('/', async (req, res) => {
    return await sequelize.models.roles.findAndCountAll()
        .then((roles) => {
            res.status(200).json({ data: roles })
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });
});

// Get one role
router.get('/:id', async (req, res) => {
    const { params: { id } } = req;
    return await sequelize.models.roles.findOne({
        where: { id }
    })
        .then((role) => {
            if (!role) {
                res.status(404).json({ code: 404, message: 'Role not found' })
            }
            else res.status(200).json({ data: role })
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });
});

// Creating a new role
router.post('/', async (req, res) => {
    const { body } = req;
    return await sequelize.models.roles.create({
        role: body.role
    })
        .then(async (role) => {
            await role.save()
            res.status(201).json({ data: role })
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });
});

// Update a role by id
router.put('/:id', async (req, res) => {
    const { body, params: { id } } = req;
    return await sequelize.models.roles.findByPk(id)
        .then(async (role) => {
            if (!role) {
                return res.status(404).json({ code: 404, message: 'Role not found' });
            }
            else {
                const updatedRole = await role.update({
                    role: body.role
                });
                res.status(200).json({ data: updatedRole })
            }
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });
});

// Delete a role by id
router.delete('/:id', async (req, res) => {
    const { params: { id } } = req;
    return await sequelize.models.roles.findByPk(id)
        .then(async (role) => {
            if (!role) {
                return res.status(404).json({ code: 404, message: 'Role not found' });
            }
            else {
                await role.destroy();
                res.status(200).json({ message: `Role ${id} has been deleted` });
            }
        }).catch((err) => {
            res.status(404).json({ message: 'Error', data: err })
        });
});

module.exports = router;