import express from 'express';
import ventas from '../data/ventas.js';
import usuarios from '../data/usuarios.js';
import productos from '../data/productos.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(ventas);
});


router.get('/:id', (req, res) => {
  const venta = ventas.find(v => v.id === parseInt(req.params.id));
  if (venta) {
    res.json(venta);
  } else {
    res.status(404).json({ message: 'Venta no encontrada' });
  }
});


router.post('/', (req, res) => {
  const { id_usuario, fecha, total, direccion, productosVendidos } = req.body;

  // Validar que el usuario existe
  const usuario = usuarios.find(u => u.id === id_usuario);
  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  // Validar que los productos existen
  const productosInvalidos = productosVendidos.filter(pv => !productos.some(p => p.id === pv.id));
  if (productosInvalidos.length > 0) {
    return res.status(404).json({ message: 'Algunos productos no existen' });
  }

  const nuevaVenta = {
    id: ventas.length + 1,
    id_usuario,
    fecha,
    total,
    direccion,
    productos: productosVendidos
  };

  ventas.push(nuevaVenta);
  res.status(201).json(nuevaVenta);
});

// POST - Crear una venta solo con productos activos
router.post('/activa', (req, res) => {
  const { id_usuario, fecha, total, direccion, productosVendidos } = req.body;

  // Validar que el usuario existe
  const usuario = usuarios.find(u => u.id === id_usuario);
  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  // Validar que los productos existen y están activos
  const productosInvalidos = productosVendidos.filter(pv => 
    !productos.some(p => p.id === pv.id && p.activo)
  );
  if (productosInvalidos.length > 0) {
    return res.status(404).json({ message: 'Algunos productos no existen o no están activos' });
  }

  const nuevaVenta = {
    id: ventas.length + 1,
    id_usuario,
    fecha,
    total,
    direccion,
    productos: productosVendidos
  };

  ventas.push(nuevaVenta);
  res.status(201).json(nuevaVenta);
});

router.put('/:id', (req, res) => {
  const { id_usuario, fecha, total, direccion, productosVendidos } = req.body;
  const ventaIndex = ventas.findIndex(v => v.id === parseInt(req.params.id));

  if (ventaIndex === -1) {
    return res.status(404).json({ message: 'Venta no encontrada' });
  }

  ventas[ventaIndex] = {
    id: parseInt(req.params.id),
    id_usuario,
    fecha,
    total,
    direccion,
    productos: productosVendidos
  };

  res.json(ventas[ventaIndex]);
});


router.delete('/:id', (req, res) => {
  const ventaIndex = ventas.findIndex(v => v.id === parseInt(req.params.id));

  if (ventaIndex === -1) {
    return res.status(404).json({ message: 'Venta no encontrada' });
  }

  ventas.splice(ventaIndex, 1);
  res.status(200).json({ message: 'Venta eliminada correctamente' });
});

export default router;
