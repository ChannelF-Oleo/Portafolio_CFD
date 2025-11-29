import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { FaTimes, FaTrash, FaShoppingCart } from "react-icons/fa";
import { PayPalButtons } from "@paypal/react-paypal-js"; // <--- IMPORTAR
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import confetti from "canvas-confetti";

const CartDrawer = () => {
  const {
    cart,
    removeFromCart,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCart();
  const [successMsg, setSuccessMsg] = useState(false);

  // 1. Crear la orden en PayPal
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: "Compra en Portafolio Channel",
          amount: {
            value: totalPrice.toFixed(2), // El total del carrito
          },
        },
      ],
    });
  };

  // 2. Cuando el usuario paga exitosamente
  const onApprove = async (data, actions) => {
    const order = await actions.order.capture();
    console.log("Pago exitoso:", order);

    // Guardar la venta en Firebase
    await saveOrderToFirebase(order);

    // Feedback visual
    setSuccessMsg(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    // Limpiar carrito y cerrar después de 3 segundos
    setTimeout(() => {
      clearCart();
      setSuccessMsg(false);
      setIsCartOpen(false);
    }, 3000);
  };

  // Función auxiliar para guardar en DB
  const saveOrderToFirebase = async (orderDetails) => {
    try {
      await addDoc(collection(db, "orders"), {
        buyerName: orderDetails.payer.name.given_name,
        email: orderDetails.payer.email_address,
        total: totalPrice,
        items: cart,
        date: new Date(),
        paymentId: orderDetails.id,
        status: "paid",
      });
    } catch (error) {
      console.error("Error guardando orden:", error);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-fade-in-left">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-brand-light/30">
          <h2 className="text-2xl font-serif font-bold text-brand-dark flex items-center gap-2">
            <FaShoppingCart /> Tu Carrito
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-500 hover:text-red-500 p-2"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* CONTENIDO */}
        {successMsg ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4 text-4xl">
              ✓
            </div>
            <h3 className="text-2xl font-bold text-brand-dark">
              ¡Pago Exitoso!
            </h3>
            <p className="text-gray-600 mt-2">
              Gracias por tu compra. Recibirás un correo pronto.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <FaShoppingCart size={48} className="opacity-20" />
                  <p>Tu carrito está vacío.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-brand-primary font-bold hover:underline"
                  >
                    Volver a la tienda
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-brand-dark text-sm line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-bold text-brand-primary">
                          ${item.price}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Cant: {item.qty}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 transition p-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer con PayPal */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600">Total Estimado</span>
                  <span className="text-3xl font-bold text-brand-dark font-serif">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* BOTONES DE PAYPAL */}
                <div className="relative z-0">
                  <PayPalButtons
                    style={{ layout: "vertical", shape: "rect", color: "gold" }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={(err) => {
                      console.error("Error PayPal:", err);
                      alert("Hubo un error con el pago.");
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
