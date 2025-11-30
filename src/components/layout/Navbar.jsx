import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Para saber en qué página estamos

  // En el futuro conectaremos esto al CartContext real
  const cartItems = 0;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Certificaciones", path: "/certificaciones" },
    { name: "Proyectos", path: "/proyectos" },
    { name: "Blog", path: "/blog" },
    { name: "Tienda", path: "/tienda" },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-brand-light/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Nombre */}
          <div className="flex-shrink-0 cursor-pointer">
            <Link to="/" onClick={closeMenu}>
              <h1 className="text-3xl font-bold text-brand-primary font-serif tracking-tighter">
                &#123;CH_F+&#125;
              </h1>
            </Link>
          </div>

          {/* Menú Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-lg font-medium transition-colors duration-300 ${
                    location.pathname === link.path
                      ? "text-brand-primary font-bold"
                      : "text-brand-dark hover:text-brand-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Botón CTA */}
              <Link
                to="/contacto"
                className="bg-brand-dark text-white px-5 py-2 rounded-full hover:bg-brand-primary transition"
              >
                Trabajemos Juntos
              </Link>

              {/* Icono Carrito */}
              <Link
                to="/tienda"
                className="relative text-brand-dark hover:text-brand-primary"
              >
                <FaShoppingCart size={24} />
                {cartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Botón Móvil (Hamburguesa) */}
          <div className="-mr-2 flex md:hidden gap-4">
            <Link to="/tienda" className="text-brand-dark p-2">
              <FaShoppingCart size={24} />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-dark hover:text-brand-primary focus:outline-none"
            >
              {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={closeMenu}
                className="block px-3 py-4 rounded-md text-xl font-medium text-brand-dark hover:text-brand-primary hover:bg-gray-50 w-full text-center"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contacto"
              onClick={closeMenu}
              className="block mt-4 w-3/4 bg-brand-dark text-white text-center py-3 rounded-full mx-auto"
            >
              Trabajemos Juntos
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
