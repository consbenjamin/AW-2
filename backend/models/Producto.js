import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  imagen: String,
  activo: { type: Boolean, default: true },
  categoria: String
});

const Producto = mongoose.model('Producto', productoSchema);

export default Producto;