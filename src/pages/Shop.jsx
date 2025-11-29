import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaShoppingCart, FaStar, FaEye } from "react-icons/fa";

// Importamos los componentes nuevos
import ProductModal from "../components/shop/ProductModal";
// CartDrawer lo pondremos en App.jsx para que sea global,
// o lo podemos dejar aquí si solo quieres carrito en la tienda.

const Shop = () => {
  const { addToCart, setIsCartOpen } = useCart(); // setIsCartOpen para abrir carrito al comprar
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        setProducts(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setIsCartOpen(true); // ¡Abrir carrito automáticamente para feedback visual!
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 md:p-10 pb-24">
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="text-4xl md:text-5xl font-serif text-brand-dark mb-2">
          Tienda & Recursos
        </h2>
        <div className="h-1 w-24 bg-brand-primary mx-auto rounded-full"></div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 mt-20">
          Cargando productos...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)} // Click en la tarjeta abre Modal
              className="group relative bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col cursor-pointer"
            >
              {/* Badge Tipo */}
              <div className="absolute top-6 left-6 z-10 bg-brand-dark/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.type}
              </div>

              {/* Imagen */}
              <div className="h-64 overflow-hidden rounded-xl mb-6 relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                />
                {/* Overlay "Ver Detalles" */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 text-brand-dark px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                    <FaEye /> Ver Detalles
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold font-serif text-brand-dark leading-tight group-hover:text-brand-primary transition-colors">
                    {product.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-700 mb-6 flex-grow line-clamp-2">
                  {product.description}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/30">
                  <span className="text-2xl font-bold text-brand-primary">
                    ${product.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ¡IMPORTANTE! Evita que se abra el modal al dar click en el botón
                      handleAddToCart(product);
                    }}
                    className="bg-brand-dark text-white px-5 py-2 rounded-full font-bold shadow-lg hover:bg-brand-primary transition-all flex items-center gap-2 active:scale-95 z-20"
                  >
                    <FaShoppingCart size={14} /> Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Renderizamos el Modal separado */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default Shop;
