var express = require('express');
var consign = require('consign');//autoload carregado
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var logger = require('../servicos/logger.js');

module.exports = function() {

  var app = express();

  app.use(morgan("common", {
    stream: {
      write: function(mensage){
        logger.info(mensage);
      }
    }
  }));

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  //ativar o express validator
  app.use(expressValidator());

  consign() //fazer o uso do autoload
  .include('controllers')
  .then('persistencia')
  .then('servicos')
  .into(app);

  return app;
}
