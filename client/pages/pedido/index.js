import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Pedido() {
  const router = useRouter();
  const { id } = router.query;

  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchVenta = async () => {
      try {
        const res = await fetch(`http://localhost:5000/ventas/${id}`);
        if (!res.ok) throw new Error('No se pudo obtener la venta');
        const data = await res.json();
        setVenta(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenta();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Cargando pedido...</p>
      </div>
    );
  }

  if (!venta) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">No se encontró la venta</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🧾 Detalle de tu pedido</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
        <p><span className="font-semibold">🗓 Fecha:</span> {new Date(venta.fecha).toLocaleString()}</p>
        <p><span className="font-semibold">📍 Dirección:</span> {venta.direccion}</p>
        <p><span className="font-semibold">💰 Total:</span> ${venta.total}</p>
        <p><span className="font-semibold">👤 Usuario:</span> {venta.id_usuario?.nombre || 'N/A'}</p>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📦 Productos comprados</h2>
      <div className="divide-y">
        {venta.productos.map((item, index) => (
          <div key={index} className="py-4">
            <p className="text-lg font-medium text-gray-800">{item.id?.nombre || 'Producto eliminado'}</p>
            <div className="text-sm text-gray-600">
              <p>Cantidad: {item.cantidad}</p>
              <p>Precio unitario: ${item.id?.precio || 'N/A'}</p>
              <p>Subtotal: ${item.cantidad * (item.id?.precio || 0)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
