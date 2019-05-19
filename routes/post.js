const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/Post')
const Post = mongoose.model('post')

router.get('/', (req, res) => {
  Post  
    .find()
    .populate('category')
    .sort({updatedAt: 'desc'})
    .then( posts => {      
      res.render('site/post/index', {posts: posts})
    })
    .catch( error => {
      req.flash('error_msg', "Não foi possível achar as postagens")
      res.redirect('/home')
    })
})

router.get('/:slug', (req, res) => {
  Post  
    .findOne({slug: req.params.slug})
    .populate('category')
    .then( post => {      
      res.render('site/post/one', {post: post})
    })
    .catch( error => {
      req.flash('error_msg', "Não foi possível achar a postagem")
      res.redirect('/home')
    })
})

module.exports = router