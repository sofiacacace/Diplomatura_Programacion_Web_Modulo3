// Importación de módulos:
const express = require('express');
const mysql = require('mysql');
const util = require('util');
const cors = require('cors');

const app = express(); // Defino aplicación express
const port = 3001; // Puerto donde corre la aplicación

app.use(express.json()); 
app.use(cors());

// Conexión con la base de datos:
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'listalibros'
});

conexion.connect((error) => {
    if (error) {
        throw {
            message: 'Error inesperado.',
            status: 500
        }
    }
    console.log('Se estableció conexión con la base de datos.');
});

const qy = util.promisify(conexion.query).bind(conexion);

/**
 * Listas de libros
 * 
 * Ruta: Categoria  
 */

// MOSTRAR TODAS LAS CATEGORÍAS
app.get('/api/categoria', async (req, res) => {
    try{
        let query = 'SELECT * FROM categoria';

        let respuesta = await qy(query);

        if (respuesta.length == 0) {
            throw {
                message: 'La tabla categoría está vacía.'
            }
        }

        res.json(respuesta);
        console.log('Operación realizada de manera correcta, sin errores.')
        res.status(200);
    
    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error('No encontrado.');
        res.status(404).send({"Error": e.message}); 
    }
});

// MOSTRAR UNA CATEGORÍA
app.get('/api/categoria/:id', async (req, res) => {
    try{
        let query = 'SELECT * FROM categoria WHERE id = ?';

        let respuesta = await qy(query, [req.params.id]);

        if (respuesta.length == 0) {
            throw {
                message: 'La categoría no existe.'
            }
        }

        res.json(respuesta);
        console.log('Operación realizada de manera correcta, sin errores.')
        res.status(200);
    
    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error('No encontrado.');
        res.status(404).send({"Error": e.message}); 
    }
});

// AGREGAR CATEGORÍA
app.post('/api/categoria', async (req, res) => {
    try{
        if (!req.body.nombre) {
            throw {
                message: 'Faltan datos.',
                status: 400
            }
        }

        let query = 'SELECT id FROM categoria WHERE nombre = ?';

        const nombre = req.body.nombre.toUpperCase();
        let respuesta = await qy(query, [nombre]);

        if (respuesta.length > 0) {
            throw {
                message: 'Ese nombre de categoría ya existe.',
                status: 404
            }
        }

        query = 'INSERT INTO categoria (nombre) VALUE (?)';

        respuesta = await qy(query, [nombre]);

        res.json(respuesta);
        console.log('Operación realizada de manera correcta, sin errores.')
        res.status(200);

    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error(e.message);
        res.status(e.status).send({"Error": e.message}); 
    }
});

// ELIMINAR UNA CATEGORIA
app.delete('/api/categoria/:id', async (req, res) => {
    try{
        let query = 'SELECT * FROM libro WHERE categoria_id = ?';

        let respuesta = await qy(query, [req.params.id]);

        if (respuesta.length > 0) {
            throw {
                message: 'La categoria tiene libros asociados. NO se puede ELIMINAR.',
                status: 400
            }
        }

        query = 'SELECT * FROM categoria WHERE id = ?';

        respuesta = await qy(query, [req.params.id]);

        if (respuesta.length == 0) {
            throw {
                message: 'No existe la categoría indicada.',
                status: 404
            }
        }

        query = 'DELETE FROM categoria WHERE id = ?';

        respuesta = await qy(query, [req.params.id]);

        res.send({"respuesta": 'La categoría se eliminó correctamente'});
        console.log('Operación realizada de manera correcta, sin errores.')
        res.status(200);
    
    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error(e.message);
        res.status(e.status).send({"Error": e.message}); 
    }
});

/**
 * Listas de libros
 * 
 * Ruta: Personas 
 */

// MOSTRAR TODAS LAS PERSONAS
app.get('/api/persona', async (req, res) => {
    try{
        let query = 'SELECT * FROM persona';

        let respuesta = await qy(query);

        if (respuesta.length == 0) {
            throw {
                message: 'La tabla persona está vacía.'
            }
        }

        res.json(respuesta);
        console.log('Operación realizada de manera correcta, sin errores.')
        res.status(200);
    
    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error('No encontrado.');
        res.status(404).send({"Error": e.message}); 
    }
});

// MOSTRAR UNA PERSONA
app.get('/api/persona/:id', async (req, res) => {
    try{
        let query = 'SELECT * FROM persona WHERE id = ?';

        let respuesta = await qy(query, [req.params.id]);

        if (respuesta.length == 0) {
            throw {
                message: 'No se encuentra esa persona.'
            }
        }

        res.json(respuesta);
        console.log('Operación realizada de manera correcta, sin errores.')
        res.status(200);
    
    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error('No encontrado.');
        res.status(404).send({"Error": e.message}); 
    }
});

// AGREGAR PERSONA
app.post('/api/persona', async (req, res) => {
    try{
        if (!req.body.nombre || !req.body.apellido || !req.body.email || !req.body.alias) {
            throw {
                message: 'Faltan datos.',
                status: 400
            }
        }

        let query = 'SELECT id FROM persona WHERE email = ?';

        const nombre = req.body.nombre.toUpperCase();
        const apellido = req.body.apellido.toUpperCase();
        const email = req.body.email.toUpperCase();
        const alias = req.body.alias.toUpperCase();

        let respuesta = await qy(query, [email]);

        if (respuesta.length > 0) {
            throw {
                message: 'El email ya se encuentra registrado.',
                status: 404
            }
        }

        query = 'INSERT INTO persona (nombre, apellido, email, alias) VALUE (?, ?, ?, ?)';

        respuesta = await qy(query, [nombre, apellido, email, alias]);

        res.json(respuesta);
        console.log('Operación realizada de manera correcta, sin errores.')
        res.status(200);

    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error(e.message);
        res.status(e.status).send({"Error": e.message}); 
    }
});

// MODIFICAR UNA PERSONA
app.put('/api/persona/:id', async (req, res) => {
    try{
        if (!req.body.nombre || !req.body.apellido || !req.body.alias) {
            throw {
                message: 'Faltan datos.',
                status: 400
            }
        }

        let query = 'SELECT email FROM persona WHERE id = ?';

        let respuesta = await qy(query, [req.params.id]);

        if (respuesta.length == 0){
            throw {
                message: 'No se encuentra esa persona.',
                status: 404
            }
        }

        if (!req.body.email || (respuesta[0].email == req.body.email.toUpperCase())) {
            const nombre = req.body.nombre.toUpperCase();
            const apellido = req.body.apellido.toUpperCase();
            const alias = req.body.alias.toUpperCase();

            query = 'UPDATE persona SET nombre = ?, apellido = ?, alias = ? WHERE id = ?';

            respuesta = await qy(query, [nombre, apellido, alias, req.params.id]);

            res.json(respuesta);
            console.log('Operación realizada de manera correcta, sin errores.')
            res.status(200);

        } else if (respuesta[0].email != req.body.email.toUpperCase()) {
            throw {
                message: 'El email no puede ser modificado.',
                status: 400
            }
        } 

    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error(e.message);
        res.status(e.status).send({"Error": e.message}); 
    }
});

// ELIMINAR UNA PERSONA
app.delete('/api/persona/:id', async (req, res) => {
    try{
        let query = 'SELECT * FROM libro WHERE persona_id = ?';

        let respuesta = await qy(query, [req.params.id]);

        if (respuesta.length > 0) {
            throw {
                message: 'La persona tiene libros asociados. NO se puede ELIMINAR.',
                status: 400
            }
        }

        query = 'SELECT * FROM persona WHERE id = ?';

        respuesta = await qy(query, [req.params.id]);

        if (respuesta.length == 0) {
            throw {
                message: 'No existe esa persona.',
                status: 404
            }
        }

        query = 'DELETE FROM persona WHERE id = ?';

        respuesta = await qy(query, [req.params.id]);

        res.send({"respuesta": 'La persona se eliminó correctamente'});
        console.log('Operación realizada de manera correcta, sin errores.')
        res.status(200);
    
    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error(e.message);
        res.status(e.status).send({"Error": e.message}); 
    }
});



/**
 * Listas de libros
 * 
 * Ruta: Libros 
 */

// MOSTRAR TODOS LOS LIBROS
app.get('/api/libro', async (req, res) => {
    try{
        let query = 'SELECT * FROM libro';

        let respuesta = await qy(query);

        if (respuesta.length == 0) {
            throw {
                message: 'La tabla libro está vacía.'
            }
        }

        res.json(respuesta);
        console.log('Operación realizada de manera correcta, sin errores.')
        res.status(200);
    
    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error('No encontrado.');
        res.status(404).send({"Error": e.message}); 
    }
});

// MOSTRAR UN LIBRO
app.get('/api/libro/:id', async (req, res) => {
    try{
        let query = 'SELECT * FROM libro WHERE id = ?';

        let respuesta = await qy(query, [req.params.id]);

        if (respuesta.length == 0) {
            throw {
                message: 'No se encuentra ese libro.'
            }
        }

        res.json(respuesta);
        console.log('Operación realizada de manera correcta, sin errores.')
        res.status(200);
    
    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error('No encontrado.');
        res.status(404).send({"Error": e.message}); 
    }
});

// AGREGAR LIBRO
app.post('/api/libro', async (req, res) => {
    try{
        if (!req.body.nombre || !req.body.categoria_id) {
            throw {
                message: 'Nombre y categoría son datos obligatorios.',
                status: 400
            }
        }

        let query = 'SELECT * FROM libro WHERE nombre = ?';

        let respuesta = await qy(query, [req.body.nombre]);

        if (respuesta.length > 0) {
            throw {
                message: 'Ese libro ya existe.',
                status: 400
            }
        }

        query = 'SELECT * FROM categoria WHERE id = ?';

        respuesta = await qy(query, [req.body.categoria_id]);

        if (respuesta.length == 0) {
            throw {
                message: 'No existe la categoría indicada.',
                status: 400
            }
        }

        query = 'SELECT * FROM persona WHERE id = ?';

        respuesta = await qy(query, [req.body.persona_id]);

        if (respuesta.length == 0) {
            throw {
                message: 'No existe la persona indicada.',
                status: 400
            }
        }

        query = 'INSERT INTO libro (nombre, descripcion, categoria_id, persona_id) VALUE (?, ?, ?, ?)';

        respuesta = await qy(query, [req.body.nombre, req.body.descripcion, req.body.categoria_id, req.body.persona_id]);

        res.json(respuesta);
        console.log('Operación realizada de manera correcta, sin errores.')
        res.status(200);

    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error(e.message);
        res.status(e.status).send({"Error": e.message}); 
    }
});

// MODIFICAR UN LIBRO
app.put('/api/libro/:id', async (req, res) => {
    try{
        let query = 'SELECT nombre, categoria_id, persona_id FROM libro WHERE id = ?';

        let respuesta = await qy(query, [req.params.id]);

        if (respuesta.length == 0){
            throw {
                message: 'No se encuentra ese libro.',
                status: 404
            }
        }

        if ((respuesta[0].nombre != req.body.nombre.toUpperCase()) || (respuesta[0].categoria_id != req.body.categoria_id) || (respuesta[0].persona_id != req.body.persona_id)) {
            throw {
                message: 'Sólo se puede modificar la descripción del libro.',
                status: 404
            }
        } 

        query = 'UPDATE libro SET descripcion = ? WHERE id = ?';

        respuesta = await qy(query, [req.body.descripcion, req.params.id]);

        res.json(respuesta);
        console.log('Operación realizada de manera correcta, sin errores.')
        res.status(200);

    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error(e.message);
        res.status(e.status).send({"Error": e.message}); 
    }
});

// MODIFICAR UN LIBRO (prestar)
app.put('/api/libro/prestar/:id', async (req, res) => {
    try{
        if (!req.body.persona_id) {
            throw {
                message: 'Faltan datos.',
                status: 400
            }
        }

        let query = 'SELECT * FROM libro WHERE id = ?';

        let respuesta = await qy(query, [req.params.id]);

        if (respuesta.length == 0){
            throw {
                message: 'No se encuentra ese libro.',
                status: 404
            }
        }

        query = 'SELECT persona_id FROM libro WHERE id = ?';

        respuesta = await qy(query, [req.params.id]);

        if (respuesta[0].persona_id != null){
            throw {
                message: 'El libro ya se encuentra prestado, no se puede prestar prestar hasta que no se devuelva.',
                status: 404
            }
        }

        query = 'SELECT * FROM persona WHERE id = ?';

        respuesta = await qy(query, [req.body.persona_id]);

        if (respuesta.length == 0){
            throw {
                message: 'No se encontró la persona a la que se quiere prestar el libro.',
                status: 404
            }
        }

        query = 'UPDATE libro SET persona_id = ? WHERE id = ?';

        respuesta = await qy(query, [req.body.persona_id, req.params.id]);

        res.send(respuesta);
        console.log('El libro se prestó correctamente.')
        res.status(200);

    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }
        
        console.error(e.message);
        res.status(e.status).send({"Error": e.message}); 
    }
});


// MODIFICAR UN LIBRO (devolver)
app.put('/api/libro/devolver/:id', async (req, res) => {
    try{
        let query = 'SELECT * FROM libro WHERE id = ?';

        let respuesta = await qy(query, [req.params.id]);

        if (respuesta.length == 0){
            throw {
                message: 'No se encuentra ese libro.',
                status: 404
            }
        }

        query = 'SELECT persona_id FROM libro WHERE id = ?';

        respuesta = await qy(query, [req.params.id]);

        if (respuesta[0].persona_id == null){
            throw {
                message: 'Ese libro no estaba prestado.',
                status: 404
            }
        }

        query = 'UPDATE libro SET persona_id = ? WHERE id = ?';

        const persona = null;

        respuesta = await qy(query, [persona, req.params.id]);

        res.send(respuesta);
        console.log('Se realizó la devolución correctamente.')
        res.status(200);

    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error(e.message);
        res.status(e.status).send({"Error": e.message}); 
    }
});

// ELIMINAR UN LIBRO
app.delete('/api/libro/:id', async (req, res) => {
    try{
        let query = 'SELECT * FROM libro WHERE id = ?';

        let respuesta = await qy(query, [req.params.id]);

        if (respuesta.length == 0){
            throw {
                message: 'No se encuentra ese libro.',
                status: 404
            }
        }
        
        query = 'SELECT persona_id FROM libro WHERE id = ?';

        respuesta = await qy(query, [req.params.id]);

        if (respuesta[0].persona_id != null){
            throw {
                message: 'Ese libro está prestado, NO se puede borrar.',
                status: 400
            }
        }

        query = 'DELETE FROM libro WHERE id = ?';

        respuesta = await qy(query, [req.params.id]);

        res.send({"respuesta": 'El libro se eliminó correctamente'});
        console.log('Operación realizada de manera correcta, sin errores.')
        res.status(200);
    
    } catch(e) {
        if (e.status == null) {
            res.status(500).send({"Error": "Error inesperado."}); 
        }

        console.error(e.message);
        res.status(e.status).send({"Error": e.message}); 
    }
});

//-------------------------------------------------------------------------------------------
app.listen(port, () => {
    console.log('Aplicación corriendo en el puerto ', port);
});


