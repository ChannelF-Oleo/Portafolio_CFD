import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../lib/firebase";
// Agregamos updateDoc, deleteDoc y doc para modificar mensajes
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { uploadFile } from "../../lib/storage";
// Agregamos FaCheck y FaTrash
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
  FaCheck,
  FaTrash,
  FaEnvelopeOpenText,
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [formType, setFormType] = useState("products");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  // Estados del Formulario (Igual que antes)
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
    if (!localStorage.getItem("isAdmin")) navigate("/admin");
    fetchMessages();
  }, [navigate]);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, "messages"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error mensajes", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  // --- NUEVAS FUNCIONES PARA MENSAJES ---
  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation(); // Evitar abrir si tuvieras un click en el div
    try {
      const msgRef = doc(db, "messages", id);
      await updateDoc(msgRef, { read: true });

      // Actualizar estado local para feedback inmediato
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
      );
    } catch (error) {
      console.error("Error al marcar leído:", error);
    }
  };

  const handleDeleteMessage = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("¿Estás segura de eliminar este mensaje?")) return;

    try {
      await deleteDoc(doc(db, "messages", id));
      // Quitar de la lista local
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };
  // --------------------------------------

  const handleSubmit = async (e) => {
    // ... (Mantén tu lógica de envío de formularios igual que antes) ...
    e.preventDefault();
    setLoading(true);
    try {
      let mainImageUrl = "";
      if (mainImage) {
        mainImageUrl = await uploadFile(mainImage, formType);
      } else {
        alert("La imagen de portada es obligatoria");
        setLoading(false);
        return;
      }

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

      let galleryUrls = [];
      if (galleryFiles.length > 0) {
        const uploadPromises = Array.from(galleryFiles).map((file) =>
          uploadFile(file, `${formType}_gallery`)
        );
        galleryUrls = await Promise.all(uploadPromises);
      }

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

      await addDoc(collection(db, formType), dataToSave);
      alert(`${formType} agregado!`);

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

  // Contar mensajes no leídos para el badge
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 bg-white p-5 rounded-2xl shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-gray-800">
          Panel de Administración
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("inbox")}
            className="flex items-center gap-2 text-brand-primary bg-brand-light/30 px-4 py-2 rounded-full font-bold hover:bg-brand-light relative"
          >
            <FaInbox /> Mensajes
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-bold px-4 py-2"
          >
            <FaSignOutAlt /> Salir
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
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

      {/* VISTA BANDEJA MEJORADA */}
      {activeTab === "inbox" && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in-up border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-lg text-gray-700 flex items-center gap-2">
              <FaEnvelopeOpenText /> Bandeja de Entrada
            </h3>
            <button onClick={() => setActiveTab("overview")}>
              <FaTimes />
            </button>
          </div>
          <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
            {messages.length === 0 ? (
              <p className="p-10 text-center text-gray-400">Bandeja vacía.</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-6 transition flex gap-4 ${
                    msg.read
                      ? "bg-gray-50 opacity-60"
                      : "bg-white border-l-4 border-l-brand-primary"
                  }`}
                >
                  {/* Contenido */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span
                        className={`font-bold ${
                          msg.read ? "text-gray-600" : "text-brand-dark"
                        }`}
                      >
                        {msg.name}
                      </span>
                      <span className="text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded">
                        {msg.date?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-sm text-brand-primary font-bold hover:underline mb-2 block w-fit"
                    >
                      {msg.email}
                    </a>
                    <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-100 text-sm whitespace-pre-wrap shadow-sm">
                      {msg.message}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 justify-start mt-1">
                    {!msg.read && (
                      <button
                        onClick={(e) => handleMarkAsRead(msg.id, e)}
                        title="Marcar como leído"
                        className="p-2 text-green-600 hover:bg-green-100 rounded-full transition"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeleteMessage(msg.id, e)}
                      title="Eliminar mensaje"
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VISTA CREATE (Igual que antes) */}
      {activeTab === "create" && (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl animate-fade-in-up border border-gray-100">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-serif font-bold text-brand-dark capitalize">
              Agregar {formType}
            </h2>
            <button
              onClick={() => setActiveTab("overview")}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TITULO */}
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

            {/* CERTIFICADOS */}
            {formType === "certificates" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Institución
                  </label>
                  <input
                    required
                    type="text"
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

            {/* PRODUCTOS */}
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
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full border p-3 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
                {formData.type === "Digital" && (
                  <div className="bg-purple-50 p-4 rounded-xl border border-dashed border-purple-300 relative animate-fade-in-up">
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

            {/* OTROS CAMPOS */}
            {formType !== "certificates" && formType !== "products" && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Categoría
                </label>
                <input
                  required
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border p-3 rounded-lg bg-gray-50"
                />
              </div>
            )}

            {formType === "projects" && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Tecnologías
                  </label>
                  <input
                    type="text"
                    value={formData.tech}
                    onChange={(e) =>
                      setFormData({ ...formData, tech: e.target.value })
                    }
                    className="w-full border p-3 rounded-lg bg-gray-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="Repo URL"
                    value={formData.repoLink}
                    onChange={(e) =>
                      setFormData({ ...formData, repoLink: e.target.value })
                    }
                    className="border p-3 rounded-lg bg-gray-50 w-full"
                  />
                  <input
                    placeholder="Demo URL"
                    value={formData.demoLink}
                    onChange={(e) =>
                      setFormData({ ...formData, demoLink: e.target.value })
                    }
                    className="border p-3 rounded-lg bg-gray-50 w-full"
                  />
                </div>
              </>
            )}

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
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border p-3 rounded-lg bg-gray-50"
                  ></textarea>
                </div>
              )
            )}

            {/* IMÁGENES */}
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
  );
};

export default Dashboard;
