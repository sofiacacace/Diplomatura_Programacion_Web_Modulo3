var express = require('express'); //Importo modulo express
var app = express();

app.use(express.static('public')); //Conecto la carpeta estática con la app.
app.use(express.urlencoded({ extended: true})); //Para que pueda procesar la información que llegue desde el formulario.

//Asigno servidor:
var puerto = 3000; 

app.listen(puerto, () => {
    console.log('Aplicación corriendo en servidor ' + puerto);
});

var nodemailer = require('nodemailer'); //Importo modulo de envío de mails automático.

//Rutas
app.get('/mail', function(req, res){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sofiacacace3@gmail.com',
            pass: 'Miami12.'
        }
    });

    var mensaje = 'Su registro de datos ha finalizado con éxito. Muchas gracias por su tiempo!';

    var mailOptions = {
        from: 'sofiacacace3@gmail.com',
        to: 'sofiacacace@hotmail.com',
        subject: 'Registro de datos en NodeJS',
        text: mensaje
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
            res.send("Email NO enviado");
        } else {
            console.log('Email enviado: ' + info.response);
            res.send("Email Enviado" + info.response);
        }
    });
});

app.get('/', function(req, res){
    res.send("<!DOCTYPE html><html><head><title>Registro de datos</title><link rel='stylesheet' href='style.css'></head><body><h1>Bienvenido a la página de inicio</h1><p>Haga click <a href='/formulario'>aquí</button></a> para añadir sus datos.</p><br/></body></html>");
});

app.get('/formulario',  function(req, res){
    res.sendFile('/public/form.html', { root: __dirname });
});

app.post('/procesar',  function(req, res){
    res.send("<!DOCTYPE html><html><head><title>Registro de datos</title><link rel='stylesheet' href='style.css'></head><body><h2>Revise si los datos ingresados son correctos:</h2><p>Nombre: "
     + req.body.nombre + "</p><p>Apellido: " + req.body.apellido + "</p><p>Edad: " + req.body.edad + "</p><p>Email: "
      + req.body.email +  "</p><p>Nacionalidad: " + req.body.nacionalidad + 
      "</p><p>Residencia: " + req.body.residencia + "</p><br><a href=/mail><div class='botonok'><button>Info OK</button></div></a><br><br><a href=/formulario class='volver'>Volver al formulario.</a></body></html>")
});

