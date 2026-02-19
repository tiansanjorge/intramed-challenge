"use client";

import { X, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex sm:items-center justify-center sm:px-0 overflow-hidden
        transition-all duration-500 ease-out
      `}
    >
      {/* Backdrop con blur y efecto animado */}
      <div
        className={`absolute inset-0 transition-all duration-500 ease-out
          ${isAnimating ? "backdrop-blur-md bg-black/75" : "backdrop-blur-none bg-black/0"}
        `}
        onClick={onClose}
      >
        {/* Patrón decorativo de fondo animado */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Patrón de puntos decorativo */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>
      {/* Contenedor del modal con glassmorphism y animaciones mejoradas */}
      <div
        className={`bg-white/95 sm:rounded-2xl w-full sm:max-w-[600px] relative 
          sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] shadow-2xl
          sm:border-2 border-[#B6DA8B]
          min-h-[100vh] sm:min-h-0 sm:max-h-[85vh] overflow-hidden
          transition-all duration-500 ease-out
          ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0 sm:backdrop-blur-xl"
              : "opacity-0 scale-90 translate-y-8"
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar con efecto mejorado */}
        <button
          aria-label="Cerrar modal"
          onClick={onClose}
          className="hidden sm:flex bg-white backdrop-blur-sm p-2 rounded-full absolute top-4 right-4 
            text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:scale-90
            transition-all duration-300 ease-in-out z-10 
            shadow-lg hover:shadow-xl hover:rotate-90
            border border-gray-200 hover:border-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Botón volver en móvil con backdrop */}
        <button
          onClick={onClose}
          className="sm:hidden absolute top-3 left-3 rounded-full w-10 h-10 flex items-center justify-center 
            bg-white/95 backdrop-blur-md shadow-lg z-50
            transform transition-all duration-300 ease-in-out
            hover:bg-white active:scale-90 border border-gray-200"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700 drop-shadow-sm" />
        </button>

        {/* Contenedor interno con scroll */}
        <div className="h-full sm:max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};
