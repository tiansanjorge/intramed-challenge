"use client";

import Image from "next/image";
import React from "react";

export interface TarjetaProps {
  nombre: string;
  especie: string;
  imagen: string;
  ubicacion: string;
  origen: string;
  estado: "Vivo" | "Muerto" | "Desconocido";
  esFavorito?: boolean;
  onClick?: () => void;
  onToggleFavorito?: () => void;
}

export const Tarjeta: React.FC<TarjetaProps> = ({
  nombre,
  especie,
  imagen,
  ubicacion,
  origen,
  estado,
  esFavorito = false,
  onClick,
  onToggleFavorito,
}) => {
  const starSrc = esFavorito ? "/star-full.png" : "/star-empty.png";
  const starAlt = esFavorito ? "Quitar de favoritos" : "Agregar a favoritos";

  const estadoIcon =
    estado === "Vivo"
      ? "/alive.png"
      : estado === "Muerto"
      ? "/dead.png"
      : "/unknown.png";

  return (
    <div
      className="flex flex-col sm:flex-row bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer w-full max-w-[31.75rem]"
      onClick={onClick}
    >
      {/* Imagen + Estrella */}
      <div className="relative">
        <Image
          src={imagen}
          alt={nombre}
          width={300}
          height={300}
          className="w-full max-h-[238px] sm:max-h-none sm:w-36 sm:h-36 max-w-none object-cover object-center rounded-t-lg sm:rounded-tr-none sm:rounded-l-lg"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorito?.();
          }}
          className={`absolute top-2 right-2 sm:left-2 sm:right-auto ${
            esFavorito ? "bg-lime-200" : "bg-gray-50"
          } rounded-full w-11 h-11 flex items-center justify-center shadow`}
          aria-label="Toggle favorito"
        >
          <Image src={starSrc} alt={starAlt} width={20} height={20} />
        </button>
      </div>

      {/* Contenido */}
      <div className="flex flex-col justify-evenly py-3 px-5 w-full gap-2 sm:gap-0">
        <div className="flex items-start justify-between w-full">
          <div>
            <h2 className="font-semibold text-gray-800 mb-1">{nombre}</h2>
            <p className="text-sm text-[#575B52]">{especie}</p>
          </div>
          <span
            className={`text-sm font-semibold px-2 py-1 rounded-full flex items-center gap-1 self-start ${
              estado === "Vivo"
                ? "bg-lime-200 text-green-800"
                : estado === "Muerto"
                ? "bg-red-200 text-red-800"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <Image src={estadoIcon} alt={estado} width={16} height={16} />
            {estado}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-4 text-sm mt-2">
          <div className="col-span-6 flex flex-col">
            <p className="text-xs font-bold text-[#808C73] mb-1">
              Last known location
            </p>
            <p className="text-gray-500">{ubicacion}</p>
          </div>
          <div className="col-span-6 flex flex-col">
            <p className="text-xs font-bold text-[#808C73] mb-1">
              First seen in
            </p>
            <p className="text-gray-500">{origen}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
