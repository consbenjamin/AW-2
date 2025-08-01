"use client"

export default function ModalProduct({
  producto,
  onChange,
  onClose,
  onSave,
  modo,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">
          {modo === 'crear' ? 'Crear Producto' : 'Editar Producto'}
        </h2>

        <div className="space-y-3">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={producto.nombre || ''}
              onChange={onChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type="number"
              name="precio"
              value={producto.precio || 0}
              onChange={onChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="descripcion"
              value={producto.descripcion || ''}
              onChange={onChange}
              className="w-full mt-1 p-2 border rounded"
              rows={3}
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Imagen (URL)</label>
            <input
              type="text"
              name="imagen"
              value={producto.imagen || ''}
              onChange={onChange}
              className="w-full mt-1 p-2 border rounded"
              placeholder="https://example.com/imagen.jpg"
            />
          </div>

          {/* Activo */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="activo"
              checked={producto.activo || false}
              onChange={onChange}
            />
            <label className="text-sm text-gray-700">Activo</label>
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            name="categoria"
            value={producto.categoria || ''}
            onChange={onChange}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">Seleccionar categoría</option>
            <option value="laptops">Laptops</option>
            <option value="smartphones">Smartphones</option>
            <option value="perifericos">Periféricos</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
