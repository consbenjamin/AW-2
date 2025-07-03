import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['admin', 'cliente'],
    default: 'cliente'
  }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;
