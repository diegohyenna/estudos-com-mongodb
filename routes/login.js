const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const passport = require('passport')

require('../models/User')
const User = mongoose.model('user')

router.get('/', (req, res) => {
  res.render("login/index")
})

router.post('/', (req, res, next) => {

  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
  
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', "Deslogado com sucesso!")
  res.redirect('/')
})

module.exports = router