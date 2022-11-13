const express = require('express')
const router = express.Router()
const sequelize = require('../config/db')
const jwt = require('jsonwebtoken')

// --------------------------    PARA INICIAR SESION  ----------------------------------
router.post('/login', async (req, res) => {
  const { body } = req
  const user = await sequelize.models.users.findOne({ 
                where: { email: body.email }
              })

  if (!user) return res.status(401).json({ message: 'Unauthorized' })
  if (!user.validPassword(body.password)) return res.status(401).json({ message: 'Invalid credentials!' })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRETKEY, {
    expiresIn: 3600
  })

  return res.json({ message: 'Athenticated successfully!', token })
})

// --------------------------    PARA REGISTRARSE  -------------------------------------
router.post('/signup', async (req, res) => {
  const { body } = req;
  let user = await sequelize.models.users.findOne({
    where: { email: body.email },
  });

  // Validation for known is the user's email exists
  if (user) {
    return res.status(400).json({ message: "this email is already registered" });
  }

  // Creating the user
  user = await sequelize.models.users.create({
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: body.password,
    roleId: 1,
  })

   // Saving user
  await user.save();
  return res.json({ message: 'Your account was created successfully'});
})

module.exports = router