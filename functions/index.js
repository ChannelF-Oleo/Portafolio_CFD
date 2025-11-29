const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// LEER CLAVE SECRETA DE LA CONFIGURACIÓN DE FIREBASE
// Si esto falla, asegúrate de haber ejecutado el comando del Paso 2
const stripe = require("stripe")(functions.config().stripe.secret);

exports.createStripeCheckout = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const { items } = req.body;

      // Transformar productos para Stripe
      const lineItems = items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            // Usamos una imagen por defecto si no hay, para evitar errores
            images: item.image ? [item.image] : ["https://placehold.co/400"],
            description:
              item.type === "Digital" ? "Producto Digital" : "Producto Físico",
          },
          unit_amount: Math.round(item.price * 100), // Convertir a centavos
        },
        quantity: item.qty || 1,
      }));

      // Crear sesión de pago
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        // Reemplaza con tu dominio real cuando lo tengas, o deja localhost para pruebas
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/tienda",
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error("Error Stripe:", error);
      res.status(500).json({ error: error.message });
    }
  });
});
