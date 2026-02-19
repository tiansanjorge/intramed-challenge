"use client";

import Image from "next/image";
import React from "react";
import { translateSpecies } from "@/utils/translations";

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

export interface CardProps {
  character: Character;
  esFavorito?: boolean;
  onClick?: () => void;
  onToggleFavorito?: () => void;
  disabled?: boolean;
  overlayVisible?: boolean;
  isSelected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  character,
  esFavorito = false,
  onClick,
  onToggleFavorito,
  disabled = false,
  overlayVisible = false,
  isSelected = false,
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
      className={`flex flex-row bg-white rounded-lg 
        transform transition-all duration-300 ease-in-out w-full max-w-[31.75rem] 
        ${isSelected ? "shadow-[0_0_15px_4px_#354E18] hover:shadow-[0_0_20px_6px_#354E18]" : "shadow-md hover:shadow-xl"}
        ${
          disabled
            ? "grayscale opacity-50 cursor-default"
            : overlayVisible
              ? "cursor-pointer"
              : "hover:-translate-y-1 cursor-pointer"
        }`}
      onClick={disabled ? undefined : onClick}
    >
      {/* Imagen + Estrella */}
      <div className="relative flex-shrink-0">
        <Image
          src={character.image}
          alt={character.name}
          width={300}
          height={300}
          className="w-28 h-28 sm:w-36 sm:h-36 object-cover object-center rounded-l-lg"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorito?.();
          }}
          className={`absolute top-2 left-2
            ${esFavorito ? "bg-lime-200" : "bg-gray-50"} 
            rounded-full w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center shadow
            transform transition-all duration-300 ease-in-out
            hover:scale-110 hover:shadow-lg hover:rotate-12
            active:scale-90 active:rotate-0
            ${esFavorito ? "hover:bg-lime-300" : "hover:bg-gray-100"}
          `}
          aria-label="Toggle favorito"
        >
          <Image
            src={starSrc}
            alt={starAlt}
            width={18}
            height={18}
            className="sm:w-5 sm:h-5 transition-transform duration-300"
          />
        </button>
      </div>

      {/* Contenido */}
      <div className="flex flex-col justify-center sm:justify-start py-2 px-3 sm:py-3 sm:px-5 w-full gap-1.5 sm:gap-2 h-28 sm:h-36 overflow-y-auto scrollbar-thin">
        <div className="flex items-start justify-between w-full">
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-800 mb-0.5 text-sm sm:text-base truncate">
              {character.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#575B52]">
              {translateSpecies(character.species)}
            </p>
          </div>
          <span
            className={`hidden sm:flex text-sm font-semibold px-2 py-1 rounded-full items-center gap-1 self-start flex-shrink-0 ${
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
            <span className="whitespace-nowrap">{estadoTraducido}</span>
          </span>
        </div>

        <div className="hidden sm:grid sm:grid-cols-12 gap-4 text-sm mt-2">
          <div className="sm:col-span-6 flex flex-col">
            <p className="text-xs font-bold text-[#808C73] mb-1">
              Última vez en:
            </p>
            <p className="text-gray-500 truncate">{character.location.name}</p>
          </div>
          <div className="sm:col-span-6 flex flex-col">
            <p className="text-xs font-bold text-[#808C73] mb-1">
              Primera vez en:
            </p>
            <p className="text-gray-500 truncate">{character.origin.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
