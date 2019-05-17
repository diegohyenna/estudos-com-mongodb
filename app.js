//Carregando modulos
const express = require('express');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

//configurações

app.use(session(
  {
    secret: 'diegohyenna',
    resave: true,
    saveUninitialized: true
  }
))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  next()
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');

mongoose.Promise = global.Promise;
mongoose.connect(
  'mongodb://localhost/nodejs-with-mongo-estudos',
  { 
    useFindAndModify: false,
    useNewUrlParser: true 
  } 
)
.then( res => {
  console.log('Conectado ao mongo')
})
.catch( err => {
  console.log('Deu erro ao conectar no mongo')
  console.log(err)
})

app.use(express.static(path.join(__dirname, 'public')))

//rotas
app.get('/', (req, res) => {
  res.send("Olá, mundo! Bem-vindo a API de teste para estudos em nodejs com express e mongoose")
})

app.use('/admin', admin)

//outros
const PORT = 8081
app.listen( PORT, () => {
  console.log('Servidor rodando!!!');
})