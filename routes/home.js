const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/Post')
const Post = mongoose.model('post')

router.get('/', (req, res) => {
  Post  
    .find()
    .sort({createdAt: 'desc'})
    .limit(2)
    .then( posts => {      
      res.render('site/home/index', {posts: posts})
    })
    .catch( error => {
      req.flash('error_msg', "Não foi possível carregar as postagens")
      res.render('site/home/index')
    })
  
  
})

module.exports = router