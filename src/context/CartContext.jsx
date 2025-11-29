import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Creamos el Contexto
const CartContext = createContext();

// 2. Hook personalizado
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

// 3. El Proveedor
export const CartProvider = ({ children }) => {
  // Estado del Carrito (Productos)
  const [cart, setCart] = useState(() => {
    try {
      const localData = localStorage.getItem("portfolioCart");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error leyendo carrito local:", error);
      return [];
    }
  });

  // --- ESTO ES LO QUE TE FALTA ---
  // Estado para abrir/cerrar el carrito visualmente
  const [isCartOpen, setIsCartOpen] = useState(false);
  // ------------------------------

  // Guardar en LocalStorage
  useEffect(() => {
    localStorage.setItem("portfolioCart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
    // Al agregar, ordenamos que se abra el carrito
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  // Valores compartidos (Asegúrate de incluir isCartOpen y setIsCartOpen aquí)
  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen, // <--- IMPORTANTE: Exportar el estado
    setIsCartOpen, // <--- IMPORTANTE: Exportar la función
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
