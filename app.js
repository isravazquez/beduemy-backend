/* APP: Configuraciones principales */
//Configuración de ambiente (ENV)
require("dotenv").config()

const express = require('express')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//=================================
const sequelize = require('./config/db')
//Conexión a la base de datos con try/catch
try {
    sequelize.authenticate();
    sequelize.sync();
    console.log('La conexion fue exitosa');
} catch (error) {
    console.error('Hubo un problema con la conexión', error);
}
//===========================

app.use('/api/v1', require('./routes'))

app.listen(8080)