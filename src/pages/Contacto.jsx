import React, { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaLinkedinIn,
  FaGithub,
  FaPaperPlane,
  FaWhatsapp,
} from "react-icons/fa";
import confetti from "canvas-confetti";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        date: new Date(),
      });
      setStatus("success");
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error(error);
      alert("Error al enviar. Inténtalo de nuevo.");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 md:p-10">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 md:gap-16 items-start">
        {/* COLUMNA IZQUIERDA: EL TEXTO PERSUASIVO RECUPERADO */}
        <div className="w-full md:w-1/2 animate-fade-in-up">
          <h2 className="text-5xl md:text-6xl font-serif text-brand-dark mb-6">
            Creemos algo{" "}
            <span className="text-brand-primary italic">inolvidable</span>.
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Ya sea que necesites una aplicación web robusta, una identidad
            digital única o contenido literario que conecte con tu audiencia,
            estoy lista para aportar valor a tu proyecto.
          </p>
          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-brand-primary shadow-sm">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h4 className="font-bold text-brand-dark">Ubicación</h4>
                <p className="text-gray-600">Santo Domingo, Rep. Dom.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center text-brand-primary shadow-sm">
                <FaEnvelope size={20} />
              </div>
              <div>
                <h4 className="font-bold text-brand-dark">
                  Correo Electrónico
                </h4>
                <p className="text-gray-600">ChannelF.oleo@gmail.com</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            {/* Redes Sociales */}
            <a
              href="www.linkedin.com/in/channel-feliz-de-oleo-86a12537b"
              className="w-10 h-10 rounded-full bg-brand-dark text-white flex items-center justify-center hover:bg-brand-primary transition transform hover:scale-110"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://github.com/ChannelF-Oleo"
              className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-black transition transform hover:scale-110"
            >
              <FaGithub />
            </a>
            <a
              href="https://wa.me/18094202288?"
              className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition transform hover:scale-110"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* COLUMNA DERECHA: EL FORMULARIO FUNCIONAL */}
        <div
          className="w-full md:w-1/2 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white/30 backdrop-blur-lg border border-white/50 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            {/* Decoración */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/20 rounded-full blur-xl"></div>

            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-brand-dark font-bold mb-2 ml-1 text-sm uppercase tracking-wide">
                  Tu Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition placeholder-gray-400"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-brand-dark font-bold mb-2 ml-1 text-sm uppercase tracking-wide">
                  Tu Correo
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition placeholder-gray-400"
                  placeholder="juan@gmail.com"
                />
              </div>
              <div>
                <label className="block text-brand-dark font-bold mb-2 ml-1 text-sm uppercase tracking-wide">
                  Mensaje
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-white/60 border border-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition resize-none"
                  placeholder="Cuéntame tu idea..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={status === "sending" || status === "success"}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  status === "success"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-brand-dark hover:bg-brand-primary"
                } ${status === "sending" ? "opacity-70 cursor-wait" : ""}`}
              >
                {status === "sending" ? (
                  "Enviando..."
                ) : status === "success" ? (
                  "¡Mensaje Enviado!"
                ) : (
                  <>
                    Enviar Mensaje <FaPaperPlane />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Contacto;
