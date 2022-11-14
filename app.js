/* APP: Configuraciones principales */
//Configuración de ambiente (ENV)
require("dotenv").config()

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const app = express()

app.use(helmet())
app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req,res)=>{
    return res.redirect('/api/v1')
})

app.use('/api/v1', require('./routes'))

//Catch 404 
app.use(function (req, res, next) {
    res.status(404).json({error: 'Not Found'})
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server listing on PORT", process.env.PORT);  //Se agrega el puerto
});