var memcached = require('memcached');

var client = new memcached('localhost:11211',{
  retries: 10,//numero de re tentativas feitas por request
  retry: 10000,
  remove: true
});

client.set('pagamento-20',{'id':20}, 10000, function(){
  console.log('nova chave adicionada ao cache: pagamento-20');
});

client.get('pagamento-20', function(err,result){
  if(err || !result){
    console.log('MISS - chave nao encontrada');
  }else{
    console.log('HIT - valor: '+JSON.stringify(result));
  }
});
