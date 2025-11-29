import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Creamos el Contexto
const CartContext = createContext();

// 2. Hook personalizado para usar el carrito fácil (ej: const { cart } = useCart())
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};

// 3. El Proveedor que envuelve la App
export const CartProvider = ({ children }) => {
  // Inicializamos el estado buscando en LocalStorage (para no perder datos al recargar)
  const [cart, setCart] = useState(() => {
    try {
      const localData = localStorage.getItem("portfolioCart");
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error leyendo carrito local:", error);
      return [];
    }
  });

  // Guardamos en LocalStorage cada vez que el carrito cambia
  useEffect(() => {
    localStorage.setItem("portfolioCart", JSON.stringify(cart));
  }, [cart]);

  // Función: Agregar al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      // ¿El producto ya está en el carrito?
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        // Si existe, aumentamos la cantidad
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      } else {
        // Si no existe, lo agregamos con cantidad 1
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
    // Opcional: Podrías poner un toast/alerta pequeña aquí
    // alert("¡Producto agregado!");
  };

  // Función: Eliminar del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Función: Limpiar todo (útil después de comprar)
  const clearCart = () => setCart([]);

  // Cálculos automáticos
  const totalItems = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  // Valores que compartimos con toda la app
  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
