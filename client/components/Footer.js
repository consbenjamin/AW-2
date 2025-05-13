import Link from "next/link"
import { Instagram, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo y redes sociales */}
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <span className="text-xl font-bold text-white">TechStore</span>
            </div>
            <div className="flex space-x-4 mt-4 justify-center md:justify-start">
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-sm text-center">
          <p>© {new Date().getFullYear()} TechStore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
