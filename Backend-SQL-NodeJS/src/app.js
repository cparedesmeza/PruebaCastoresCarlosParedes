import express from 'express';
import cors from 'cors';
import { getConecction } from './database/connection.js';
import router from './routes/products.routes.js';

// Conectar a la base de datos
getConecction();

const app = express();

// Configuración de CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Configuración para analizar JSON
app.use(express.json());

// Usar las rutas
app.use(router);

export default app;
