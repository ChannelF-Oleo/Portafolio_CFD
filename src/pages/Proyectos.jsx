import React, { useState } from "react";
import { FaGithub, FaExternalLinkAlt, FaTimes, FaCode } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

// Estilos necesarios para el Swiper del modal
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Proyectos = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  // Datos Dummy (Pronto vendrán de Firebase)
  const projects = [
    {
      id: 1,
      title: "E-commerce PWA",
      category: "Desarrollo Web",
      tech: ["React", "Firebase", "Stripe", "Tailwind"],
      cover: "https://placehold.co/600x400/9f1cc3/FFF?text=Cover+Tienda",
      gallery: [
        "https://placehold.co/800x500/9f1cc3/FFF?text=Vista+Principal",
        "https://placehold.co/800x500/4B2C39/FFF?text=Carrito+de+Compras",
        "https://placehold.co/800x500/E6DAF5/4B2C39?text=Panel+Admin",
      ],
      description:
        "Una aplicación web progresiva completa con carrito de compras, pasarela de pagos y panel de administración en tiempo real.",
      repoLink: "#",
      demoLink: "#",
    },
    {
      id: 2,
      title: "Sistema de Gestión Escolar",
      category: "Educación",
      tech: ["Node.js", "MongoDB", "Express"],
      cover: "https://placehold.co/600x400/4B2C39/FFF?text=School+System",
      gallery: ["https://placehold.co/800x500/222/FFF?text=Dashboard"],
      description:
        "Plataforma para gestión de calificaciones y asistencia de estudiantes con roles para maestros y directivos.",
      repoLink: "#",
      demoLink: "#",
    },
    {
      id: 3,
      title: "Blog Literario Personal",
      category: "Blog / CMS",
      tech: ["Next.js", "Sanity.io"],
      cover: "https://placehold.co/600x400/8a2be2/FFF?text=Blog+Poemas",
      gallery: ["https://placehold.co/800x500/333/FFF?text=Lectura"],
      description:
        "Un espacio minimalista para publicar poemas y cuentos, optimizado para SEO y lectura cómoda.",
      repoLink: "#",
      demoLink: "#",
    },
    {
      id: 4,
      title: "App de Clima",
      category: "API Integration",
      tech: ["JavaScript", "OpenWeatherMap"],
      cover: "https://placehold.co/600x400/blue/FFF?text=Weather+App",
      gallery: ["https://placehold.co/800x500/blue/FFF?text=Lluvia"],
      description:
        "Aplicación que consume una API externa para mostrar el clima en tiempo real según la geolocalización.",
      repoLink: "#",
      demoLink: "#",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 md:p-10">
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="text-4xl md:text-5xl font-serif text-brand-dark mb-2">
          Mis Proyectos
        </h2>
        <div className="h-1 w-24 bg-brand-primary mx-auto rounded-full"></div>
        <p className="mt-4 text-brand-dark/80 max-w-2xl mx-auto">
          Una colección de soluciones tecnológicas aplicadas a problemas reales.
        </p>
      </div>

      {/* Grid de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="group relative bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            {/* Imagen Cover */}
            <div className="h-56 overflow-hidden">
              <img
                src={project.cover}
                alt={project.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* Contenido Card */}
            <div className="p-6">
              <div className="flex gap-2 mb-3 flex-wrap">
                {project.tech.slice(0, 3).map((t, i) => (
                  <span
                    key={i}
                    className="text-xs font-bold bg-brand-light text-brand-primary px-2 py-1 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl font-serif font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-gray-700 line-clamp-2">
                {project.description}
              </p>

              <div className="mt-4 flex items-center text-brand-primary font-bold text-sm">
                VER DETALLES{" "}
                <span className="ml-2 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETALLE DE PROYECTO */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop oscuro con blur */}
          <div
            className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedProject(null)}
          ></div>

          {/* Contenido del Modal */}
          <div className="relative bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up flex flex-col md:flex-row overflow-hidden">
            {/* Botón Cerrar */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/50 rounded-full hover:bg-red-500 hover:text-white transition-colors"
            >
              <FaTimes size={20} />
            </button>

            {/* Columna Izquierda: Galería */}
            <div className="w-full md:w-1/2 bg-gray-100 h-64 md:h-auto">
              <Swiper
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="h-full w-full"
              >
                {selectedProject.gallery.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      alt={`Slide ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Columna Derecha: Información */}
            <div className="w-full md:w-1/2 p-8 flex flex-col">
              <span className="text-brand-primary font-bold tracking-widest text-sm uppercase mb-2">
                {selectedProject.category}
              </span>
              <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">
                {selectedProject.title}
              </h2>

              <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                {selectedProject.description}
              </p>

              <div className="mb-8">
                <h4 className="font-bold text-brand-dark mb-2 flex items-center gap-2">
                  <FaCode /> Tecnologías:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 bg-brand-light text-brand-dark rounded-full text-sm font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <a
                  href={selectedProject.repoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border border-brand-dark text-brand-dark py-3 rounded-lg hover:bg-brand-dark hover:text-white transition-all"
                >
                  <FaGithub /> Código
                </a>
                <a
                  href={selectedProject.demoLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-white py-3 rounded-lg hover:bg-brand-accent shadow-lg hover:shadow-brand-primary/50 transition-all"
                >
                  <FaExternalLinkAlt /> Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proyectos;
