const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Category')
const Category = mongoose.model('category')
require('../models/Post')
const Post = mongoose.model('post')
const eAdmin = require('../helpers/eAdmin')

router.get('/', (req, res) => {
  res.render('admin/home/index')
})

router.get('/categories', (req, res) => {
  try{
    Category
      .find()
      .sort({name: 'asc'})
      .then( async categories => {
   
        let attributes = []; 

        await categories.map( category => {
          category.schema.eachPath( path => {
            if(path.indexOf('_') != 0){
              attributes.push(path);
            }
          });
        })

        await res.render('admin/category/index', {categories: categories, attributes: attributes})
      })
      .catch(error => {        
        req.flash('error_msg', "Houve um erro ao listar as categorias")
        res.redirect('/admin')
      })
  }catch(e){
    req.flash('error_msg', "Houve um erro ao listar as categorias")
    res.redirect('/admin')
  }
})

router.get('/categories/add', (req, res) => {
  res.render('admin/category/new')
})

router.post('/categories/new', (req, res) => {

  let newCategoryData = {
    name: req.body.name.toLowerCase(),
    slug: req.body.slug.toLowerCase()
  }

  let errors = []

  if(!newCategoryData.name || newCategoryData.name == undefined || newCategoryData.name == null){
    errors.push({text: "Nome inválido"})
  }

  if(!newCategoryData.slug || newCategoryData.slug == undefined || newCategoryData.slug == null){
    errors.push({text: "Slug inválido"})
  }

  if(newCategoryData.name.length < 2){
    errors.push({text: 'Nome da categoria deve ser maior que 1(uma) letra!'})
  }

  if(errors.length > 0){
    res.render('admin/category/new', {errors: errors, category: newCategory})
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
      res.render('admin/category/edit', {category: category})
    })
    .catch( error => {
      req.flash('error_msg', "Essa categoria não existe!")
      res.redirect('/admin/categories')
    })
  
})

router.post('/categories/edit', (req, res) => {

  let updateCategoryId = req.body.id

  let updateCategoryData = {
    name: req.body.name.toLowerCase(),
    slug: req.body.slug.toLowerCase(),
    updatedAt: Date.now()
  }

  let errors = []

  if(!updateCategoryData.name || updateCategoryData.name == undefined || updateCategoryData.name == null){
    errors.push({text: "Nome inválido"})
  }

  if(!updateCategoryData.slug || updateCategoryData.slug == undefined || updateCategoryData.slug == null){
    errors.push({text: "Slug inválido"})
  }

  if(updateCategoryData.name.length < 2){
    errors.push({text: 'Nome da categoria deve ser maior que 1(uma) letra!'})
  }

  if(errors.length > 0){
    res.render('admin/category/edit', {errors: errors, category: newCategory})
  }else{

    Category.findByIdAndUpdate(updateCategoryId, updateCategoryData, {new: true})
      .then(category => {     
        req.flash('success_msg', "Categoria editada com sucesso!")
        res.redirect('/admin/categories')
      })
      .catch( error => {
        req.flash('error_msg', "Houve um erro ao editar a categoria")
        res.redirect("/admin/categories")
      })
  
  }
  
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
      res.render('admin/post/index', {posts: posts})
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
      res.render('admin/post/new', {categories: categories})
    })
    .catch( error => {
      res.flash("Houve algum erro ao tentar carregar as categorias das postagens!")
      res.redirect('admin/posts')
    })
  
})

router.post("/posts/new", (req, res) => {
  let errors = []

  let newPostData = {
    title: req.body.title,
    slug: req.body.slug.toString(),
    description: req.body.description,
    content: req.body.content,
    category: req.body.category
  }

  if(!newPostData.title || newPostData.title == undefined || newPostData.title == null){
    errors.push({text: "O Título é obrigatório"})
  }
  if(!newPostData.slug || newPostData.slug == undefined || newPostData.slug == null){
    errors.push({text: "O Slug é obrigatório"})
  }
  if(!newPostData.content || newPostData.content == undefined || newPostData.content == null){
    errors.push({text: "O Conteúdo é obrigatório"})
  }

  if(newPostData.category == 0){
    errors.push({text: "Categoria inválida, selecione uma categoria!"})
  }

  if(errors.length > 0){
    res.render('admin/post/new', {errors: errors, post: newPostData})
  }else{

    let saveNewPost = new Post(newPostData) 

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
        .then( categories => {

          let viewCategories = eAdmin.hCopyObject(categories);

          viewCategories = eAdmin.hCreateSelectedAttribute(viewCategories, post.category, '_id')

          res.render('admin/post/edit', {post: post, categories: viewCategories})
        })
        .catch( error => {
          req.flash('error_msg', "Deu erro ao tentar carregar as categorias!")
          res.redirect('/admin/posts')
        })
    })
    .catch( error => {
      req.flash('error_msg', "Essa postagem não existe!")
      res.redirect('/admin/posts')
    })
})

router.post('/posts/edit', (req, res) => {

  let errors = []

  let updateCategoryData = {
    id: req.body.id,
    title: req.body.title,
    slug: req.body.slug.toLowerCase(),
    description: req.body.description,
    content: req.body.content,
    category: req.body.category,
    updatedAt: Date.now()
  }
  
  if(!updateCategoryData.title || updateCategoryData.title == undefined || updateCategoryData.title == null){
    errors.push({text: "O Título é obrigatório"})
  }
  if(!updateCategoryData.slug || updateCategoryData.slug == undefined || updateCategoryData.slug == null){
    errors.push({text: "O Slug é obrigatório"})
  }
  if(!updateCategoryData.content || updateCategoryData.content == undefined || updateCategoryData.content == null){
    errors.push({text: "O Conteúdo é obrigatório"})
  }

  if(updateCategoryData.category == 0){
    errors.push({text: "Categoria inválida, selecione uma categoria!"})
  }

  if(errors.length > 0){

    Category
      .find()
      .then(categories => {

        let viewCategories = eAdmin.hCopyObject(categories);

        viewCategories = eAdmin.hCreateSelectedAttribute(viewCategories, updateCategoryData.category, '_id')

        res.render('admin/post/edit', {
          errors: errors, 
          post: updateCategoryData, 
          categories: viewCategories
        })
      })
      .catch( error => {
        req.flash('error_msg', "Deu erro ao tentar carregar as categorias!")
        res.redirect('/admin/posts')
      })

  }else{

    Post.findByIdAndUpdate(updateCategoryData.id, updateCategoryData, {new: true})
      .then(post => {
        req.flash('success_msg', "Postagem editada com sucesso!")
        res.redirect('/admin/posts')
      })
      .catch( error => {
        req.flash('error_msg', "Houve um erro ao editar a postagem")
        res.redirect("/admin/posts")
      })
  
  }

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