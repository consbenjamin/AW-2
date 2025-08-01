'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ModalProduct from '@/components/ModalProduct'

export default function AdminDashboard() {
  const router = useRouter()

  const [productos, setProductos] = useState([])
  const [productoEditando, setProductoEditando] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modoModal, setModoModal] = useState('editar') // 'crear' o 'editar'

  useEffect(() => {
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')

    if (role !== 'admin' || !token) {
      router.push('/')
      return
    }

    fetch("http://localhost:5000/productos/admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setProductos(data))
  }, [])

  const abrirModalEditar = (producto) => {
    setProductoEditando(producto)
    setModoModal('editar')
    setMostrarModal(true)
  }

  const abrirModalCrear = () => {
    setProductoEditando({ nombre: '', precio: 0, activo: true })
    setModoModal('crear')
    setMostrarModal(true)
  }

  const cerrarModal = () => {
    setMostrarModal(false)
    setProductoEditando(null)
    setModoModal('editar')
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setProductoEditando((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const guardarCambios = async () => {
    const token = localStorage.getItem('token')
    const { _id, ...datosActualizados } = productoEditando

    try {
      const res = await fetch(`http://localhost:5000/productos/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datosActualizados),
      })

      if (!res.ok) throw new Error('Error al actualizar')

      const actualizado = await res.json()
      setProductos((prev) =>
        prev.map((p) => (p._id === actualizado._id ? actualizado : p))
      )
      cerrarModal()
    } catch (err) {
      console.error('❌', err)
      alert('Error al actualizar el producto')
    }
  }

  const crearProducto = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`http://localhost:5000/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productoEditando),
      })

      if (!res.ok) throw new Error('Error al crear')

      const nuevo = await res.json()
      setProductos((prev) => [...prev, nuevo])
      cerrarModal()
    } catch (err) {
      console.error('❌', err)
      alert('Error al crear el producto')
    }
  }

  const eliminarProducto = async (id) => {
    const confirmar = confirm('¿Seguro que querés eliminar este producto?')
    if (!confirmar) return

    await fetch(`http://localhost:5000/productos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    setProductos(productos.filter(p => p._id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Panel de Administración
          </h1>
          <button
            onClick={abrirModalCrear}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Crear Producto
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-200 text-left text-xs uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productos.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.nombre}</td>
                  <td className="px-4 py-3">${p.precio}</td>
                  <td className="px-4 py-3">
                    {p.activo ? (
                      <span className="text-green-600 font-semibold">Activo</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Inactivo</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => abrirModalEditar(p)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(p._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No hay productos cargados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CREAR/EDITAR */}
      {mostrarModal && productoEditando && (
        <ModalProduct
          producto={productoEditando}
          onChange={handleInputChange}
          onClose={cerrarModal}
          onSave={modoModal === 'crear' ? crearProducto : guardarCambios}
          modo={modoModal}
        />
      )}
    </div>
  )
}
