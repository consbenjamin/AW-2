import express from 'express';
import dotenv from 'dotenv';
import productosRoutes from './routes/productos.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import ventasRoutes from './routes/ventas.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000

app.use(express.json());

app.use('/productos', productosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/ventas', ventasRoutes);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});