//Carregando modulos
const express = require('express');
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()

const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
require("./config/auth")(passport)

const admin = require('./routes/admin')
const home = require('./routes/home')
const post = require('./routes/post')
const user = require('./routes/user')
const login = require('./routes/login')

const { eAdmin } = require('./helpers/eAdmin')

//configurações

//session + middleware
app.use(session(
  {
    secret: 'diegohyenna',
    resave: true,
    saveUninitialized: true
  }
))

//passport tem que ser obrigatorio estar entre os itens acima-abaixo
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg")
  res.locals.error_msg = req.flash("error_msg")
  res.locals.auth_error = req.flash('error')
  res.locals.userLogged = req.user || null

  next()
})

//pega dados enviados por get ou post
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//handlebars, micro template de frontend
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars');

//banco de dados mongodb
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

//setar libs de terceiros e docs pela pasta public
app.use(express.static(path.join(__dirname, 'public')))

//rotas
app.use('/', home)
app.use('/post', post)
app.use('/user', user)
app.use('/login', login)
app.use('/admin', eAdmin, admin)

//outros
const PORT = 8081
app.listen( PORT, () => {
  console.log('Servidor rodando!!!');
})