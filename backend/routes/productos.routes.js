import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar el archivo productos.json
const productosFilePath = path.join(__dirname, '../data/productos.json');
let productos = JSON.parse(fs.readFileSync(productosFilePath, 'utf-8'));

const router = express.Router();

router.get('/', (req, res) => {
  const { categoria } = req.query;

  let resultado = productos;

  if (categoria) {
    resultado = resultado.filter(p => 
      p.categoria?.toLowerCase() === categoria.toLowerCase()
    );
  }
  res.json(resultado);
});


router.get('/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});


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
  
  // Guardar los productos actualizados en el archivo
  fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));

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
  
  fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));

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

  fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));

  res.json(productos[productoIndex]);
});

router.delete('/:id', (req, res) => {
  const productoIndex = productos.findIndex(p => p.id === parseInt(req.params.id));

  if (productoIndex === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  productos.splice(productoIndex, 1);
  
  fs.writeFileSync(productosFilePath, JSON.stringify(productos, null, 2));

  res.status(200).json({ message: 'Producto eliminado correctamente' });
});

export default router;
