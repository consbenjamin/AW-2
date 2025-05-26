import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

import productosRoutes from './routes/productos.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import ventasRoutes from './routes/ventas.routes.js';


const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => {
  console.error('❌ Error al conectar a MongoDB:', err);
  process.exit(1);
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use('/productos', productosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/ventas', ventasRoutes);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});