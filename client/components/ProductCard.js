"use client"

import { useState } from "react";
import { ShoppingCart, Cpu, MemoryStickIcon as Memory, HardDrive } from "lucide-react";
import Image from "next/image";

export default function ProductCard({ producto, onAgregar }) {
  const [isHovered, setIsHovered] = useState(false)

  // Función para determinar el icono según la categoría
  const getCategoryIcon = (categoria) => {
    switch (categoria?.toLowerCase()) {
      case "laptops":
        return <Cpu className="mr-1" size={14} />
      case "smartphones":
        return <Memory className="mr-1" size={14} />
      case "perifericos":
        return <HardDrive className="mr-1" size={14} />
      default:
        return <Cpu className="mr-1" size={14} />
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden h-48">
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
          width={500}
          height={500}

        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          {getCategoryIcon(producto.categoria)}
          <span>{producto.categoria || "Componente"}</span>
        </div>

        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{producto.nombre}</h3>

        <div className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {producto.descripcion || "Componente de alta calidad para tu PC gaming o de trabajo."}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <span className="font-bold text-lg text-gray-900">${producto.precio}</span>
            {producto.precioAnterior && (
              <span className="text-sm text-gray-500 line-through ml-2">${producto.precioAnterior}</span>
            )}
          </div>

          <button
            onClick={() => onAgregar(producto)}
            className="flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-full transition-colors"
            aria-label="Agregar al carrito"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
