import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)] p-4 overflow-hidden">
      {/* Decoración de fondo (Orbes de luz para resaltar el efecto vidrio) */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-primary/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000"></div>

      {/* Tarjeta Glassmorphism (Vidrio Mate) */}
      <div className="relative z-10 max-w-3xl w-full text-center">
        <div className="backdrop-blur-lg bg-white/40 border border-white/50 rounded-2xl shadow-2xl p-8 md:p-12 transform transition duration-500 hover:scale-[1.01]">
          <h2 className="text-brand-primary font-bold tracking-widest text-sm uppercase mb-4">
            Portafolio Profesional
          </h2>

          <h1 className="text-5xl md:text-7xl font-serif text-brand-dark mb-6 drop-shadow-sm">
            Channel Feliz
          </h1>

          <div className="w-32 h-1 bg-gradient-to-r from-brand-primary to-brand-accent mx-auto mb-8 rounded-full"></div>

          <p className="text-xl md:text-2xl text-brand-dark/90 font-light mb-8 leading-relaxed">
            Docente, escritora y desarrolladora web.
            <br />
            <span className="font-serif italic text-brand-primary">
              "Fusionando la narrativa con la tecnología."
            </span>
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              to="/proyectos"
              className="px-8 py-3 bg-brand-dark text-white font-bold rounded-full shadow-lg hover:bg-brand-primary hover:shadow-brand-primary/50 transition-all duration-300 transform hover:-translate-y-1 w-full md:w-auto"
            >
              Ver Proyectos
            </Link>

            <Link
              to="/tienda"
              className="px-8 py-3 bg-white/50 text-brand-dark font-bold rounded-full border border-brand-dark/10 hover:bg-white transition-all duration-300 backdrop-blur-sm w-full md:w-auto"
            >
              Visitar Tienda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
