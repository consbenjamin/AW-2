import mongoose from 'mongoose';

const ventaSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  productos: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ]
}, {
  timestamps: true
});

export default mongoose.model('Venta', ventaSchema);
