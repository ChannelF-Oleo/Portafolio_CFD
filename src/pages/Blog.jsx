import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaHeart,
  FaComment,
  FaTimes,
  FaUserCircle,
  FaPaperPlane,
} from "react-icons/fa";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState(""); // Estado del buscador

  const categories = [
    "Todos",
    "Poemas",
    "Cuentos",
    "Reflexiones",
    "Tecnología",
  ];

  // 1. Cargar Posts Reales de Firebase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Formatear fecha si es Timestamp
          date:
            doc.data().createdAt?.toDate().toLocaleDateString() || "Reciente",
        }));
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (error) {
        console.error("Error cargando blog:", error);
      }
    };
    fetchPosts();
  }, []);

  // 2. Lógica de Filtrado (Categoría + Buscador)
  useEffect(() => {
    let result = posts;

    // Filtro por Categoría
    if (activeCategory !== "Todos") {
      result = result.filter((post) => post.category === activeCategory);
    }

    // Filtro por Buscador
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.description?.toLowerCase().includes(term) ||
          post.content?.toLowerCase().includes(term)
      );
    }

    setFilteredPosts(result);
  }, [activeCategory, searchTerm, posts]);

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 md:p-10">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="text-4xl md:text-5xl font-serif text-brand-dark mb-2">
          Blog & Reflexiones
        </h2>
        <div className="h-1 w-24 bg-brand-primary mx-auto rounded-full mb-6"></div>

        {/* BUSCADOR FUNCIONAL */}
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Buscar títulos, temas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full bg-white/40 border border-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-brand-primary text-brand-dark placeholder-brand-dark/50 shadow-sm transition-all"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-dark/50" />
        </div>
      </div>

      {/* Categorías */}
      <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border
              ${
                activeCategory === cat
                  ? "bg-brand-dark text-white border-brand-dark shadow-lg"
                  : "bg-white/30 text-brand-dark border-white/40 hover:bg-white/60"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-primary uppercase">
                  {post.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center text-xs text-gray-500 mb-3 font-sans">
                  <span>{post.date}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-dark mb-3 leading-tight group-hover:text-brand-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-700 text-sm line-clamp-3 mb-4 font-sans">
                  {post.description}
                </p>

                <div className="flex items-center gap-4 text-gray-500 text-sm border-t border-gray-200/50 pt-4">
                  <span className="flex items-center gap-1 hover:text-red-500 transition">
                    <FaHeart /> {post.likes || 0}
                  </span>
                  <span className="flex items-center gap-1 hover:text-blue-500 transition">
                    <FaComment /> {post.comments?.length || 0}
                  </span>
                  <span className="ml-auto text-brand-dark font-bold text-xs uppercase tracking-wider group-hover:underline">
                    Leer Más
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No se encontraron publicaciones con tu búsqueda.
          </div>
        )}
      </div>

      {/* DRAWER DE LECTURA */}
      {selectedPost && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div
            className="absolute inset-0 bg-brand-dark/30 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedPost(null)}
          ></div>

          <div className="relative w-full md:w-2/3 lg:w-1/2 bg-white h-full shadow-2xl overflow-y-auto animate-fade-in-up md:animate-none">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <FaTimes size={20} />
            </button>

            <div className="h-64 w-full relative">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-8 text-white">
                <span className="bg-brand-primary px-2 py-1 rounded text-xs font-bold uppercase mb-2 inline-block">
                  {selectedPost.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold">
                  {selectedPost.title}
                </h2>
                <p className="text-sm opacity-90 mt-2">{selectedPost.date}</p>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div
                className="prose prose-lg prose-purple text-gray-700 font-serif leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-brand-dark first-letter:mr-3 first-letter:float-left"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              ></div>

              {/* Aquí iría la lógica de comentarios real en el futuro */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
