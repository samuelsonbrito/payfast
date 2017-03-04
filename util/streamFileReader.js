var fs = require('fs');
//não armazena em um buffer, ele pega cada pedaço da imagem e cria a nova imagem em stream
fs.createReadStream('imagem.jpg')
  .pipe(fs.createWriteStream('imagem-com-stream.jpg'))
  .on('finish', ()=> {
    console.log('arquivo escrito com stream');
  });

// curl -X POST http://localhost:3000/upload/imagem --data-binary @imagem.jpg -H "Content-type: application/octet-stream" -H "filename: image.jpg"
