  var PORT = process.env.PORT || 8080
  const express = require("express")
  const http = require("http");
  const app = express()
  const server = http.createServer(app);
  const path = require('path');
  const fs = require('fs');
  //joining path of directory 


  const multer = require('multer')
  const uuid = require('uuid').v4
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
      const {
        originalname
      } = file;
      cb(null, originalname);
    }
  });
  const upload = multer({
    storage
  })

  const io = require("socket.io")(server);
  app.set("views", "./views")
  app.set("view engine", "ejs")
  app.use("/assets", express.static("public"))
  app.get("/", (req, res) => {
    res.render("index.ejs")
  })
  app.post('/', upload.single('avatar'), (req, res) => {
    res.render("index.ejs")
  })


  var mime = require('mime');



  const {
    Client
  } = require('pg');
  const {
    getMaxListeners
  } = require("process");

  const client = new Client({
    user: "",
    host: "ec2-34-247-151-118.eu-west-1.compute.amazonaws.com",
    database: "dddr8g3c5rcmu8",
    password: "008e4423a8cb84c2eced0ba64bc9cb1520161cc398d9c5a2f62ca1e9a17b9acc",
    port: 5432,
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });;

  client.connect();



  io.sockets.on('connection', async (socket) => {
    client.query('SELECT * FROM public.articles  ORDER BY "like" DESC;', (err, res) => {
        console.log('admin')
        socket.emit('reset', "reset")
        dataTable = []
        if (err) throw err;
        for (let row of res.rows) {
          if (row.public == 1) {
            let buffTitre = Buffer.from(row.titre, 'base64');
            let titre = buffTitre.toString('utf-8');
            let buff = Buffer.from(row.paragraphe, 'base64');
            let paragraphe = buff.toString('utf-8');
            let like = row.like
            //  console.log(text);

            dataRow = [like, row.id, titre, paragraphe, row.public]
            dataTable.push(dataRow)
            socket.emit('datas', dataTable)
          }
        }
      })

      socket.on('moin', async (value) => {
        console.log(value)
        id = value[0]
        pluss = value[1] - 1
        client.query("UPDATE public.articles SET \"like\"=" + pluss + " WHERE id =" + id + "");

    });

    socket.on('send', async (value) => {
      titre = value[0]
      paragraphe = value[1]
      like = 0
      public = value[2]
      titre = Buffer.from(titre).toString('base64')

      paragraphe = Buffer.from(paragraphe).toString('base64')
      client.query("INSERT INTO public.articles( titre, paragraphe, \"like\",\"public\") VALUES ( '" + [titre] + "', '" + [paragraphe] + "', " + [like] + ", " + [public] + ")");
    });

    socket.on('connexion', async (value) => {
      if (value[0] == 'loustyveldidier88@gmail.com') {
        if (value[1] == '@') {
          const directoryPath = path.join(__dirname, 'public/uploads');
          //passsing directoryPath and callback function
          fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
              return console.log('Unable to scan directory: ' + err);
            }
            //listing all files using forEach
            files.forEach(function (file) {
              // Do whatever you want to do with the file
              socket.emit('data', file);

            });
            client.query('SELECT * FROM public.articles  ORDER BY "like" DESC;', (err, res) => {
              console.log('admin')
              socket.emit('clean', "reset")
              dataTable = []
              if (err) throw err;
              for (let row of res.rows) {
                
                  let buffTitre = Buffer.from(row.titre, 'base64');
                  let titre = buffTitre.toString('utf-8');
                  let buff = Buffer.from(row.paragraphe, 'base64');
                  let paragraphe = buff.toString('utf-8');
                  let like = row.like
                  let public = row.public
                  //  console.log(text);
      
                  dataRow = [like, row.id, titre, paragraphe, row.public]
                  dataTable.push(dataRow)
                  socket.emit('dataAdmin', dataTable)
                
              }
            })
      

          });
          socket.emit('coockie', "username=admin");
          socket.emit('admin', 'admin');
        }
      }
    });

    
    socket.on('co', async (value) => {
      if (value == 'username=') {
        if (value == value) {
          const directoryPath = path.join(__dirname, 'public/uploads');
          //passsing directoryPath and callback function
          fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
              return console.log('Unable to scan directory: ' + err);
            }
            //listing all files using forEach
            files.forEach(function (file) {
              // Do whatever you want to do with the file
              socket.emit('data', file);

            });
            client.query('SELECT * FROM public.articles  ORDER BY "like" DESC;', (err, res) => {
              console.log('admin')
              socket.emit('clean', "reset")
              dataTable = []
              if (err) throw err;
              for (let row of res.rows) {
                
                  let buffTitre = Buffer.from(row.titre, 'base64');
                  let titre = buffTitre.toString('utf-8');
                  let buff = Buffer.from(row.paragraphe, 'base64');
                  let paragraphe = buff.toString('utf-8');
                  let like = row.like
                  //  console.log(text);
      
                  let public = row.public
                  //  console.log(text);
      
                  dataRow = [like, row.id, titre, paragraphe, public]
                  dataTable.push(dataRow)
                  socket.emit('dataAdmin', dataTable)
                
              }
            })
      

          });
          socket.emit('admin', 'admin');
          socket.emit('coockie', "username=admin");

        }
      }
    });
    socket.on('deleteFile', async (value) => {

      await socket.emit('dl', value);
      fs.unlink("./public/uploads/"+value, (err) => {
        if (err) {
            console.log("failed to delete local image:"+err);
        } else {
            console.log('successfully deleted local image');                                
        }
})
    });
    socket.on('plus', async (value) => {
      console.log(value)
      id = value[0]
      plus = value[1] + 1
      client.query("UPDATE public.articles SET \"like\"=" + plus + " WHERE id =" + id + "");

    });
    socket.on('sendCommentaire', async (value) => {
      console.log(value)
      id = value[0]
      plus = value[1]
      plus = Buffer.from(plus).toString('base64')
      console.log(id)
      client.query("UPDATE public.articles SET paragraphe='" + [plus] + "' WHERE id=" + id + "");

    });
    socket.on('remove', async (value) => {

      // console.log(value)
      client.query("DELETE FROM public.articles WHERE id =" + value + "");

    });
    socket.on('update_titre', async (value) => {
       id = value[0].replace('h2','')
       titre = Buffer.from(value[1]).toString('base64')

       client.query("UPDATE public.articles SET titre='" + [titre] + "' WHERE id=" + id + "");


    });

    socket.on('update_Paragraphe', async (value) => {
      console.log(value)
     id = value[0].replace('paragraphe','')
     paragraphe = Buffer.from(value[1]).toString('base64')

     client.query("UPDATE public.articles SET paragraphe='" + [paragraphe] + "' WHERE id=" + id + "");


  });
  })

  server.listen(PORT, () => console.log("Server started"))