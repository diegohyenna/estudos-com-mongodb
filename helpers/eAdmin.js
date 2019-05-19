module.exports = {
  
  /**
   * Função que autentica um usuário com passport.local
   * Por algum motivo a mensagem de erro não tá funcionando!
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  eAdmin: function(req, res, next){
     
    //essa função é gerada pelo passport
    if(req.isAuthenticated() && req.user.type == 1){
      return next()
    }else{
      req.flash('error_msg', "Você precisa ser administrador para acessar essa área!")
      res.redirect('/')
    }
  },

  /**
   * @desc Cria um atributo para o <option> que foi selecionado em um <select></select>
   * porque eu não sei fazer um if == usando o handlebars
   * 
   * @param modelData Dados de uma model
   * @param attributeFromSelect Valor selecionado que deve ser comparado ao atributo de "modelData"
   * @param attributeToCompare Nome do atributo da model para comparar com o valor selecionado de  "attributeFromSelect"
   * 
   * @return modelData
   */
  hCreateSelectedAttribute: function(modelData, attributeFromSelect, attributeToCompare){
    return modelData.map( data => {
      if(attributeFromSelect == data[attributeToCompare]){
        data['selected'] = true
      }else{
        data['selected'] = false
      }
      return data
    })
  },

  /**
   * Se propoe a fazer o que é descrito no nome
   * @param oldObject Objeto que vai ser copiado
   * @return Object - Objeto copiado 
   */
  hCopyObject: function(oldObject){
    let newObject = JSON.stringify(oldObject);
    return JSON.parse(newObject);
  }
}