import express from 'express';
import productos from '../data/productos.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.json(productos);
});

router.get('/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ message: 'Producto no encontrado'});
  }
});

// POST - Crear un nuevo producto
router.post('/', (req, res) => {
  const { nombre, descripcion, precio, imagen, activo } = req.body;
  const nuevoProducto = {
    id: productos.length + 1,
    nombre,
    descripcion,
    precio,
    imagen,
    activo
  };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

router.post('/activo', (req, res) => {
  const { nombre, descripcion, precio, imagen } = req.body;
  const nuevoProducto = {
    id: productos.length + 1,
    nombre,
    descripcion,
    precio,
    imagen,
    activo: true
  };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

router.put('/:id', (req, res) => {
  const { nombre, descripcion, precio, imagen, activo } = req.body;
  const productoIndex = productos.findIndex(p => p.id === parseInt(req.params.id));

  if (productoIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  productos[productoIndex] = {
    id: parseInt(req.params.id),
    nombre,
    descripcion,
    precio,
    imagen,
    activo
  };

  res.json(productos[productoIndex]);
});


router.delete('/:id', (req, res) => {
  const productoIndex = productos.findIndex(p => p.id === parseInt(req.params.id));

  if (productoIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  productos.splice(productoIndex, 1);
  res.status(200).json({ message: 'Producto eliminado correctamente' });
});

export default router;