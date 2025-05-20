import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar el archivo ventas.json
const ventasFilePath = path.join(__dirname, '../data/ventas.json');
let ventas = JSON.parse(fs.readFileSync(ventasFilePath, 'utf-8'));

// Cargar el archivo usuarios.json
const usuariosFilePath = path.join(__dirname, '../data/usuarios.json');
const usuarios = JSON.parse(fs.readFileSync(usuariosFilePath, 'utf-8'));

// Cargar el archivo productos.json
const productosFilePath = path.join(__dirname, '../data/productos.json');
const productos = JSON.parse(fs.readFileSync(productosFilePath, 'utf-8'));

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

  const usuario = usuarios.find(u => u.id === id_usuario);
  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

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
  
  // Guardar las ventas actualizadas en el archivo
  fs.writeFileSync(ventasFilePath, JSON.stringify(ventas, null, 2));

  res.status(201).json(nuevaVenta);
});


router.post('/activa', (req, res) => {
  const { id_usuario, fecha, total, direccion, productosVendidos } = req.body;

  const usuario = usuarios.find(u => u.id === id_usuario);
  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

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
  
  // Guardar las ventas actualizadas en el archivo
  fs.writeFileSync(ventasFilePath, JSON.stringify(ventas, null, 2));

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

  // Guardar las ventas actualizadas en el archivo
  fs.writeFileSync(ventasFilePath, JSON.stringify(ventas, null, 2));

  res.json(ventas[ventaIndex]);
});

router.delete('/:id', (req, res) => {
  const ventaIndex = ventas.findIndex(v => v.id === parseInt(req.params.id));

  if (ventaIndex === -1) {
    return res.status(404).json({ message: 'Venta no encontrada' });
  }

  ventas.splice(ventaIndex, 1);

  // Guardar las ventas actualizadas en el archivo
  fs.writeFileSync(ventasFilePath, JSON.stringify(ventas, null, 2));

  res.status(200).json({ message: 'Venta eliminada correctamente' });
});

export default router;
