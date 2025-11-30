import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  FaEnvelopeOpenText,
  FaCheck,
  FaTrash,
  FaTimes,
  FaEnvelope,
  FaFilter,
  FaSpinner,
} from "react-icons/fa";

const Inbox = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' | 'unread'

  // 1. Escuchar mensajes en TIEMPO REAL (onSnapshot)
  // Esto hace que si te llega un mensaje nuevo, aparezca solo sin recargar.
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("date", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        console.error("Error leyendo inbox:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Función: Marcar como Leído
  const handleMarkAsRead = async (id) => {
    try {
      const msgRef = doc(db, "messages", id);
      await updateDoc(msgRef, { read: true });
      // No necesitamos actualizar el estado manual porque onSnapshot lo hace solo
    } catch (error) {
      console.error("Error al marcar leído:", error);
      alert("Error: No se pudo actualizar el estado.");
    }
  };

  // Función: Eliminar
  const handleDelete = async (id) => {
    if (!window.confirm("¿Segura que quieres borrar este mensaje?")) return;
    try {
      await deleteDoc(doc(db, "messages", id));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Filtrado
  const filteredMessages =
    filter === "unread" ? messages.filter((m) => !m.read) : messages;

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-full flex flex-col animate-fade-in-up">
      {/* HEADER DE LA BANDEJA */}
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
            <FaEnvelopeOpenText className="text-brand-primary" /> Bandeja de
            Entrada
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Tienes{" "}
            <span className="font-bold text-brand-dark">{unreadCount}</span>{" "}
            mensajes sin leer
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-full transition"
        >
          <FaTimes size={20} className="text-gray-500" />
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex gap-4 p-4 border-b border-gray-100 bg-white">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 ${
            filter === "all"
              ? "bg-brand-dark text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FaFilter size={12} /> Todos
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 ${
            filter === "unread"
              ? "bg-brand-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <FaEnvelope size={12} /> No Leídos ({unreadCount})
        </button>
      </div>

      {/* LISTA DE MENSAJES */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center p-10">
            <FaSpinner className="animate-spin text-2xl text-brand-primary" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-20 text-gray-400 flex flex-col items-center">
            <FaEnvelopeOpenText size={48} className="mb-4 opacity-20" />
            <p>No hay mensajes en esta vista.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`relative p-5 rounded-xl border transition-all duration-200 group
                        ${
                          msg.read
                            ? "bg-gray-100 border-gray-200 opacity-70 hover:opacity-100"
                            : "bg-white border-brand-primary/30 shadow-md border-l-4 border-l-brand-primary"
                        }
                    `}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
                  )}
                  <span
                    className={`font-bold text-lg ${
                      msg.read ? "text-gray-600" : "text-brand-dark"
                    }`}
                  >
                    {msg.name}
                  </span>
                </div>
                <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                  {msg.date?.toDate
                    ? msg.date.toDate().toLocaleDateString()
                    : "Fecha desc."}
                </span>
              </div>

              <a
                href={`mailto:${msg.email}`}
                className="text-sm text-brand-primary font-medium hover:underline block mb-3"
              >
                {msg.email}
              </a>

              <div
                className={`p-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.read
                    ? "bg-gray-200 text-gray-600"
                    : "bg-brand-light/20 text-gray-800 border border-brand-light"
                }`}
              >
                {msg.message}
              </div>

              {/* BARRA DE ACCIONES */}
              <div className="flex justify-end gap-3 mt-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                {!msg.read && (
                  <button
                    onClick={() => handleMarkAsRead(msg.id)}
                    className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-2 rounded-full hover:bg-green-100 transition"
                  >
                    <FaCheck /> Marcar Leído
                  </button>
                )}
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-full hover:bg-red-100 transition"
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;
