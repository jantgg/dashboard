require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

console.log('Antes de preparar la app');

app.prepare().then(() => {
    console.log('Dentro de app.prepare()');

    const server = express();
    const routes = require('./routes'); 

    server.use(cors());
    server.use(express.json());
    server.use(routes);  

    const password = process.env.MONGODB_PASSWORD;
    const uri = process.env.URI;
  
    
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión a MongoDB establecida.');
    })
    .catch(error => {
        console.error("Error al conectar con MongoDB:", error);
    });


    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('Conexión a MongoDB establecida.');
    });

    server.get('*', (req, res) => {
        return handle(req, res);
    });

    const port = process.env.PORT || 3000;
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
}).catch((err) => {
    console.error(err.stack);
    process.exit(1);
});

console.log('Después de preparar la app');
