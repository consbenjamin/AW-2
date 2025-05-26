import express from 'express';
import Producto from '../models/Producto.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;
    const query = categoria ? { categoria: categoria.toLowerCase() } : {};
    const productos = await Producto.find(query);
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar el producto' });
  }
});


router.post('/', async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    const saved = await nuevoProducto.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear producto' });
  }
});


router.post('/activo', async (req, res) => {
  try {
    const nuevoProducto = new Producto({ ...req.body, activo: true });
    const saved = await nuevoProducto.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear producto' });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar producto' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
});



export default router;
