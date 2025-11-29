import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { db } from "../lib/firebase"; // DB
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore"; // Funciones DB
import { FaShoppingCart, FaStar, FaTimes, FaComment } from "react-icons/fa";

const Shop = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Para el Modal

  // 1. Cargar productos REALES de Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      setProducts(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 md:p-10 pb-24">
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="text-4xl md:text-5xl font-serif text-brand-dark mb-2">
          Tienda & Recursos
        </h2>
        <div className="h-1 w-24 bg-brand-primary mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
          >
            <div className="absolute top-6 left-6 z-10 bg-brand-dark text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              {product.type}
            </div>

            {/* Click en imagen abre Modal */}
            <div
              onClick={() => setSelectedProduct(product)}
              className="h-64 overflow-hidden rounded-xl mb-6 relative cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <h3 className="text-xl font-bold font-serif text-brand-dark">
                {product.title}
              </h3>
              <p className="text-sm text-gray-700 mb-6 flex-grow line-clamp-2">
                {product.description}
              </p>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/30">
                <span className="text-2xl font-bold text-brand-primary">
                  ${product.price}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Evitar abrir modal
                    addToCart(product);
                  }}
                  className="bg-brand-dark text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-brand-primary transition-all flex items-center gap-2 active:scale-95"
                >
                  <FaShoppingCart size={14} /> Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE DETALLE Y RESEÑAS */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart}
        />
      )}
    </div>
  );
};

// COMPONENTE INTERNO: EL MODAL CON RESEÑAS
const ProductModal = ({ product, onClose, addToCart }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [localProduct, setLocalProduct] = useState(product); // Para actualizar reseñas en vivo

  const handleAddReview = async (e) => {
    e.preventDefault();
    const newReview = {
      user: "Visitante", // Idealmente el nombre del usuario logueado
      text: reviewText,
      rating: rating,
      date: new Date().toLocaleDateString(),
    };

    // Guardar en Firebase
    const productRef = doc(db, "products", product.id);
    await updateDoc(productRef, {
      reviews: arrayUnion(newReview),
    });

    // Actualizar vista local
    setLocalProduct((prev) => ({
      ...prev,
      reviews: [...(prev.reviews || []), newReview],
    }));
    setReviewText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in-up">
        {/* Columna Imagen */}
        <div className="w-full md:w-1/2 bg-gray-100 h-64 md:h-auto relative">
          <img
            src={localProduct.image}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 md:hidden bg-white/50 p-2 rounded-full"
          >
            <FaTimes />
          </button>
        </div>

        {/* Columna Info */}
        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 hidden md:block text-gray-400 hover:text-red-500"
          >
            <FaTimes size={24} />
          </button>

          <span className="text-brand-primary font-bold text-sm uppercase tracking-wider mb-2">
            {localProduct.type}
          </span>
          <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">
            {localProduct.title}
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {localProduct.description}
          </p>

          <div className="flex items-center justify-between mb-8 p-4 bg-brand-light/30 rounded-xl">
            <span className="text-3xl font-bold text-brand-primary">
              ${localProduct.price}
            </span>
            <button
              onClick={() => addToCart(localProduct)}
              className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold hover:bg-brand-primary transition shadow-lg"
            >
              Agregar al Carrito
            </button>
          </div>

          {/* Sección Reseñas */}
          <div className="border-t pt-6 mt-auto">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FaStar className="text-yellow-500" /> Reseñas (
              {localProduct.reviews?.length || 0})
            </h3>

            {/* Lista de Reseñas */}
            <div className="max-h-40 overflow-y-auto space-y-3 mb-4 pr-2">
              {localProduct.reviews &&
                localProduct.reviews.map((rev, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm">
                    <div className="flex justify-between font-bold text-brand-dark">
                      <span>{rev.user}</span>
                      <span className="text-yellow-500 flex">
                        {[...Array(parseInt(rev.rating))].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{rev.text}</p>
                  </div>
                ))}
              {(!localProduct.reviews || localProduct.reviews.length === 0) && (
                <p className="text-gray-400 text-sm">
                  Sé el primero en opinar.
                </p>
              )}
            </div>

            {/* Formulario Agregar Reseña */}
            <form onSubmit={handleAddReview} className="flex gap-2">
              <input
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                placeholder="Escribe tu opinión..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-brand-primary"
              />
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border rounded-lg px-2 bg-white"
              >
                <option value="5">5★</option>
                <option value="4">4★</option>
                <option value="3">3★</option>
              </select>
              <button
                type="submit"
                className="bg-brand-primary text-white p-2 rounded-lg hover:bg-brand-accent"
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

export default Shop;
