const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/Post')
const Post = mongoose.model('post')

router.get('/:slug', (req, res) => {
  Post  
    .findOne({slug: req.params.slug})
    .populate('category')
    .then( post => {      
      res.render('post/index', {post: post})
    })
    .catch( error => {
      req.flash('error_msg', "Não foi possível achar a postagem")
      res.redirect('/home')
    })
  
  
})

module.exports = router