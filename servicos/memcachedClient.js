var memcached = require('memcached');

module.exports = ()=>{
  return createMencachedClient;
}

function createMencachedClient(){

  var client = new memcached('localhost:11211',{
    retries: 10,//numero de re tentativas feitas por request
    retry: 10000,
    remove: true
  });

  return client;

}
