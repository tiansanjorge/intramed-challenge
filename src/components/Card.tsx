"use client";

import Image from "next/image";
import React from "react";

type Estado = "Vivo" | "Muerto" | "Desconocido";

export interface Character {
  id: number;
  name: string;
  species: string;
  image: string;
  location: { name: string; url: string };
  origin: { name: string; url: string };
  status: "Alive" | "Dead" | "unknown";
}

export interface TarjetaProps {
  character: Character;
  esFavorito?: boolean;
  onClick?: () => void;
  onToggleFavorito?: () => void;
}

export const Tarjeta: React.FC<TarjetaProps> = ({
  character,
  esFavorito = false,
  onClick,
  onToggleFavorito,
}) => {
  const estadoTraducido: Estado =
    character.status === "Alive"
      ? "Vivo"
      : character.status === "Dead"
      ? "Muerto"
      : "Desconocido";

  const starSrc = esFavorito ? "/star-full.png" : "/star-empty.png";
  const starAlt = esFavorito ? "Quitar de favoritos" : "Agregar a favoritos";

  const estadoIcon =
    estadoTraducido === "Vivo"
      ? "/alive.png"
      : estadoTraducido === "Muerto"
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
          src={character.image}
          alt={character.name}
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
            <h2 className="font-semibold text-gray-800 mb-1">
              {character.name}
            </h2>
            <p className="text-sm text-[#575B52]">{character.species}</p>
          </div>
          <span
            className={`text-sm font-semibold px-2 py-1 rounded-full flex items-center gap-1 self-start ${
              estadoTraducido === "Vivo"
                ? "bg-lime-200 text-green-800"
                : estadoTraducido === "Muerto"
                ? "bg-red-200 text-red-800"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <Image
              src={estadoIcon}
              alt={estadoTraducido}
              width={16}
              height={16}
            />
            {estadoTraducido}
          </span>
        </div>

        <div className="grid grid-cols-12 gap-4 text-sm mt-2">
          <div className="col-span-6 flex flex-col">
            <p className="text-xs font-bold text-[#808C73] mb-1">
              Last known location
            </p>
            <p className="text-gray-500">{character.location.name}</p>
          </div>
          <div className="col-span-6 flex flex-col">
            <p className="text-xs font-bold text-[#808C73] mb-1">
              First seen in
            </p>
            <p className="text-gray-500">{character.origin.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
