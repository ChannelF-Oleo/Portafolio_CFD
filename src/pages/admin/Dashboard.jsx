import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../lib/firebase";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import { uploadFile } from "../../lib/storage";
import Inbox from "./Inbox";

import {
  FaPlus,
  FaSignOutAlt,
  FaInbox,
  FaTimes,
  FaSpinner,
  FaCertificate,
  FaProjectDiagram,
  FaShoppingBag,
  FaPenNib,
  FaImages,
  FaFileDownload,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [formType, setFormType] = useState("products");
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Estados del Formulario
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    issuer: "",
    type: "",
    tech: "",
    repoLink: "",
    demoLink: "",
    content: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [digitalFile, setDigitalFile] = useState(null);

  useEffect(() => {
    // 1. Verificar Admin
    if (!localStorage.getItem("isAdmin")) navigate("/admin");

    // 2. Listener para el contador de notificaciones (Badge rojo)
    // Escuchamos solo para saber cuántos no leídos hay y mostrarlo en el menú
    const q = query(collection(db, "messages"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const count = snapshot.docs.filter((doc) => !doc.data().read).length;
      setUnreadCount(count);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Subir Imagen Principal
      let mainImageUrl = "";
      if (mainImage) {
        mainImageUrl = await uploadFile(mainImage, formType);
      } else {
        alert("La imagen de portada es obligatoria");
        setLoading(false);
        return;
      }

      // 2. Subir Archivo Digital (si aplica)
      let digitalDownloadUrl = "";
      if (formType === "products" && formData.type === "Digital") {
        if (digitalFile)
          digitalDownloadUrl = await uploadFile(
            digitalFile,
            "digital_products"
          );
        else {
          alert("Falta archivo digital");
          setLoading(false);
          return;
        }
      }

      // 3. Subir Galería Extra
      let galleryUrls = [];
      if (galleryFiles.length > 0) {
        const uploadPromises = Array.from(galleryFiles).map((file) =>
          uploadFile(file, `${formType}_gallery`)
        );
        galleryUrls = await Promise.all(uploadPromises);
      }

      // 4. Preparar Datos
      let dataToSave = {
        title: formData.title,
        image: mainImageUrl,
        createdAt: new Date(),
      };

      if (formType === "certificates") {
        dataToSave.issuer = formData.issuer;
        dataToSave.category = formData.category;
      } else if (formType === "projects") {
        dataToSave.category = formData.category;
        dataToSave.description = formData.description;
        dataToSave.tech = formData.tech.split(",").map((t) => t.trim());
        dataToSave.repoLink = formData.repoLink;
        dataToSave.demoLink = formData.demoLink;
        dataToSave.gallery = galleryUrls;
      } else if (formType === "products") {
        dataToSave.price = parseFloat(formData.price);
        dataToSave.category = formData.category;
        dataToSave.description = formData.description;
        dataToSave.type = formData.type;
        dataToSave.gallery = galleryUrls;
        dataToSave.reviews = [];
        if (formData.type === "Digital")
          dataToSave.fileUrl = digitalDownloadUrl;
      } else if (formType === "posts") {
        dataToSave.category = formData.category;
        dataToSave.content = formData.content;
        dataToSave.description = formData.description;
        dataToSave.likes = 0;
        dataToSave.comments = [];
      }

      // 5. Guardar en Firestore
      await addDoc(collection(db, formType), dataToSave);
      alert(`${formType} agregado con éxito!`);

      // 6. Resetear Formulario
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        issuer: "",
        type: "",
        tech: "",
        repoLink: "",
        demoLink: "",
        content: "",
      });
      setMainImage(null);
      setGalleryFiles([]);
      setDigitalFile(null);
      setActiveTab("overview");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 bg-white p-5 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-gray-800">
          Panel de Administración
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition relative ${
              activeTab === "inbox"
                ? "bg-brand-primary text-white"
                : "bg-brand-light/30 text-brand-primary hover:bg-brand-light"
            }`}
          >
            <FaInbox /> Mensajes
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-bold px-4 py-2 hover:bg-red-50 rounded-full transition"
          >
            <FaSignOutAlt /> Salir
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* VISTA 1: OVERVIEW (Botones) */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
            {["certificates", "projects", "products", "posts"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setFormType(type);
                  setActiveTab("create");
                }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center group"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition text-brand-primary">
                  {type === "certificates" && <FaCertificate size={28} />}
                  {type === "projects" && <FaProjectDiagram size={28} />}
                  {type === "products" && <FaShoppingBag size={28} />}
                  {type === "posts" && <FaPenNib size={28} />}
                </div>
                <span className="font-bold text-gray-700 capitalize">
                  Nuevo {type.slice(0, -1)}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* VISTA 2: INBOX (Componente Separado) */}
        {activeTab === "inbox" && (
          <div className="h-[80vh]">
            <Inbox onClose={() => setActiveTab("overview")} />
          </div>
        )}

        {/* VISTA 3: FORMULARIO DE CREACIÓN */}
        {activeTab === "create" && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl animate-fade-in-up border border-gray-100">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-serif font-bold text-brand-dark capitalize">
                Agregar {formType}
              </h2>
              <button
                onClick={() => setActiveTab("overview")}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título (Común) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Título / Nombre
                </label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border p-3 rounded-lg bg-gray-50 focus:outline-brand-primary"
                />
              </div>

              {/* Campos: Certificados */}
              {formType === "certificates" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Institución
                    </label>
                    <input
                      required
                      value={formData.issuer}
                      onChange={(e) =>
                        setFormData({ ...formData, issuer: e.target.value })
                      }
                      className="w-full border p-3 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full border p-3 rounded-lg bg-gray-50"
                    >
                      <option value="">Selecciona...</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Educación">Educación</option>
                      <option value="Habilidades">Habilidades</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Campos: Productos */}
              {formType === "products" && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Precio ($)
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full border p-3 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Tipo
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full border p-3 rounded-lg bg-gray-50"
                      >
                        <option value="Digital">Digital</option>
                        <option value="Fisico">Físico</option>
                        <option value="Servicio">Servicio</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Categoría
                      </label>
                      <input
                        required
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full border p-3 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                  {formData.type === "Digital" && (
                    <div className="bg-purple-50 p-4 rounded-xl border border-dashed border-purple-300">
                      <label className="block text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                        <FaFileDownload /> Archivo Digital (PDF, Zip) *
                      </label>
                      <input
                        required
                        type="file"
                        onChange={(e) => setDigitalFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Campos: Proyectos y Posts */}
              {formType !== "certificates" && formType !== "products" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Categoría
                  </label>
                  {formType === "posts" ? (
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full border p-3 rounded-lg bg-gray-50"
                    >
                      <option value="">Selecciona...</option>
                      <option value="Poemas">Poemas</option>
                      <option value="Cuentos">Cuentos</option>
                      <option value="Reflexiones">Reflexiones</option>
                      <option value="Tecnología">Tecnología</option>
                    </select>
                  ) : (
                    <input
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full border p-3 rounded-lg bg-gray-50"
                    />
                  )}
                </div>
              )}

              {formType === "projects" && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Tecnologías
                    </label>
                    <input
                      value={formData.tech}
                      onChange={(e) =>
                        setFormData({ ...formData, tech: e.target.value })
                      }
                      className="w-full border p-3 rounded-lg bg-gray-50"
                      placeholder="React, Firebase, Tailwind"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="Link Repo"
                      value={formData.repoLink}
                      onChange={(e) =>
                        setFormData({ ...formData, repoLink: e.target.value })
                      }
                      className="border p-3 rounded-lg bg-gray-50 w-full"
                    />
                    <input
                      placeholder="Link Demo"
                      value={formData.demoLink}
                      onChange={(e) =>
                        setFormData({ ...formData, demoLink: e.target.value })
                      }
                      className="border p-3 rounded-lg bg-gray-50 w-full"
                    />
                  </div>
                </>
              )}

              {/* Descripción / Contenido */}
              {formType === "posts" ? (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Contenido (HTML)
                  </label>
                  <textarea
                    rows="6"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full border p-3 rounded-lg bg-gray-50 font-mono text-sm"
                  ></textarea>
                </div>
              ) : (
                formType !== "certificates" && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full border p-3 rounded-lg bg-gray-50"
                    ></textarea>
                  </div>
                )
              )}

              {/* Imágenes */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {formType === "certificates"
                      ? "Imagen del Certificado"
                      : "Imagen Principal"}{" "}
                    *
                  </label>
                  <input
                    required
                    type="file"
                    onChange={(e) => setMainImage(e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand-primary file:text-white hover:file:bg-brand-accent cursor-pointer"
                  />
                </div>
                {(formType === "projects" || formType === "products") && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-dashed border-blue-300">
                    <label className="block text-sm font-bold text-brand-dark mb-2 flex items-center gap-2">
                      <FaImages /> Galería Extra
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setGalleryFiles(e.target.files)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-brand-dark text-white font-bold py-4 rounded-xl hover:bg-brand-primary transition shadow-lg flex justify-center items-center gap-2"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <>
                    <FaPlus /> Guardar Todo
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
