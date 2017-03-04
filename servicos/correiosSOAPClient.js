var soap = require('soap');

function CorreiosSOAPClient() {
  this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

module.exports = ()=>{
  return CorreiosSOAPClient;
}

CorreiosSOAPClient.prototype.calculaPrazo = (args, callback)=> {
  soap.createClient(this._url, (err,cliente)=> {
    cliente.CalcPrazo(args, callback);
  });
}
