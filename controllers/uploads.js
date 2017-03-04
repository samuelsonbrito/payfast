var fs = require('fs');

module.exports = (app)=> {
    app.post("/upload/imagem",(req, res)=> {

      var arquivo = req.headers.filename;
      console.log('arquivo recebido: ' + arquivo);

      req.pipe(fs.createWriteStream("files/" + arquivo))

        .on('finish', ()=>{
               console.log('arquivo escrito');
              res.status(201).send('ok');
        });
    });
  }
//curl -X POST http://localhost:3000/upload/imagem --data-binary @imagem.jpg -H "Content-Type: application/octet-stream"  -v -H "filename: imagem.jpg"
