import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  Autoplay,
} from "swiper/modules";
import { FaAward, FaUniversity, FaHeart, FaSpinner } from "react-icons/fa";
import { db } from "../lib/firebase"; // Conexión a DB
import { collection, getDocs } from "firebase/firestore"; // Funciones DB

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Certificaciones = () => {
  const [activeCategory, setActiveCategory] = useState("Tecnología");
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar Certificados REALES desde Firebase
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "certificates"));
        const certsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCertificates(certsData);
      } catch (error) {
        console.error("Error cargando certificados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  // Filtrar según la pestaña activa
  const filteredCerts = certificates.filter(
    (c) => c.category === activeCategory
  );

  const categories = [
    { name: "Tecnología", icon: <FaAward /> },
    { name: "Educación", icon: <FaUniversity /> },
    { name: "Habilidades", icon: <FaHeart /> },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 md:p-10 flex flex-col items-center pb-20">
      <div className="text-center mb-10 animate-fade-in-up">
        <h2 className="text-4xl md:text-5xl font-serif text-brand-dark mb-2">
          Mis Credenciales
        </h2>
        <div className="h-1 w-24 bg-brand-primary mx-auto rounded-full"></div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-medium transition-all duration-300 border backdrop-blur-md
              ${
                activeCategory === cat.name
                  ? "bg-brand-primary text-white border-brand-primary shadow-lg scale-105"
                  : "bg-white/30 text-brand-dark border-white/40 hover:bg-white/60"
              }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <FaSpinner className="animate-spin text-4xl text-brand-primary" />
        </div>
      ) : filteredCerts.length === 0 ? (
        <div className="text-center text-gray-500 bg-white/30 p-8 rounded-xl backdrop-blur-sm border border-white/40">
          <p>Aún no he subido certificados en esta categoría.</p>
          <p className="text-sm mt-2">
            (Ve al panel de administrador para agregarlos)
          </p>
        </div>
      ) : (
        <div className="w-full max-w-5xl animate-fade-in-up">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
            className="w-full py-10"
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {filteredCerts.map((cert) => (
              <SwiperSlide key={cert.id} className="max-w-xs sm:max-w-sm">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50 h-[400px] flex flex-col transform transition hover:-translate-y-2">
                  <div className="h-48 w-full rounded-xl overflow-hidden mb-4 shadow-inner bg-gray-100">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-brand-primary uppercase tracking-widest bg-brand-light px-2 py-1 rounded-md">
                        {cert.category}
                      </span>
                      <h3 className="text-xl font-bold text-brand-dark mt-3 font-serif leading-tight">
                        {cert.title}
                      </h3>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-600">
                      <span>Expedido por:</span>
                      <span className="font-semibold text-brand-dark">
                        {cert.issuer}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default Certificaciones;
