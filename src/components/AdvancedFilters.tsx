"use client";

import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

type AdvancedFiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  valoresIniciales: {
    especie: string[];
    estado: string[];
    genero: string[];
  };
  onAplicar: (filtros: {
    especie: string[];
    estado: string[];
    genero: string[];
  }) => void;
};

export const AdvancedFiltersModal = ({
  isOpen,
  onClose,
  valoresIniciales,
  onAplicar,
}: AdvancedFiltersModalProps) => {
  const [filtros, setFiltros] = useState(valoresIniciales);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFiltros(valoresIniciales);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, valoresIniciales]);

  const toggle = (tipo: keyof typeof filtros, valor: string) => {
    const actual = filtros[tipo];
    const actualizado = actual.includes(valor)
      ? actual.filter((v) => v !== valor)
      : [...actual, valor];

    setFiltros({ ...filtros, [tipo]: actualizado });
  };

  const renderChips = (tipo: keyof typeof filtros, opciones: string[]) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {opciones.map((opcion) => {
        const activo = filtros[tipo].includes(opcion);
        return (
          <button
            key={opcion}
            onClick={() => toggle(tipo, opcion)}
            className={`px-4 py-1.5 rounded-full border text-sm font-medium
              transform transition-all duration-300 ease-in-out
              hover:scale-105 hover:shadow-lg
              active:scale-95
              ${
                activo
                  ? "bg-[#8BC547] text-[#354E18] border-[#8BC547] shadow-md hover:shadow-[#8BC547]/50"
                  : "border-gray-300 text-gray-700 hover:border-[#8BC547] hover:bg-[#8BC547]/10"
              }`}
          >
            {opcion}
          </button>
        );
      })}
    </div>
  );

  if (!isOpen) return null;

  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-50 bg-black flex sm:items-center justify-center sm:px-0
        transition-all duration-300 ease-in-out
        ${isAnimating ? "bg-opacity-60" : "bg-opacity-0"}
      `}
    >
      <div
        className={`bg-white sm:rounded-xl w-full sm:max-w-[600px] relative shadow-2xl 
          min-h-[100vh] sm:min-h-0 sm:max-h-[90vh] overflow-y-auto p-6
          transition-all duration-300 ease-out
          ${
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }
        `}
      >
        <button
          onClick={onClose}
          className="flex bg-white p-2 rounded-full absolute top-4 right-4 text-gray-500 
            hover:text-gray-700 hover:bg-gray-100 active:scale-90
            transition-all duration-200 ease-in-out z-10 shadow-sm hover:shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg text-center sm:text-start font-semibold text-gray-800 mb-8">
          Filtros avanzados
        </h2>

        <div
          className="mb-6 sm:mb-4 text-md animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          <h3 className="font-semibold text-sm text-gray-800 mb-1">Especie</h3>
          {renderChips("especie", ["Humano", "Alienígena", "Humanoide"])}
        </div>

        <div
          className="mb-6 sm:mb-4 animate-fadeIn"
          style={{ animationDelay: "0.2s" }}
        >
          <h3 className="font-semibold text-sm text-gray-800 mb-1">Género</h3>
          {renderChips("genero", ["Masculino", "Femenino", "Desconocido"])}
        </div>

        <div
          className="mb-8 sm:mb-6 animate-fadeIn"
          style={{ animationDelay: "0.3s" }}
        >
          <h3 className="font-semibold text-sm text-gray-800 mb-1">Estado</h3>
          {renderChips("estado", ["Vivo", "Muerto", "Desconocido"])}
        </div>

        <div
          className="flex justify-center sm:justify-end border-t-2 border-gray-100 animate-fadeIn"
          style={{ animationDelay: "0.4s" }}
        >
          <button
            onClick={() => onAplicar(filtros)}
            className="mt-6 sm:mt-4 w-11/12 sm:w-auto bg-[#8BC547] text-[#354E18] 
              px-8 py-2.5 rounded-full font-semibold 
              hover:bg-[#7ab536] hover:shadow-lg hover:shadow-[#8BC547]/40
              active:scale-95
              transform transition-all duration-300 ease-in-out"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
