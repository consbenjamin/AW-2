"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"

export default function Home() {
  const [productos, setProductos] = useState([])
  const [categoria, setCategoria] = useState("")
  const [carrito, setCarrito] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const url = categoria
          ? `http://localhost:5000/productos?categoria=${categoria}`
          : "http://localhost:5000/productos"

        const res = await fetch(url)
        const data = await res.json()
        setProductos(data)
      } catch (err) {
        console.error("Error al obtener productos:", err)
      }
    }

    fetchProductos()
  }, [categoria])

  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito")
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado))
    }
  }, [])

  const agregarAlCarrito = (producto) => {
    
    const productoExistente = carrito.find((item) => item.id === producto._id);

    let nuevoCarrito;
    if (productoExistente) {
      nuevoCarrito = carrito.map((item) =>
        item.id === producto._id
          ? { ...item, cantidad: (item.cantidad || 1) + 1 }
          : item,
      );
    } else {
      nuevoCarrito = [...carrito, { ...producto, id: producto._id, cantidad: 1 }];
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setIsCartOpen(true);
  };


  const eliminarDelCarrito = (productoId) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== productoId)
    setCarrito(nuevoCarrito)
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito))
  }

  const actualizarCantidad = (productoId, cantidad) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(productoId)
      return
    }

    const nuevoCarrito = carrito.map((item) => (item.id === productoId ? { ...item, cantidad } : item))

    setCarrito(nuevoCarrito)
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito))
  }

  const realizarCompra = async () => {
    const usuario = localStorage.getItem("username");
    const userId = localStorage.getItem("user_id");

    if (!usuario || !userId) {
      alert("Debes estar logueado para comprar");
      return;
    }

    const productos = carrito.map(item => ({
      id: item.id,
      cantidad: item.cantidad || 1,
      precio_unitario: item.precio
    }));

    const venta = {
      id_usuario: userId,
      fecha: new Date().toISOString(),
      total: calcularTotal(),
      direccion: "Av. Siempre Viva 742, Buenos Aires",
      productosVendidos: productos
    };

    console.log(venta);

    try {
      const res = await fetch("http://localhost:5000/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venta)
      });

      const data = await res.json(); 
      console.log("Respuesta del servidor:", data);
      
      if (!res.ok) throw new Error("Error al generar orden");

      alert("Compra realizada con éxito");
      setCarrito([]);
      localStorage.removeItem("carrito");
      setIsCartOpen(false);
      window.location.href = `/pedido?id=${data._id}`;
    } catch (err) {
      console.error(err);
      alert("Hubo un problema al generar la orden");
    }
  };


  const calcularTotal = () => {
    return carrito.reduce((total, producto) => {
      return total + producto.precio * (producto.cantidad || 1)
    }, 0)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar
        carrito={carrito}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        eliminarDelCarrito={eliminarDelCarrito}
        actualizarCantidad={actualizarCantidad}
        realizarCompra={realizarCompra}
        calcularTotal={calcularTotal}
      />
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Productos
            </h1>
            <div className="flex items-center bg-white rounded-lg shadow-sm p-1">
              <select
                className="bg-transparent border-none py-2 px-3 rounded-lg focus:outline-none text-gray-700 appearance-none cursor-pointer"
                onChange={(e) => setCategoria(e.target.value)}
                value={categoria}
              >
                <option value="">Todas las categorías</option>
                <option value="laptops">Laptops</option>
                <option value="smartphones">Smartphones</option>
                <option value="perifericos">Periféricos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.length > 0 ? (
              productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} onAgregar={agregarAlCarrito} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Cargando productos...</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
