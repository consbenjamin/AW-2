"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ShoppingCart, X, Plus, Minus, Menu, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation"

export default function Navbar({
  carrito,
  isCartOpen,
  setIsCartOpen,
  eliminarDelCarrito,
  actualizarCantidad,
  realizarCompra,
  calcularTotal,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [username, setUsername] = useState(null)
  const cartRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setUsername(storedUsername)
    }
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setIsCartOpen])

  
  useEffect(() => {
    if (isCartOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isCartOpen])

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              TechStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Inicio
            </Link>
            
          </nav>

          {/* Cart - Desktop */}
          <div className="flex items-center space-x-4">
            {/* Mostrar usuario si está logeado */}
            {username ? (
              <div className="flex items-center space-x-3 text-gray-300">
                <button
                  onClick={() => router.push("/perfil")}
                  className="flex items-center space-x-2 hover:text-green-500 transition-colors cursor-pointer" 
                >
                  <User size={20}/>
                  <span className="hidden sm:inline">{username}</span>
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem("token")
                    localStorage.removeItem("username")
                    setUsername(null)
                    window.location.href = "/"
                  }}
                  className="hover:text-red-500 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Iniciar sesión
              </Link>
            )}

            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Carrito de compras"
            >
              <ShoppingCart size={22} />
              {carrito.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {carrito.reduce((total, item) => total + (item.cantidad || 1), 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Menú"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors py-2">
                Inicio
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          ref={cartRef}
          className={`absolute right-0 top-0 h-full bg-white text-gray-900 shadow-xl transition-transform duration-300 transform w-full max-w-md ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Carrito de Compras</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="Cerrar carrito"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
              {carrito.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingCart size={48} className="mb-4 opacity-30" />
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {carrito.map((producto) => (
                    <li key={producto.id} className="flex border-b pb-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                        <img
                          src={producto.imagen || "/placeholder.svg?height=80&width=80"}
                          alt={producto.nombre}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="line-clamp-2">{producto.nombre}</h3>
                          <p className="ml-4">${producto.precio}</p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() => actualizarCantidad(producto.id, (producto.cantidad || 1) - 1)}
                              className="px-2 py-1 hover:bg-gray-100"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-2">{producto.cantidad || 1}</span>
                            <button
                              onClick={() => actualizarCantidad(producto.id, (producto.cantidad || 1) + 1)}
                              className="px-2 py-1 hover:bg-gray-100"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => eliminarDelCarrito(producto.id)}
                            className="text-sm font-medium text-cyan-600 hover:text-cyan-800"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {carrito.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between text-base font-medium">
                  <p>Subtotal</p>
                  <p>${calcularTotal().toFixed(2)}</p>
                </div>
                <button
                  onClick={realizarCompra}
                  className="w-full bg-cyan-600 text-white py-3 px-4 rounded-md hover:bg-cyan-700 transition-colors font-medium"
                >
                  Finalizar Compra
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Seguir Comprando
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}