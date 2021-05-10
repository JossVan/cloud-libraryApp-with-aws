const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const uuid = require("uuid");
const aws_keys = require('./creds');
var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
var https=require('https');
const fs= require('fs');
const options={};
var port=8000;
app.listen(port, () => console.log('Servidor corriendo en el puerto 8000'));
var AWS = require('aws-sdk');
const imageToBase64 =require('image-to-base64')
const ddb = new AWS.DynamoDB(aws_keys.dynamodb);
const s3= new AWS.S3(aws_keys.s3);
const rekognition=new AWS.Rekognition(aws_keys.rekognition);
const translate = new AWS.Translate(aws_keys.translate);
const Polly=new AWS.Polly(aws_keys.polly);
var file =fs.createWriteStream("pdf/file.pdf");
 
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS,PUT, DELETE');
  next();
});


app.post('/registrarUsuario', async function (req, res) {
  Aregistrar = {
      "correo":req.body.Email,
      "Usuario": req.body.Usuario,
      "Nombre": req.body.Nombre,
      "Apellido":req.body.Apellido,
      "Password":req.body.Password,
  }
const consulta = {
TableName: 'Usuario',
FilterExpression: "#user = :datos",
ExpressionAttributeNames: {
    "#user": "Usuario",
},

ExpressionAttributeValues: {
    ":datos": { S: req.body.Usuario},
}
};

ddb.scan(consulta, async function(err, data) {
if (err) {
  console.log("Error", err);
  res.send({msj:err,status:404});
} else  {

  if(data.Items.length!=0){
    res.send({msj:data,status:200});
  }else {
    const UsuarioRegistrar = {
      TableName:'Usuario',
      Item: {
      'correo':{S:Aregistrar.correo},
      'Usuario': {S: Aregistrar.Usuario},
      'Nombre': {S: Aregistrar.Nombre},
      'Apellido':{S:Aregistrar.Apellido},
      'Password': {S: Aregistrar.Password},
      }
      };
      ddb.putItem(UsuarioRegistrar, function(err,data){
        if(err){
          res.send({msj:err,status:404});
        }
        else {
          res.send({msj:data,status:100});
        }
      }); 

    }
  }
});
});

  async function SubirAudio(base64){
    return new Promise((resolve, reject) => {
      buffer = new Buffer.from(base64,'base64')
      direccion= "audios/audio.mp3"
      const params = {
        Bucket: "librossemi1",
        Key: direccion,
        Body: buffer,
        ACL:'public-read',
        ContentEncoding: 'base64',
        ContentType: `audio/mp3`
      };
      s3.upload(params, function(err, data) {
          if (err) {
            console.log(err)
            reject(err)
            return false
          }
        resolve(`Audio subido. ${data.Location}`)
        return true
      });
    })
  }

app.post('/ingresar',async function(req,res){
    Ingreso = {
        "Usuario": req.body.Usuario,
        "Password":req.body.Password
    }
   
    const consulta = {
    TableName: 'Usuario',
    FilterExpression: "#user = :datos",
    ExpressionAttributeNames: {
      "#user": "Usuario",
    },

    ExpressionAttributeValues: {
      ":datos": { S: req.body.Usuario},
    }
    };
    ddb.scan(consulta, async function(err, data) {
    if (err) {
    res.send({msj:err,status:404});
    } else  {
      if(data.Items.length==0){
        res.send({msj:"inexistente",status:200});
      }else {
        if (data.Items[0].Password.S==Ingreso.Password){
          res.send({msj:data,status:100});
        }else{
          res.send({msj:"la contraseña es incorrecta",status:300})
        }
    
      }
    }
  });
});

app.post('/editarDatos', async function(req,res){

  var edicion={
    "UsuarioActual":req.body.UsuarioActual,
    "UsuarioNuevo":req.body.UsuarioNuevo,
    "Nombre":req.body.Nombre,
    "Apellido":req.body.Apellido,
    "correo":req.body.Correo,
    "Password":req.body.Password,
  };

  const buscar = {
    TableName: 'Usuario',
    FilterExpression: "#usu = :datos",
    ExpressionAttributeNames: {
        "#usu": "Usuario",
    },
  
    ExpressionAttributeValues: {
        ":datos": { S: edicion.UsuarioActual},
    }
  };

  ddb.scan(buscar,async function(err,data){
    if(!err){
      if (data.Items.length==1){
        let id=data.Items[0].correo.S;
        if(edicion.Password==data.Items[0].Password.S){
          const actualizados = {
            TableName: "Usuario",
            Key: {
                "correo": { S: id}
            },
            ExpressionAttributeValues: {
                ':Usuario': { S: edicion.UsuarioNuevo },
                ':Nombre': { S: edicion.Nombre },
                ':Apellido': { S: edicion.Apellido},
              
            },
            UpdateExpression: "set Usuario = :Usuario, Nombre=:Nombre, Apellido=:Apellido"
          };
          ddb.updateItem(actualizados, function (err, data) {
            if (err) {
              res.send({msj:err,status:404});
                console.error("Ha habido un error al querer modificar "+ err);
            } else{
            res.send({msj:data,status:100});
            }
          });
        }
      }
    }
});
});

 app.post('/buscarUsuario',async function(req,res){

  var info={
    "Usuario":req.body.Usuario
  }

  const consulta={
    TableName:'Usuario',
    FilterExpression:"#Usuario = :datos",
    ExpressionAttributeNames:{
      "#Usuario":"Usuario",
    },
    ExpressionAttributeValues:{
      ":datos":{S:info.Usuario}
    }
  }
  ddb.scan(consulta, async function(err, data) {
    if (err) {
      console.log("Error", err);
      res.send(false);
    } else  {
      if(data.Items.length!=0){
          res.send(data); 
      }
    }
});
});

app.post('/eliminarBiblioteca',async function(req,res){

  var info={
    "codigo":req.body.codigo
  }
  console.log(info.codigo)
  const consulta={
    TableName: "Biblioteca",
    Key: {
        "codigo": { S: info.codigo}
    },
  }
  ddb.deleteItem(consulta, async function(err, data) {
    if (err) {
      console.log("Error", err);
      res.send({msj:err,status:404});
    } else  {
      res.send({msj:data,status:100})
    }
});
});

app.post("/crearAlbum",async function(req,res){

  var info={
    "ID_Usuario":req.body.ID_Usuario,
    "NombreAlbum":req.body.NombreAlbum
  }
  const consulta = {
    TableName: 'Album',
    FilterExpression: "#NombreAlbum = :datos",
    ExpressionAttributeNames: {
        "#NombreAlbum": "NombreAlbum",
    },
    
    ExpressionAttributeValues: {
        ":datos": { S: info.NombreAlbum}
    }
    };
    
    ddb.scan(consulta, async function(err, data) {
    if (err) {
      console.log("Error", err);
     res.send(false);
    } else  {
    
      if(data.Items.length!=0){
        res.send(false);
      }else {
        let id=info.ID_Usuario+info.NombreAlbum;
        dirURL ="http://practica2-g31-imagenes.s3-website.us-east-2.amazonaws.com/"+info.ID_Usuario+"/"+info.NombreAlbum;
         urlcorta=info.ID_Usuario+"/"+info.NombreAlbum+"/";
        crear= await CrearAlbum(urlcorta);
         const AlbumCrear = {
          TableName:'Album',
          Item: {
          'IDAlbum':{S:id},
          'NombreAlbum': {S:info.NombreAlbum},
          'ID_Usuario': {S: info.ID_Usuario},
          'Ubicacion': {S: dirURL}
          }
          };
                ddb.putItem(AlbumCrear, function(err,data){
                  if(err){
                    res.send(false);
                  }
                  else {
                    res.send(true);
                  }
                }); 

        }
            }
    });
});

async function CrearAlbum(direccion){
      var params = {
         Bucket: 'practica2-g31-imagenes', 
         Key: direccion, 
         ACL: 'public-read',
         Body:''
        };

      s3.upload(params, function (err, data) {
      if (err) {
          console.log("No se creó la carpeta: ", err);
          } else {
          console.log("Se ha creado la carpeta");  
          }
      });
}

app.post('/subirFoto', async function(req,res){

  var info={
    "NombreFoto":req.body.NombreFoto,
    "Foto":req.body.Foto,
    "ID_Usuario":req.body.ID_Usuario,
    "Descripcion":req.body.Descripcion
  }

  var id=info.ID_Usuario+info.NombreFoto
  const consulta = {
    TableName: 'Foto',
    FilterExpression: "#IDFoto = :datos",
    ExpressionAttributeNames: {
        "#IDFoto": "IDFoto",
    },
    ExpressionAttributeValues: {
        ":datos": { S: id},
    }
    };
    
    ddb.scan(consulta, async function(err, data) {
    if (err) {
      console.log("Error", err);
      res.send(false)
    } else  {
      if(data.Items.length==0){
        
        let ruta=info.ID_Usuario+"/"+info.NombreFoto;
        dir=  await SubirFotoUsuario(ruta,info.Foto);
        dirURL ="http://practica2-g31-imagenes.s3-website.us-east-2.amazonaws.com/"+ruta;  
      ingresar ={
        TableName:"Foto",
        Item:{
          "ID_Foto":{S:id},
          "NombreFoto":{S:info.NombreFoto},
          "Foto":{S:dirURL},
          "ID_Usuario":{S:info.ID_Usuario},
          "Descripcion":{S:info.Descripcion}
        }
      };             
      ddb.putItem(ingresar, function(err,data){
        if(err){
          res.send({valor:false,msj:"Error al intentar subir la foto"});
        }
        else {
          res.send({valor:true, msj:"La foto se ha subido exitosamente"});
        }
      }); 


      }else {
        res.send({valor:true,msj:"Ya existe una foto con este nombre"});
      }
    }
  });

});

app.post('/Albums',async function(req,res){

  var info={"ID_Usuario":req.body.ID_Usuario}

   const consultas = {
    TableName: 'Album',
    FilterExpression: "#ID = :data",
    ExpressionAttributeNames: {
      "#ID": "ID_Usuario",
    },

    ExpressionAttributeValues: {
      ":data": { S: info.ID_Usuario },
    }
  };

  ddb.scan(consultas, function (err, data) {
    if (err) {
      res.send({valor:false,msj:"Error al intentar encontrar el álbum"});
    } else {
      var arregloAlbums = [];
      for (let i = 0; i < data.Items.length; i++) {
        obj={
          ID_Usuario:data.Items[i].ID_Usuario.S,
          NombreAlbum:data.Items[i].NombreAlbum.S
        }
        arregloAlbums.push(obj);
      }
      res.send({
        valor:true,
        msj:"Albums desplegados",
        datos: arregloAlbums
      });
    
    }
  });




});

app.get('/libros',async function(req,res){

  var info={
    "activo":"1"
  }

   const consultas = {
    TableName: 'libros',
    FilterExpression: "#ID = :activo",
    ExpressionAttributeNames: {
      "#ID": "activo",
    },

    ExpressionAttributeValues: {
      ":activo": { N: "1" }
    }
  };

  ddb.scan(consultas, function (err, data) {
    if (err) {
      res.send("Error "+err);
    } else {
     
      var arregloFotos = [];
      for (let i = 0; i < data.Items.length; i++) {
        datos={
          Codigo:data.Items[i].codigo.S,
          Nombre:data.Items[i].nombre.S,
          Autor:data.Items[i].autor.S,
          Portada:data.Items[i].portada.S,
          Libro:data.Items[i].libro.S,
          Sinopsis:data.Items[i].sinopsis.S        
        }
        arregloFotos.push(datos);
      
      }
      res.send(arregloFotos);
    }
  });

});

app.post('/extraerTexto', function (req, res) { 
  var imagen = {
    "Imagen":req.body.Imagen
  }
  var params = {
    Image: { 
      Bytes: Buffer.from(imagen.Imagen, 'base64')
    }
  };
  rekognition.detectText(params, function(err, data) {
    if (err) {res.json({mensaje: "Error"})} 
    else {   
           res.json({texto: data.TextDetections});      
    }
  });
});


// AQUI TRADUCE EL TEXTO DE LA DESCRIPCIÓN
app.post('/traducir', (req, res) => {

  let body = req.body

  let datos={
    "Texto":req.body.Texto,
    //esta variable contiene el idioma al que se quiere traducir
    "idioma":req.body.Idioma
  }

  let params = {
    SourceLanguageCode: 'auto',
    TargetLanguageCode: datos.idioma,
    Text: datos.Texto || 'Hello there'
  };
  translate.translateText(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
      res.send({valor:false, error: err })
    } else {
      res.send({valor:true, mensaje: data })
    }
  });
});

app.post('/agregarBiblioteca', async function (req, res) {
  Aregistrar = {
      "codigo":req.body.Codigo,
      "Nombre": req.body.Nombre,
      "Autor": req.body.Autor,
      "Libro":req.body.Libro,
      "Portada":req.body.Portada,
      "Sinopsis":req.body.Sinopsis,
      "Usuario":req.body.Usuario
  }
const consulta = {
TableName: 'Biblioteca',
FilterExpression: "#user = :datos",
ExpressionAttributeNames: {
    "#user": "codigo",
},

ExpressionAttributeValues: {
    ":datos": { S: req.body.Codigo},
}
};

ddb.scan(consulta, async function(err, data) {
if (err) {
  console.log("Error", err);
  res.send({msj:err,status:404});
} else  {
  if(data.Items.length!=0){
    res.send({msj:data,status:200});
  }else {
    const UsuarioRegistrar = {
      TableName:'Biblioteca',
      Item: {
        "codigo":{S:req.body.Codigo},
        "Nombre":{S:req.body.Nombre},
        "Autor": {S:req.body.Autor},
        "Libro":{S:req.body.Libro},
        "Portada":{S:req.body.Portada},
        "Sinopsis":{S:req.body.Sinopsis},
        "Usuario":{S:req.body.Usuario},
        "Favorito":{N:"0"}
      }
      };
      ddb.putItem(UsuarioRegistrar, function(err,data){
        if(err){
          console.log(err)
          res.send({msj:err,status:404});
        }
        else {
          res.send({msj:data,status:100});
        }
      }); 

    }
  }
});
});

app.post('/getBiblioteca',async function(req,res){

  var info={
    "Usuario":req.body.Usuario
  }

   const consultas = {
    TableName: 'Biblioteca',
    FilterExpression: "#ID = :Usuario",
    ExpressionAttributeNames: {
      "#ID": "Usuario",
    },

    ExpressionAttributeValues: {
      ":Usuario": { S: info.Usuario }
    }
  };

  ddb.scan(consultas, function (err, data) {
    if (err) {
      res.send("Error "+err);
    } else {
     
      var arregloFotos = [];
      for (let i = 0; i < data.Items.length; i++) {
        datos={
          Codigo:data.Items[i].codigo.S,
          Nombre:data.Items[i].Nombre.S,
          Autor:data.Items[i].Autor.S,
          Portada:data.Items[i].Portada.S,
          Libro:data.Items[i].Libro.S,
          Sinopsis:data.Items[i].Sinopsis.S        
        }
        arregloFotos.push(datos);
      
      }
      res.send(arregloFotos);
    }
  });

});

app.post('/favoritos', async function(req,res){

  var edicion={
    "Codigo":req.body.codigo,
    "Favorito":req.body.Favorito
  };
  const actualizados = {
    TableName: "Biblioteca",
    Key: {
        "codigo": { S: edicion.Codigo}
    },
    ExpressionAttributeValues: {
        ':Favorito': { N: edicion.Favorito },      
    },
    UpdateExpression: "set Favorito = :Favorito"
  };
  ddb.updateItem(actualizados, function (err, data) {
    if (err) {
      res.send({msj:err,status:404});
        console.error(err);
    } else{
    res.send({msj:data,status:100});
    }
  });
});

app.post('/getFavoritos',async function(req,res){

  var info={
    "Favorito":"1",
    "Usuario":req.body.usuario
  }

   const consultas = {
    TableName: 'Biblioteca',
    FilterExpression: "#Favorito = :Favorito and #id=:Usuario",
    ExpressionAttributeNames: {
      "#Favorito": "Favorito",
      "#id":"Usuario",
    },

    ExpressionAttributeValues: {
      ":Favorito": { N: "1" },
      ":Usuario":{S:info.Usuario}
    }
  };

  ddb.scan(consultas, function (err, data) {
    if (err) {
      res.send({msj:err,status:404});
      console.log(err)
    } else {
     
      var arregloFotos = [];
      
      for (let i = 0; i < data.Items.length; i++) {
        datos={
          Codigo:data.Items[i].codigo.S,
          Nombre:data.Items[i].Nombre.S,
          Autor:data.Items[i].Autor.S,
          Portada:data.Items[i].Portada.S,
          Libro:data.Items[i].Libro.S,
          Sinopsis:data.Items[i].Sinopsis.S        
        }
        arregloFotos.push(datos);
      
      }
      res.send({msj:arregloFotos,status:100});
    }
  });

});

app.post('/addHistory', async function (req, res) {
  let n= req.body.titulo;
  Aregistrar = {
      "Codigo":req.body.user+n.replace(/ /g, ""),
      "Usuario": req.body.user,
      "Titulo": req.body.titulo,
      "Sinopsis":req.body.sinopsis,
      "Contenido":req.body.contenido
  }
const consulta = {
TableName: 'Historias',
FilterExpression: "#user = :datos",
ExpressionAttributeNames: {
    "#user": "codigo",
},

ExpressionAttributeValues: {
    ":datos": { S:Aregistrar.Codigo},
}
};

ddb.scan(consulta, async function(err, data) {
if (err) {
  console.log(err)
  res.send({msj:err,status:404});
} else  {
  if(data.Items.length!=0){
    res.send({msj:data,status:200});
  }else {
    const UsuarioRegistrar = {
      TableName:'Historias',
      Item: {
        "codigo":{S:Aregistrar.Codigo},
        "Usuario":{S:Aregistrar.Usuario},
        "Titulo":{S:Aregistrar.Titulo},
        "Sinopsis":{S:Aregistrar.Sinopsis},
        "Contenido":{S:Aregistrar.Contenido},
      }
      };
      ddb.putItem(UsuarioRegistrar, function(err,data){
        if(err){
          res.send({msj:err,status:404});
        }
        else {
          res.send({msj:data,status:100});
        }
      }); 

    }
  }
});
});
app.post('/getHistories',async function(req,res){

  var info={
    "Usuario":req.body.usuario
  }

   const consultas = {
    TableName: 'Historias',
    FilterExpression: "#id=:Usuario",
    ExpressionAttributeNames: {
    
      "#id":"Usuario",
    },

    ExpressionAttributeValues: {
      ":Usuario":{S:info.Usuario}
    }
  };

  ddb.scan(consultas, function (err, data) {
    if (err) {
      res.send({msj:err,status:404});
      console.log(err)
    } else {
     
      var arregloFotos = [];
      
      for (let i = 0; i < data.Items.length; i++) {
        datos={
          Titulo:data.Items[i].Titulo.S,
          Sinopsis:data.Items[i].Sinopsis.S,
          Contenido:data.Items[i].Contenido.S,
          Codigo:data.Items[i].codigo.S,    
        }
        arregloFotos.push(datos);
      
      }
      res.send({msj:arregloFotos,status:100});
    }
  });

});
app.post('/setHistories', async function(req,res){

  var edicion={
    
    "Codigo":req.body.codigo,
    "Usuario":req.body.Usuario,
    "Titulo":req.body.Titulo,
    "Sinopsis":req.body.Sinopsis,
    "Contenido":req.body.Contenido
  };
  const actualizados = {
    TableName: "Historias",
    Key: {
        "codigo": { S: edicion.Codigo}
    },
    ExpressionAttributeValues: {
        ':Titulo': { S: edicion.Titulo },    
        ':Sinopsis':{S: edicion.Sinopsis},
        ':Contenido': {S:edicion.Contenido},
        
    },
    UpdateExpression: "set Titulo = :Titulo, Sinopsis=:Sinopsis, Contenido=:Contenido"
  };
  ddb.updateItem(actualizados, function (err, data) {
    if (err) {
      res.send({msj:err,status:404});
        console.error(err);
    } else{
    res.send({msj:data,status:100});
    }
  });
});
app.post("/importar",async function(req,res){
  
  let a="https://librossemi1.s3.us-east-2.amazonaws.com/"+req.body.libro
  console.log(a)
  file =fs.createWriteStream("pdf/file.pdf");
  https.get(a, async function(response){
    response.pipe(file)
  })
  res.send({status:true})
})

app.get("/extraer",async function(req,res){
  var cad="";
  console.log("empezó")
  pdfExtract.extract('pdf/file.pdf', options, (err, data) => {
    if (err) return console.log(err);
    data=JSON.stringify(data.pages);
    let contenido=JSON.parse(data)

    contenido.forEach(element => {
    
      let array=element.content
      array.forEach(st=>{
       cad+=st.str
      })
    });
    res.send({texto:cad})
  });
});

app.post("/audio",async (req,res)=>{
  const input ={
    Text:req.body.audio,
    OutputFormat: "mp3",
    VoiceId: "Miguel"
}
  Polly.synthesizeSpeech(input,(err,data)=>{
    if(err){
        res.send(err)
        return
    }
    if(data.AudioStream instanceof Buffer){
      const valor= SubirAudio(data.AudioStream);
        if (valor){
          res.send({status:true})
          return
        }
      res.send({status:false})
      /*fs.writeFile("audio.mp3",data.AudioStream, (err)=>{
          if (err){
              res.send(err)
              return
          }
          res.send("Success")
      });*/
      //res.send(data.AudioStream)
      //return
    }
    //res.send("error")
  }) 
})