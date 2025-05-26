import express from 'express';
import Venta from '../models/Venta.js';
import Usuario from '../models/Usuario.js';
import Producto from '../models/Producto.js';

const router = express.Router();

// Obtener todas las ventas
router.get('/', async (req, res) => {
  try {
    const ventas = await Venta.find().populate('id_usuario').populate('productos.id');
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas', error });
  }
});

// Obtener una venta por ID
router.get('/:id', async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id).populate('id_usuario').populate('productos.id');
    if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar la venta', error });
  }
});

// Crear nueva venta
router.post('/', async (req, res) => {
  try {
    const { id_usuario, fecha, total, direccion, productosVendidos } = req.body;

    const usuario = await Usuario.findById(id_usuario);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    for (const item of productosVendidos) {
      const producto = await Producto.findById(item.id);
      if (!producto) return res.status(404).json({ message: `Producto con ID ${item.id} no encontrado` });
    }

    const nuevaVenta = new Venta({
      id_usuario,
      fecha,
      total,
      direccion,
      productos: productosVendidos
    });

    await nuevaVenta.save();
    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la venta', error });
  }
});

// Crear nueva venta solo con productos activos
router.post('/activa', async (req, res) => {
  try {
    const { id_usuario, fecha, total, direccion, productosVendidos } = req.body;

    const usuario = await Usuario.findById(id_usuario);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    for (const item of productosVendidos) {
      const producto = await Producto.findOne({ _id: item.id, activo: true });
      if (!producto) return res.status(404).json({ message: `Producto con ID ${item.id} no encontrado o no activo` });
    }

    const nuevaVenta = new Venta({
      id_usuario,
      fecha,
      total,
      direccion,
      productos: productosVendidos
    });

    await nuevaVenta.save();
    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la venta activa', error });
  }
});

// Actualizar una venta
router.put('/:id', async (req, res) => {
  try {
    const { id_usuario, fecha, total, direccion, productosVendidos } = req.body;

    const ventaActualizada = await Venta.findByIdAndUpdate(
      req.params.id,
      {
        id_usuario,
        fecha,
        total,
        direccion,
        productos: productosVendidos
      },
      { new: true }
    );

    if (!ventaActualizada) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    res.json(ventaActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la venta', error });
  }
});

// Eliminar una venta
router.delete('/:id', async (req, res) => {
  try {
    const ventaEliminada = await Venta.findByIdAndDelete(req.params.id);
    if (!ventaEliminada) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.status(200).json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la venta', error });
  }
});

export default router;
