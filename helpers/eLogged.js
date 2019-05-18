module.exports = {
  eLogged: function(req, res, next){
     
    //essa função é gerada pelo passport
    if(req.isAuthenticated()){
      return next()
    }else{
      req.flash('error_msg', "Você precisa está logado para acessar essa área!")
      res.redirect('/')
    }
  }
}