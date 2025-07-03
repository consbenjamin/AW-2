"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { User, Edit3, Save, X, Trash2, Mail, UserCheck, Shield, AlertTriangle } from "lucide-react"

export default function Perfil() {
  const router = useRouter()
  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null

  const [usuario, setUsuario] = useState(null)
  const [form, setForm] = useState({ nombre: "", apellido: "", email: "", password: "" })
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (!userId) {
      router.push("/login")
      return
    }

    const fetchUsuario = async () => {
      try {
        const res = await fetch(`http://localhost:5000/usuarios/${userId}`)
        const data = await res.json()
        setUsuario(data)
        setForm({ nombre: data.nombre, apellido: data.apellido || "", email: data.email, password: "" })
      } catch (error) {
        console.error("Error al obtener usuario", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsuario()
  }, [userId])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleActualizar = async (e) => {
    e.preventDefault()
    setUpdating(true)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No se encontró el token");
      }

      const res = await fetch(`http://localhost:5000/usuarios/${userId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error("Error al actualizar usuario")

      localStorage.setItem("username", `${form.nombre}`)

      setEditando(false)
      setUsuario({ ...usuario, ...form })
    } catch (err) {
      console.error(err)
      alert("No se pudo actualizar el perfil")
    } finally {
      setUpdating(false)
    }
  }

  const handleEliminar = async () => {
    try {
      const res = await fetch(`http://localhost:5000/usuarios/${userId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Error al eliminar usuario")

      localStorage.clear()
      router.push("/")
    } catch (err) {
      console.error(err)
      alert("No se pudo eliminar la cuenta")
    }
    setShowDeleteModal(false)
  }

  const getInitials = (nombre, apellido) => {
    return `${nombre?.charAt(0) || ""}${apellido?.charAt(0) || ""}`.toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-slate-300 border-t-slate-900"></div>
          <p className="text-slate-600 font-medium text-lg">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-24"></div>
          <div className="px-8 pb-8 -mt-12 relative">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">
                {getInitials(usuario?.nombre, usuario?.apellido)}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-4">
                {usuario?.nombre} {usuario?.apellido}
              </h1>
              <div className="flex items-center gap-2 text-slate-600 mt-2">
                <Mail className="h-4 w-4" />
                <span>{usuario?.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <UserCheck className="h-4 w-4" />
                <span>Cuenta Activa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </h2>
              <p className="text-slate-600 text-sm mt-1">Gestiona tu información de perfil</p>
            </div>
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
              >
                <Edit3 className="h-4 w-4" />
                Editar
              </button>
            )}
          </div>

          <form onSubmit={handleActualizar} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  readOnly={!editando}
                  required
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                    !editando
                      ? "bg-slate-50 border-slate-200 text-slate-600"
                      : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-900"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  readOnly={!editando}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                    !editando
                      ? "bg-slate-50 border-slate-200 text-slate-600"
                      : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Correo Electrónico *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                readOnly={!editando}
                required
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                  !editando
                    ? "bg-slate-50 border-slate-200 text-slate-600"
                    : "bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-slate-900"
                }`}
              />
            </div>

            {editando && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Dejar vacío para mantener la actual"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-slate-900 transition-all duration-200"
                />
                <p className="text-xs text-slate-500 mt-1">Solo completa este campo si deseas cambiar tu contraseña</p>
              </div>
            )}

            {editando && (
              <>
                <div className="border-t border-slate-200 pt-6">
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      <Save className="h-4 w-4" />
                      {updating ? "Guardando..." : "Guardar Cambios"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditando(false)
                        setForm({ ...form, password: "" })
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200/50 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-red-800 flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5" />
              Zona de Peligro
            </h2>
            <p className="text-red-600 text-sm">Esta acción eliminará permanentemente tu cuenta y todos tus datos</p>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar Cuenta
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">¿Estás completamente seguro?</h3>
              </div>
            </div>

            <p className="text-slate-600 mb-6">
              Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y removerá todos tus datos de
              nuestros servidores.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Sí, eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
