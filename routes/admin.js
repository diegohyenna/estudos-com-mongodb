const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Category')
const Category = mongoose.model('category')
require('../models/Post')
const Post = mongoose.model('post')

router.get('/', (req, res) => {
  res.render('admin/index')
})

router.get('/categories', (req, res) => {
  Category
    .find()
    .sort({name: 'asc'})
    .then( categories => {
      categories.map( (category, index) => {
        console.log(categories.Schema.paths)
        // for (let key in category) {
        //   // console.log(key);
        //   console.log(category[key]);
        // }
      })
      res.render('admin/categories', {categories: categories})
    })
    .catch(error => {
      req.flash('error_msg', "Houve um erro ao listar as categorias")
      res.redirect('/admin')
    })
})

router.get('/categories/add', (req, res) => {
  res.render('admin/add-categories')
})

router.post('/categories/new', (req, res) => {

  let newCategory = {
    name: req.body.name.toLowerCase(),
    slug: req.body.slug.toLowerCase()
  }

  let errors = []

  if(!req.body.name || !req.body.name == undefined || !req.body.name == null){
    errors.push({text: "Nome inválido"})
  }

  if(!req.body.slug || !req.body.slug == undefined || !req.body.slug == null){
    errors.push({text: "Slug inválido"})
  }

  if(req, req.body.name.length < 2){
    errors.push({text: 'Nome da categoria é menor que 2 caracteres!'})
  }

  if(errors.length > 0){
    res.render('admin/add-categories', {errors: errors, category: newCategory})
  }else{

    let saveNewCategory = new Category(newCategory) 

    saveNewCategory
      .save()
      .then( response => {        
        req.flash('success_msg', "Salvou com sucesso")
        res.redirect('/admin/categories')
      })
      .catch( err => {        
        req.flash('errors_msg', "Não foi possível salvar a categoria")
        res.redirect('/admin/categories')
      })
  }
})

router.get('/categories/edit/:id', (req, res) => {

  Category
    .findOne({_id: req.params.id})
    .then(category => {
      res.render('admin/edit-categories', {category: category})
    })
    .catch( error => {
      req.flash('error_msg', "Essa categoria não existe!")
      res.redirect('/admin/categories')
    })
  
})

router.post('/categories/edit', (req, res) => {

  let updateCategory = {
    name: req.body.name.toLowerCase(),
    slug: req.body.slug.toLowerCase(),
    updatedAt: Date.now()
  }

  Category.findByIdAndUpdate(req.body.id, updateCategory, {new: true})
    .then(category => {     
      req.flash('success_msg', "Categoria editada com sucesso!")
      res.redirect('/admin/categories')
    })
    .catch( error => {
      req.flash('error_msg', "Houve um erro ao editar a categoria")
      res.redirect("/admin/categories")
    })
  
})

router.get('/categories/atrribute/remove/:name', (req, res) => {
  console.log(req.params)
  // Category.findOneAndUpdate(query, { $set: { name: 'jason bourne' }})
})

router.post('/categories/delete', (req, res) => {
  Category
    .findByIdAndDelete(req.body.id)
    .then( category => {
      req.flash("success_msg", "Categoria deletada com sucesso!")
      res.redirect('/admin/categories')
    })
    .catch(error => {
      req.flash('error_msg', "Houve um erro ao deletar a categoria")
      res.redirect("/admin/categories")
    })
  
})

router.get('/posts', (req, res) => {
  
  Post
    .find()
    .populate('category')
    .sort({name: 'asc'})
    .then( posts => {
      res.render('admin/posts', {posts: posts})
    })
    .catch(error => {
      req.flash('error_msg', "Houve um erro ao listar as postagens")
      res.redirect('/admin')
    })
  
})

router.get('/posts/add', (req, res) => {

  Category
    .find()
    .sort({name: 'asc'})
    .then( categories => {
      res.render('admin/add-posts', {categories: categories})
    })
    .catch( error => {
      res.flash("Houve algum erro ao tentar carregar as categorias das postagens!")
      res.redirect('admin/posts')
    })
  
})

router.post("/posts/new", (req, res) => {
  let errors = []

  if(req.body.category == 0){
    errors.push({text: "Categoria inválida, selecione uma categoria!"})
  }

  if(errors.length > 0){
    res.render('admin/add-posts', {errors: errors})
  }else{
    let newPost = {
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      content: req.body.content,
      category: req.body.category
    }

    let saveNewPost = new Post(newPost) 

    saveNewPost
      .save()
      .then( response => {        
        req.flash('success_msg', "Salvou com sucesso")
        res.redirect('/admin/posts')
      })
      .catch( err => {        
        req.flash('errors_msg', "Não foi possível salvar a postagem!")
        res.redirect('/admin/posts')
      })
  }

})

router.get('/posts/edit/:id', (req, res) => {

  Post
    .findOne({_id: req.params.id})
    .then(post => {
      Category
        .find()
        .then(categories => {
          res.render('admin/edit-posts', {post: post, categories: categories})
        })
        .catch( error => {
          req.flash('error_msg', "Essa postagem não existe!")
          res.redirect('/admin/posts')
        })
    })
    .catch( error => {
      req.flash('error_msg', "Essa categoria não existe!")
      res.redirect('/admin/categories')
    })
})

router.post('/posts/edit', (req, res) => {

  let updateCategory = {
    title: req.body.title.toLowerCase(),
    slug: req.body.slug.toLowerCase(),
    description: req.body.description.toLowerCase(),
    content: req.body.content.toLowerCase(),
    category: req.body.category,
    updatedAt: Date.now()
  }

  Post.findByIdAndUpdate(req.body.id, updateCategory, {new: true})
    .then(post => {
      req.flash('success_msg', "Postagem editada com sucesso!")
      res.redirect('/admin/posts')
    })
    .catch( error => {
      req.flash('error_msg', "Houve um erro ao editar a postagem")
      res.redirect("/admin/posts")
    })
})

router.post('/posts/delete', (req, res) => {
  Post
    .findByIdAndDelete(req.body.id)
    .then( category => {
      req.flash("success_msg", "Postagem deletada com sucesso!")
      res.redirect('/admin/posts')
    })
    .catch(error => {
      req.flash('error_msg', "Houve um erro ao deletar a postagem")
      res.redirect("/admin/posts")
    })
  
})

module.exports = router