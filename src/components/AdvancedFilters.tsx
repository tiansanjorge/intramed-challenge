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

  useEffect(() => {
    if (isOpen) {
      setFiltros(valoresIniciales);
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
            className={`px-4 py-1 rounded-full border text-sm ${
              activo
                ? "bg-[#8BC547] text-[#354E18] border-[#8BC547]"
                : "border-gray-300 text-gray-700"
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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex sm:items-center justify-center sm:px-0">
      <div className="bg-white sm:rounded-xl w-full sm:max-w-[600px] relative shadow-lg min-h-[100vh] sm:min-h-0 sm:max-h-[90vh] overflow-y-auto p-6">
        <button
          onClick={onClose}
          className="flex bg-white p-2 rounded-full absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg text-center sm:text-start font-semibold text-gray-800 mb-8">
          Filtros avanzados
        </h2>

        <div className="mb-6 sm:mb-4 text-md">
          <h3 className="font-semibold text-sm">Especie</h3>
          {renderChips("especie", ["Human", "Alien"])}
        </div>

        <div className="mb-6 sm:mb-4">
          <h3 className="font-semibold text-sm">Género</h3>
          {renderChips("genero", ["Male", "Female", "unknown"])}
        </div>

        <div className="mb-8 sm:mb-6">
          <h3 className="font-semibold text-sm">Estado</h3>
          {renderChips("estado", ["Alive", "Dead", "unknown"])}
        </div>

        <div className="flex justify-center sm:justify-end border-t-2 border-gray-100">
          <button
            onClick={() => onAplicar(filtros)}
            className="mt-6 sm:mt-4 w-11/12 sm:w-auto bg-[#8BC547] text-[#354E18] px-6 py-2 rounded-full font-semibold hover:bg-[#7ab536] transition"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
