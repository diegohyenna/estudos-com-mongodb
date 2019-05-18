const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('../models/User')
const User = mongoose.model('user')


module.exports = function(passport){

  passport.use(new localStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
    User
      .findOne({email: email})
      .then( user => {
        if(!user){
          return done(null, false, {message: "Email ou senha estão errados!"})
        }else{
          bcrypt.compare(password, user.password, (error, success) => {
            if(success){
              return done(null, user)
            }else{
              return done(null, false, {message: "Email ou senha estão errados!"})
            }
          })
        }
      })
      .catch( error => {
        console.log(error)
      })
  }))

  //salva na sessao ao logar
  passport.serializeUser( (user, done) => {
    done(null, user.id)
  })

  //acho que eh pra deletar a sessao
  passport.deserializeUser( (id, done) => {
    User.findById(id, (error, user) => {
      done(error, user)
    })
  })



}