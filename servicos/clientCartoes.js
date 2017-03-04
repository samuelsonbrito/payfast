var restify = require('restify');

function CartoesClient(){
  this._cliente = restify.createJsonClient({
    url:'http://localhost:3001'
  });
}

CartoesClient.prototype.autoriza = (cartao, callback)=>{
  this._cliente.post('/cartoes/autoriza', cartao, callback);
}

module.exports = ()=>{
  return CartoesClient;
}
