import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; // <--- IMPORTAR

// Páginas y Componentes...
import Home from "./pages/Home";
import Certificaciones from "./pages/Certificaciones";
import Proyectos from "./pages/Proyectos";
import Blog from "./pages/Blog";
import Contacto from "./pages/Contacto";
import Shop from "./pages/Shop";
import Login from "./pages/admin/login";
import Dashboard from "./pages/admin/Dashboard";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/shop/CartDrawer";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && (
        <>
          <Navbar />
          <CartDrawer />
        </>
      )}
      <main className="flex-grow">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  // Configuración inicial de PayPal
  const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, // Lee del .env
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      {" "}
      {/* <--- ENVOLVER TODO */}
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/certificaciones" element={<Certificaciones />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/tienda" element={<Shop />} />
            <Route path="/admin" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;
