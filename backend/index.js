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
var port=8000;
app.listen(port, () => console.log('Servidor corriendo en el puerto 8000'));
var AWS = require('aws-sdk');
const imageToBase64 =require('image-to-base64')
const ddb = new AWS.DynamoDB(aws_keys.dynamodb);
const s3= new AWS.S3(aws_keys.s3);
const rekognition=new AWS.Rekognition(aws_keys.rekognition);
const translate = new AWS.Translate(aws_keys.translate);
 
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
  // let idUnico = uuidv4();
   // dir=  await SubirFotoUsuario(idUnico+"/FotoPerfil/"+Aregistrar.nombreFoto,Aregistrar.Foto);

    //dirURL ="http://practica2-g31-imagenes.s3-website.us-east-2.amazonaws.com/"+idUnico+"/FotoPerfil/"+Aregistrar.nombreFoto;
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

  async function SubirFotoUsuario(direccion, base64){
    return new Promise((resolve, reject) => {
      buffer = new Buffer.from(base64,'base64')
      
      const params = {
        Bucket: "practica2-g31-imagenes",
        Key: direccion,
        Body: buffer,
        ACL:'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/jpg`
      };
      s3.upload(params, function(err, data) {
          if (err) {
            console.log(err)
            reject(err)
          }
        resolve(`Foto subida. ${data.Location}`)
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
          console.log(data.Items[0].Password.S)
          console.log(Ingreso.Password)
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
    "Password":req.body.Password,
    "Foto":req.body.Foto,
    "nombreFoto":req.body.nombreFoto,
    "Etiquetas":""
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
        let id=data.Items[0].ID_Usuario.S;
        if(edicion.Password==data.Items[0].Password.S){
          let dirURL="http://practica2-g31-imagenes.s3-website.us-east-2.amazonaws.com/"+id+"/FotoPerfil/"+edicion.nombreFoto;
          if (edicion.Foto!=""){
          dir=  await SubirFotoUsuario(id+"/FotoPerfil/"+edicion.nombreFoto,edicion.Foto);
          dirURL ="http://practica2-g31-imagenes.s3-website.us-east-2.amazonaws.com/"+id+"/FotoPerfil/"+edicion.nombreFoto;
          }
          var params = {
            /* S3Object: {
              Bucket: "mybucket", 
              Name: "mysourceimage"
            }*/
            Image: { 
              Bytes: Buffer.from(edicion.Foto, 'base64')
            }, 
            Attributes: ['ALL']
          };
        
          rekognition.detectFaces(params, function(err, data) {
            if (err) {console.log("Error") 
            res.send(false);
            return
            } 
            else { 
                
                edicion.Etiquetas=String(data.FaceDetails[0].AgeRange.Low)+" años mínimo y "
                edicion.Etiquetas+=String(data.FaceDetails[0].AgeRange.High)+" años máximo, "
                if (data.FaceDetails[0].Smile.Value){
                  edicion.Etiquetas+="Sonríe, "
                }else{
                  edicion.Etiquetas+="No sonríe, "
                }
                if(data.FaceDetails[0].Eyeglasses.Value){
                  edicion.Etiquetas+="Usa lentes, "
                }else{
                  edicion.Etiquetas+="Sin lentes, "
                }
                if(data.FaceDetails[0].Gender.Value=="Female"){
                  edicion.Etiquetas+="Mujer."
                }else{
                  edicion.Etiquetas+="Hombre."
                }
                const actualizados = {
                  TableName: "Usuario",
                  Key: {
                      "ID_Usuario": { S: id}
                  },
                  ExpressionAttributeValues: {
                      ':Usuario': { S: edicion.UsuarioNuevo },
                      ':Nombre': { S: edicion.Nombre },
                      ':Foto': { S: dirURL},
                      ':Etiqueta':{S:edicion.Etiquetas}
                  },
                  UpdateExpression: "set Usuario = :Usuario, Nombre=:Nombre, Foto=:Foto,Etiqueta=:Etiqueta"
                };
                ddb.updateItem(actualizados, function (err, data) {
                  if (err) {
                    res.send(false);
                      console.error("Ha habido un error al querer modificar "+ err);
                  } else{
                  res.send({usuario:edicion.UsuarioNuevo, nombre:edicion.Nombre,
                  Foto:dirURL, Etiqueta:edicion.Etiquetas});
                  }
                });
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

app.post('/Albums/Fotos',async function(req,res){

  var info={
    "ID_Usuario":req.body.ID_Usuario
  }

   const consultas = {
    TableName: 'Foto',
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
      res.send("Error "+err);
    } else {
     
      var arregloFotos = [];
      for (let i = 0; i < data.Items.length; i++) {
        datos={
          ID_Usuario:data.Items[i].ID_Usuario.S,
          NombreFoto:data.Items[i].NombreFoto.S,
          Foto:data.Items[i].Foto.S,
          Descripcion:data.Items[i].Descripcion.S
        }
        arregloFotos.push(datos);
      
      }
      res.send(arregloFotos);
    }
  });

});

//Comparando los rostros
app.post('/compararfotos', async function (req, res) { 

  var datos={
    "imagen1":req.body.imagen1,
    "imagen2":req.body.imagen2
  }
  imageToBase64(datos.imagen2) // Path to the image
  .then(
      (response) => {
          var split=String(response).split(",",2);
          var imagen=String(split[0])
          var split2=datos.imagen1.split(",",2);
          var imagen2=String(split2[1])
          var params = {
            
            SourceImage: {
                Bytes: Buffer.from(imagen, 'base64')     
            }, 
            TargetImage: {
                Bytes: Buffer.from(imagen2, 'base64')    
            },
            SimilarityThreshold: '80'
            
           
          };
          rekognition.compareFaces(params, function(err, data) {
            if (err) {res.json({valor: false, mensaje: err})} 
            else {   
                 Comparacion=data.FaceMatches;
                 if (Comparacion.length!=0){
                   res.send({valor:true, mensaje:"¡Bienvenido!"});
                 }else{
                   res.send({valor:false, mensaje:"¡Tu rostro no coinicide con la foto de perfil!"});
                 }
                 //  res.json({Comparacion: data.FaceMatches});      
            }
          });
      }
  )
  .catch(
      (error) => {
          console.log(error); // Logs an error if there was one
      }
  )
  
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
// ESTA PETICIÓN ES PARA CREAR LA CLASIFICACIÓN DE IMÁGENES
app.post('/etiquetas', function (req, res) { 
  var foto = req.body.Foto;
  /*var datos={
    "imagen1":req.body.imagen1,
    "imagen2":req.body.imagen2
  }*/
  imageToBase64(foto) // Path to the image
  .then(
      (response) => {
          var split=String(response).split(",",2);
          var imagen=String(split[0])
          var params = {
            /* S3Object: {
              Bucket: "mybucket", 
              Name: "mysourceimage"
            }*/
            Image: { 
              Bytes: Buffer.from(imagen, 'base64')
            }, 
            MaxLabels: 1
          };
          rekognition.detectLabels(params, function(err, data) {
            if (err) {res.json({mensaje: "Error"})} 
            else {   
                   res.json({texto: data.Labels, mensaje:"OK"});      
            }
          });
      }
  )
  .catch(
      (error) => {
          console.log(error); // Logs an error if there was one
      }
  )
  
});

app.post('/fotoPerfil', async function (req,res){

  var datos={
    "ID":req.body.ID
  }

  direccion=datos.ID+"/FotoPerfil/";
  var arreglo=[]
  var params = {
     Bucket: 'practica2-g31-imagenes', 
    };
  
  result = s3.listObjectsV2(params,function(err,data){
    
     for (let i=0;i<data.Contents.length;i++){
       let llave=String(data.Contents[i].Key).split("/",3)
       let dir=llave[0]+"/"+llave[1]+"/"
       if (dir==direccion){
         fotos={
           "Foto":"http://practica2-g31-imagenes.s3-website.us-east-2.amazonaws.com/"+data.Contents[i].Key
         }
         arreglo.push(fotos)
       }
     }
     res.send(arreglo)
  });
});


app.get('/', async function(req,res){
  res.send("hola");
});