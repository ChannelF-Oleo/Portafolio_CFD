import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase"; // Conexión a DB
import { collection, getDocs, orderBy, query } from "firebase/firestore"; // Funciones DB
import {
  FaGithub,
  FaExternalLinkAlt,
  FaTimes,
  FaCode,
  FaSpinner,
  FaEye,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

// Estilos de Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Proyectos = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Cargar Proyectos desde Firebase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Intentamos ordenar por fecha (si existe el índice)
        const q = query(
          collection(db, "projects"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        const projectsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectsData);
      } catch (error) {
        console.error(
          "Error cargando proyectos (posible falta de índice, cargando sin orden):",
          error
        );
        // Fallback: Carga simple si falla el ordenamiento
        const querySnapshot = await getDocs(collection(db, "projects"));
        setProjects(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Función auxiliar para obtener las imágenes del modal
  const getGallery = (project) => {
    // Si tiene galería extra, úsala. Si no, usa la imagen principal.
    if (project.gallery && project.gallery.length > 0) return project.gallery;
    return [project.image];
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 md:p-10 pb-20">
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="text-4xl md:text-5xl font-serif text-brand-dark mb-2">
          Mis Proyectos
        </h2>
        <div className="h-1 w-24 bg-brand-primary mx-auto rounded-full"></div>
        <p className="mt-4 text-brand-dark/80 max-w-2xl mx-auto">
          Una colección de soluciones tecnológicas aplicadas a problemas reales.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-brand-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white/30 backdrop-blur-sm rounded-xl border border-white/40">
          <p>Aún no hay proyectos publicados.</p>
          <p className="text-sm mt-2">(Súbelos desde el Panel de Admin)</p>
        </div>
      ) : (
        /* Grid de Tarjetas */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group relative bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              {/* Imagen Cover */}
              <div className="h-56 overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <span className="text-white border border-white px-4 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                    <FaEye /> Ver Detalles
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex gap-2 mb-3 flex-wrap">
                  {/* Tags de tecnología (máx 3) */}
                  {project.tech &&
                    project.tech.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold bg-white/80 text-brand-primary px-2 py-1 rounded-md shadow-sm border border-brand-light"
                      >
                        {t}
                      </span>
                    ))}
                  {project.tech && project.tech.length > 3 && (
                    <span className="text-[10px] text-gray-500 px-1 py-1">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-700 line-clamp-2 mb-4 flex-grow">
                  {project.description}
                </p>

                <div className="mt-auto pt-4 border-t border-white/30 flex items-center justify-between text-brand-primary font-bold text-xs uppercase tracking-wider">
                  <span>{project.category}</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    Ver Proyecto →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL INTEGRADO --- */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedProject(null)}
          ></div>

          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in-up">
            {/* Botón Cerrar (Móvil) */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 md:hidden bg-white/80 p-2 rounded-full text-brand-dark shadow-sm"
            >
              <FaTimes />
            </button>

            {/* IZQUIERDA: Galería Swiper */}
            <div className="w-full md:w-3/5 bg-gray-100 relative h-64 md:h-auto group">
              <Swiper
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation={true}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                modules={[Pagination, Navigation, Autoplay]}
                className="h-full w-full"
              >
                {getGallery(selectedProject).map((img, idx) => (
                  <SwiperSlide
                    key={idx}
                    className="flex items-center justify-center bg-gray-900"
                  >
                    <img
                      src={img}
                      alt={`Vista ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* DERECHA: Detalles */}
            <div className="w-full md:w-2/5 p-8 flex flex-col bg-white">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 hidden md:block text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaTimes size={24} />
              </button>

              <span className="text-brand-primary font-bold tracking-widest text-xs uppercase mb-2 bg-brand-light inline-block px-2 py-1 rounded w-fit">
                {selectedProject.category}
              </span>

              <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4 leading-tight">
                {selectedProject.title}
              </h2>

              <div className="mb-6 flex-grow overflow-y-auto max-h-60 pr-2 custom-scrollbar">
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                  {selectedProject.description}
                </p>
              </div>

              <div className="mb-8">
                <h4 className="font-bold text-brand-dark mb-3 flex items-center gap-2 text-sm">
                  <FaCode className="text-brand-primary" /> Tecnologías:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech &&
                    selectedProject.tech.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-brand-dark rounded-full text-xs font-semibold border border-gray-200"
                      >
                        {t}
                      </span>
                    ))}
                </div>
              </div>

              <div className="flex gap-4 mt-auto pt-4 border-t border-gray-100">
                {selectedProject.repoLink && (
                  <a
                    href={selectedProject.repoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 border border-brand-dark text-brand-dark py-3 rounded-xl hover:bg-brand-dark hover:text-white transition-all font-bold text-sm"
                  >
                    <FaGithub /> Código
                  </a>
                )}

                {selectedProject.demoLink && (
                  <a
                    href={selectedProject.demoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-white py-3 rounded-xl hover:bg-brand-accent shadow-lg hover:shadow-brand-primary/50 transition-all font-bold text-sm"
                  >
                    <FaExternalLinkAlt /> Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proyectos;
