module.exports = {
  eAdmin: function(req, res, next){
     
    //essa função é gerada pelo passport
    if(req.isAuthenticated() && req.user.type == 1){
      return next()
    }else{
      req.flash('error_msg', "Você precisa ser administrador para acessar essa área!")
      res.redirect('/')
    }
  }
}