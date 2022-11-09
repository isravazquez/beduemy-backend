const express = require('express')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/v1', require('./routes'))

app.listen(8080)