var logger = require('../servicos/logger.js');

module.exports = (app)=>{
  app.get('/pagamentos', (req, res)=> {
    console.log('recebido o require');
    res.send('OK');
  });

  app.delete('/pagamentos/pagamento/:id',(req, res)=>{

    var pagamento = {};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = "CANCELADO";

    var connection = app.persistencia.connectionFactory();
    var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

    pagamentoDAO.atualiza(pagamento, (err)=>{

      if(err){
        res.status(500).send(err);
        return;
      }

      console.log("Pagamento cancelado");

      res.status(204).send(pagamento);

    });

  });

  app.put('/pagamentos/pagamento/:id', (req, res)=>{

    var pagamento = {};
    var id = req.params.id;

    pagamento.id = id;
    pagamento.status = "CONFIRMADO";

    var connection = app.persistencia.connectionFactory();
    var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

    pagamentoDAO.atualiza(pagamento, (err)=>{

      if(err){
        res.status(500).send(err);
        return;
      }

      console.log("Pagamento alterado");

      res.send(pagamento);

    });

  });

  app.get('/pagamentos/pagamento/:id',(req, res)=>{
    var id = req.params.id;
    console.log('consultando pagamento: '+id);

    logger.info('consultando pagamento: '+id);

    var memcachedClient = app.servicos.memcachedClient();

    memcachedClient.get('pagamento-'+id, (error,results)=>{
      if(error || !results){

        console.log('MISS - chave nao encontrada');

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.buscaPorId(id, (err,result)=>{
          if(err){
            console.log('erro ao consultar no banco');
            res.status(500).send(err);
            return;
          }
          console.log('pagamento encontrado:'+JSON.stringify(result));
          res.json(result);
          return;
        });

      }else{
        console.log('HIT - valor: '+JSON.stringify(results));
        res.json(results);
      }
    });




  });

  app.post('/pagamentos/pagamento', (req, res)=>{

    req.assert("pagamento.forma_de_pagamento","Forma de pagamento eh obrigatorio").notEmpty();
    req.assert("pagamento.valor","Valor eh obrigatorio e deve ser um decimal").notEmpty().isFloat();
    var erros = req.validationErrors();

    if(erros){
      console.log("Erros de validacao encontrados");
      res.status(400).send(erros);
      return;
    }

    var pagamento = req.body["pagamento"];
    console.log('processando uma requisição de um novo pagamento'+pagamento.valor);

    pagamento.status = 'CRIADO';
    pagamento.data = new Date;

    var connection = app.persistencia.connectionFactory();
    var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

    pagamentoDAO.salva(pagamento, (err, result)=>{

      if(err){
        res.status(500).send(err);
      }else{
        pagamento.id = result.insertId;

        var memcachedClient = app.servicos.memcachedClient();

        memcachedClient.set('pagamento-'+pagamento.id,pagamento, 60000, ()=>{
          console.log('nova chave adicionada ao cache: pagamento-'+pagamento.id);
        });


        if(pagamento.forma_de_pagamento == 'cartao'){
          var cartao = req.body["cartao"];

          var clienteCartoes = new app.servicos.clientCartoes();

          clienteCartoes.autoriza(cartao, (error,request,response,results)=>{

            if(error){
              console.log(error);
              res.status(400).send(error);
              return;
            }

            console.log('consumindo servico de cartoes - AUTORIZAAAA');
            console.log(results);

            res.location('/pagamentos/pagamento/'+pagamento.id);

            var response = {
              dados_do_pagamento: pagamento,
              cartao: results,
              links: [
                {
                  href: "http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                  rel: "confirmar",
                  method: "PUT"
                },
                {
                  href: "http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                  rel: "cancelar",
                  method: "DELETE"
                }
              ]
            }

            res.status(201).json(response);
            return;

          });

        }else{

          res.location('/pagamentos/pagamento/'+pagamento.id);

          var response = {
            dados_do_pagamento: pagamento,
            links: [
              {
                href: "http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                rel: "confirmar",
                method: "PUT"
              },
              {
                href: "http://localhost:3000/pagamentos/pagamento/"+pagamento.id,
                rel: "cancelar",
                method: "DELETE"
              }
            ]
          }

          res.status(201).json(response);
          console.log('pagamento criado');

        }

      }

    });
  });


}
