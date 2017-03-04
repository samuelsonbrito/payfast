var fs = require('fs');

module.exports = function(app) {
    app.post("/upload/imagem",function(req, res) {

      var arquivo = req.headers.filename;
      console.log('arquivo recebido: ' + arquivo);

      req.pipe(fs.createWriteStream("files/" + arquivo))

        .on('finish', function(){
               console.log('arquivo escrito');
              res.status(201).send('ok');
        });
    });
  }
//curl -X POST http://localhost:3000/upload/imagem --data-binary @imagem.jpg -H "Content-Type: application/octet-stream"  -v -H "filename: imagem.jpg"
