import React from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaLock,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
      {/* Decoración de fondo sutil */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
          {/* Columna 1: Brand */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-serif font-bold text-brand-light mb-4 tracking-tighter">
              &#123;CH_F+&#125;
            </h2>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Transformando ideas en experiencias digitales y narrativas que
              conectan.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-lg mb-4 text-brand-primary">
              Explorar
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/proyectos" className="hover:text-white transition">
                  Proyectos
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition">
                  Blog & Escritos
                </Link>
              </li>
              <li>
                <Link to="/tienda" className="hover:text-white transition">
                  Tienda
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-white transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Social */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-bold text-lg mb-4 text-brand-primary">
              Conectemos
            </h3>
            <div className="flex gap-4">
              <a
                href="https://github.com/ChannelF-Oleo"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white transition duration-300"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="www.linkedin.com/in/channel-feliz-de-oleo-86a12537b"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white transition duration-300"
              >
                <FaLinkedinIn size={20} />
              </a>
              <a
                href="https://www.instagram.com/channelf_oleo/"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white transition duration-300"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p className="flex items-center gap-1">
            © {currentYear} Channel Feliz. Hecho con{" "}
            <FaHeart className="text-red-500 animate-pulse" /> y React.
          </p>

          {/* EL ACCESO SECRETO AL ADMIN */}
          <Link
            to="/admin"
            className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity duration-300 hover:text-brand-primary"
            title="Acceso Administrativo"
          >
            <FaLock size={10} /> Panel Privado
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
