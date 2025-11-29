import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Certificaciones from "./pages/Certificaciones";
import Proyectos from "./pages/Proyectos";
import Blog from "./pages/Blog";
import Contacto from "./pages/Contacto";
import Shop from "./pages/Shop";
import Login from "./pages/admin/login";
import Dashboard from "./pages/admin/Dashboard";

// Layout controla Navbar y Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {" "}
      {/* Flex para empujar footer al fondo */}
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">{children}</main>
      {/* El footer se muestra si NO estamos en admin */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
