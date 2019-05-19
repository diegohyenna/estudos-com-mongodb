const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

require('../models/User')
const User = mongoose.model('user')

const { eAdmin } = require('../helpers/eAdmin')
const { eLogged } = require('../helpers/eLogged')

router.get('/', eAdmin, (req, res) => {
  User
    .find()
    .sort({name: 'asc'})
    .then( users => {
      res.render('admin/user/index', {users: users})
    })
    .catch( error => {
      req.flash('error_msg', "Não foi possível carregar a lista de usuários")
      req.redirect('/')
    })
})

router.post('/my-account', eLogged, (req, res) => {
  User
    .findById(req.body.id)
    .then( user => {
      res.render('admin/user/my-account', {user: user})
    })
    .catch( error => {
      req.flash('error_msg', "Não foi possível carregar os seus dados de usuário")
      req.redirect('/')
    })
})

router.get('/new', eAdmin, (req, res) => {
  res.render('admin/user/new')
})

router.post('/new', eAdmin, (req, res) => {
  
  let newUser = {
    name: req.body.name,
    email: req.body.email,
    type: req.body.type,
    password: 123456 //depois criar uma logica para gerar senhas randomicas
  }

  let saveNewUser = new User(newUser)

  bcryptjs.genSalt(10, (error, salt) => {
    bcryptjs.hash(saveNewUser.password, salt, (error, hash) => {
      if(error){
        req.flash('error_msg', "Houve algum erro no salvamento do usuário")
        res.redirect('/')
      }else{

        saveNewUser.password = hash

        saveNewUser
          .save()
          .then( newUser => {
            req.flash('success_msg', "Usuário salvo com sucesso!")
            res.redirect('/')
          })
          .catch( error => {
            req.flash('error_msg', "Houve algum erro no salvamento do usuário")
            res.redirect('/')
          })
      }
    })
  })

  
})

router.post('/edit', eLogged, (req, res) => {
  User
    .findById(req.body.id)
    .then( user => {
      res.render('admin/user/edit', {user: user})
    })
    .catch( error => {
      req.flash('error_msg', "Não foi possível carregar os seus dados de usuário")
      req.redirect('/')
    })
})

router.post('/save', eLogged, (req, res) => {

  let updateUser = {
    name: req.body.name,
    email: req.body.email,
    type: req.body.type
  }

  User
    .findByIdAndUpdate(req.body.id, updateUser, {new: true})
    .then( user => {
      req.flash('success_msg', "Editou os dados com sucesso!")
      res.redirect('/')
    })
    .catch( error => {
      req.flash('error_msg', "Não foi possível editar os seus dados de usuário!")
      req.redirect('/')
    })
})

router.get('/register', (req, res) => {
  res.render('site/user/register')
})

router.post('/register', (req, res) => {

  let errors = []

  let newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordRepeat: req.body.passwordRepeat
  }

  if(!newUser.name || newUser.name == undefined || newUser.name == null){
    errors.push({text: "O nome é obrigatório"})
  }

  if(!newUser.email || newUser.email == undefined || newUser.email == null){
    errors.push({text: "O email é obrigatório"})
  }

  if(!newUser.password || newUser.password == undefined || newUser.password == null){
    errors.push({text: "A senha é obrigatório"})
  }

  if(newUser.password.length < 4 ){
    errors.push({text: "A senha é muito curta"})
  }

  if(newUser.password != newUser.passwordRepeat ){
    errors.push({text: "As senhas são diferentes!"})
  }

  if(errors.length > 0){
    res.render('user/register', {errors: errors, newUser: newUser})
  }else{

    User
      .findOne({email: newUser.email})
      .then( user => {

        if(user){
          req.flash('error_msg', 'Já existe um usuário cadastrado com esse email!')
          res.render('site/user/register', {errors: errors, newUser: newUser})
        }else{

          let saveNewUser = new User(newUser)

          bcryptjs.genSalt(10, (error, salt) => {
            bcryptjs.hash(saveNewUser.password, salt, (error, hash) => {

              if(error){
                req.flash('error_msg', "Houve algum erro no salvamento do usuário")
                res.redirect('/')
              }else{

                saveNewUser.password = hash

                saveNewUser
                  .save()
                  .then( newUser => {
                    req.flash('success_msg', "Usuário salvo com sucesso!")
                    res.redirect('/')
                  })
                  .catch( error => {
                    req.flash('error_msg', "Houve algum erro no salvamento do usuário")
                    res.redirect('/')
                  })
              }
            })
          })
        }
      })
      .catch( error => {
        req.flash('error_msg', 'Houve um erro interno')
        res.redirect('/')
      })
  }
})

module.exports = router