import React, { useState } from "react";
import { FaTimes, FaStar, FaPaperPlane } from "react-icons/fa";
import { db } from "../../lib/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const ProductModal = ({ product, onClose, onAddToCart }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [localProduct, setLocalProduct] = useState(product);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    const newReview = {
      user: "Visitante", // Aquí podrías poner el nombre del usuario real si hay Login
      text: reviewText,
      rating: parseInt(rating),
      date: new Date().toLocaleDateString(),
    };

    try {
      // 1. Guardar en Firebase
      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, {
        reviews: arrayUnion(newReview),
      });

      // 2. Actualizar visualmente al instante
      setLocalProduct((prev) => ({
        ...prev,
        reviews: [...(prev.reviews || []), newReview],
      }));
      setReviewText("");
    } catch (error) {
      console.error("Error al publicar reseña:", error);
      alert("No se pudo guardar la reseña. Verifica tu conexión.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Fondo Oscuro */}
      <div
        className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Contenido del Modal */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in-up">
        {/* Columna Izquierda: Imagen */}
        <div className="w-full md:w-1/2 bg-gray-100 h-64 md:h-auto relative">
          <img
            src={localProduct.image}
            alt={localProduct.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 md:hidden bg-white/50 p-2 rounded-full shadow-sm"
          >
            <FaTimes />
          </button>
        </div>

        {/* Columna Derecha: Info */}
        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hidden md:block text-gray-400 hover:text-red-500 transition-colors"
          >
            <FaTimes size={24} />
          </button>

          <span className="text-brand-primary font-bold text-sm uppercase tracking-wider mb-2">
            {localProduct.type}
          </span>
          <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">
            {localProduct.title}
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
            {localProduct.description}
          </p>

          {/* Botón de Acción Principal */}
          <div className="flex items-center justify-between mb-8 p-4 bg-brand-light/30 rounded-xl border border-brand-primary/10">
            <span className="text-3xl font-bold text-brand-primary">
              ${localProduct.price}
            </span>
            <button
              onClick={() => {
                onAddToCart(localProduct);
                // Opcional: Cerrar modal al añadir
                // onClose();
              }}
              className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold hover:bg-brand-primary transition shadow-lg active:scale-95 transform duration-150"
            >
              Agregar al Carrito
            </button>
          </div>

          {/* Sección de Reseñas */}
          <div className="border-t pt-6 mt-auto">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-brand-dark">
              <FaStar className="text-yellow-500" />
              Reseñas ({localProduct.reviews?.length || 0})
            </h3>

            {/* Lista Scrollable */}
            <div className="max-h-40 overflow-y-auto space-y-3 mb-4 pr-2 custom-scrollbar">
              {localProduct.reviews && localProduct.reviews.length > 0 ? (
                localProduct.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-100"
                  >
                    <div className="flex justify-between font-bold text-brand-dark mb-1">
                      <span>{rev.user}</span>
                      <span className="text-yellow-500 flex text-xs">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={i < rev.rating ? "" : "text-gray-300"}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="text-gray-600">{rev.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">
                  Sé la primera persona en dejar una opinión.
                </p>
              )}
            </div>

            {/* Input Reseña */}
            <form onSubmit={handleAddReview} className="flex gap-2">
              <input
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                placeholder="Escribe tu opinión..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-gray-50"
              />
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border rounded-lg px-2 bg-white text-sm focus:outline-brand-primary"
              >
                <option value="5">5★</option>
                <option value="4">4★</option>
                <option value="3">3★</option>
              </select>
              <button
                type="submit"
                className="bg-brand-primary text-white p-2 rounded-lg hover:bg-brand-accent transition shadow-md"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
