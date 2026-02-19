"use client";

import Image from "next/image";
import React from "react";
import { translateSpecies } from "@/utils/translations";

type Character = {
  id: number;
  name: string;
  species: string;
  image: string;
  location: { name: string; url: string };
  origin: { name: string; url: string };
  status: "Alive" | "Dead" | "unknown";
  gender: "Male" | "Female" | "unknown";
  episode: string[];
};

type CharacterDetailProps = {
  nombre: string;
  imagen: string;
  especie: string;
  estado: "Vivo" | "Muerto" | "Desconocido";
  genero: string;
  origen: string;
  ubicacion: string;
  episodios: {
    nombre: string;
    codigo: string;
  }[];
  esFavorito?: boolean;
  onToggleFavorito?: () => void;
  backgroundImageUrl?: string;
  onBack?: () => void;
  loadingEpisodes?: boolean;
  progressEpisodes?: { loaded: number; total: number };
  personajesRelacionados?: Character[];
  onSelectRelated?: (character: Character) => void;
  favoritosIds?: number[];
  onToggleFavoritoRelacionado?: (character: Character) => void;
};

const CharacterDetail = ({
  nombre,
  imagen,
  especie,
  estado,
  genero,
  origen,
  ubicacion,
  episodios,
  esFavorito = false,
  onToggleFavorito,
  backgroundImageUrl,
  loadingEpisodes = false,
  progressEpisodes = { loaded: 0, total: 0 },
  personajesRelacionados = [],
  onSelectRelated,
  favoritosIds = [],
  onToggleFavoritoRelacionado,
}: CharacterDetailProps) => {
  const starSrc = esFavorito ? "/star-full.png" : "/star-empty.png";
  const estadoColor =
    estado === "Vivo"
      ? "bg-[#E7F3D8] text-[#354E18]"
      : estado === "Muerto"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-700";

  // Sub-componente para personajes relacionados con efectos mejorados
  const RelatedCard = ({ character }: { character: Character }) => {
    const isFavorito = favoritosIds.includes(character.id);
    const relatedStarSrc = isFavorito ? "/star-full.png" : "/star-empty.png";

    return (
      <div
        className="bg-white rounded-xl shadow-md w-[192px] min-w-[192px] flex-none font-sans mt-2 mb-3 
          cursor-pointer group overflow-hidden
          transform transition-all duration-500 ease-out
          hover:shadow-2xl hover:-translate-y-2 hover:scale-105
          border border-gray-100 hover:border-gray-200
          relative
          before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/5 before:to-transparent 
          before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
        onClick={() => onSelectRelated?.(character)}
      >
        <div className="relative overflow-hidden">
          <div
            className="h-[144px] w-full overflow-hidden flex items-center justify-center 
            bg-gradient-to-br from-gray-100 to-gray-50"
          >
            <Image
              src={character.image}
              alt={character.name}
              width={192}
              height={144}
              className="w-full h-[144px] object-cover object-center rounded-t-xl
                transition-all duration-500 ease-out
                group-hover:scale-110 group-hover:brightness-110"
            />
          </div>
          {/* Efecto de brillo en hover */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"
          />

          <button
            className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-full w-7 h-7 
              flex items-center justify-center shadow-md
              transform transition-all duration-300 ease-in-out z-10
              hover:scale-125 hover:rotate-12 hover:shadow-lg active:scale-90
              border border-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavoritoRelacionado?.(character);
            }}
          >
            <Image
              src={relatedStarSrc}
              alt="favoritos"
              width={14}
              height={14}
            />
          </button>
        </div>
        <div className="p-3 relative z-10">
          <h3
            className="text-sm font-semibold text-gray-800 mb-1 
            group-hover:text-[#354E18] transition-colors duration-300"
          >
            {character.name}
          </h3>
          <p className="text-gray-400 text-xs font-semibold">
            {translateSpecies(character.species)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl bg-[#F0F1EC]">
      {/* Header con overlay mejorado */}
      <div
        className="relative h-[128px] bg-cover bg-top overflow-hidden
          before:content-[''] before:absolute before:inset-0 
          before:bg-[linear-gradient(0deg,_rgba(0,0,0,0)_-10%,_rgba(0,0,0,0.8)_80%)] 
          before:bg-blend-multiply sm:before:hidden 
          sm:after:content-[''] sm:after:absolute sm:after:inset-0 
          sm:after:bg-gradient-to-b sm:after:from-black/60 sm:after:via-black/30 sm:after:to-transparent
          group"
        style={{
          backgroundImage: backgroundImageUrl
            ? `url(${backgroundImageUrl})`
            : undefined,
        }}
      >
        {/* Efecto de brillo sutil en el fondo */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"
        />
      </div>

      {/* Imagen del personaje fuera del header para evitar que se corte */}
      <div className="relative">
        <Image
          src={imagen}
          alt={nombre}
          width={128}
          height={128}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white absolute 
            left-1/2 translate-x-[-48px] sm:translate-x-0 sm:left-6 -top-[48px] sm:-top-[64px] z-20 object-cover
            shadow-xl hover:shadow-2xl transition-all duration-300
            ring-2 ring-white/50 hover:ring-white/70"
        />
      </div>

      <div className="pt-14 sm:pt-4 px-5 pb-5">
        <div className="text-center sm:text-left sm:ml-40 animate-stagger">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <h2 className="text-2xl font-semibold">{nombre}</h2>
            <button
              onClick={onToggleFavorito}
              className="transform transition-all duration-300 ease-in-out
                hover:scale-125 hover:rotate-12 active:scale-90 active:rotate-0
                drop-shadow-sm hover:drop-shadow-md"
            >
              <Image src={starSrc} alt="favorito" width={20} height={20} />
            </button>
          </div>
          <p className="text-gray-400 text-sm font-semibold">{especie}</p>
        </div>

        {/* Información con animaciones escalonadas */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
          <div
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl 
            transition-all duration-300 animate-stagger delay-100
            border border-gray-100"
          >
            <h3 className="font-semibold text-gray-700 mb-2">Información</h3>
            <div className="flex sm:flex-col flex-wrap">
              <p className="text-sm w-1/2 sm:w-auto text-gray-600 mb-4">
                <span className="text-xs font-semibold text-[#808C73]">
                  Género:
                </span>
                <br /> {genero}
              </p>
              <p className="text-sm w-1/2 sm:w-auto text-gray-600 mb-4">
                <span className="text-xs font-semibold text-[#808C73]">
                  Origen:
                </span>
                <br /> {origen}
              </p>
              <div className="flex flex-col mb-2">
                <p className="text-xs w-1/2 mb-1 sm:w-auto font-semibold text-[#808C73]">
                  Estado:
                </p>
                <div
                  className={`flex gap-1 max-w-fit items-center mt-1 px-3 py-1 text-sm font-semibold rounded-full ${estadoColor}`}
                >
                  <Image
                    src={
                      estado === "Vivo"
                        ? "/alive.png"
                        : estado === "Muerto"
                          ? "/dead.png"
                          : "/unknown.png"
                    }
                    alt={estado}
                    width={16}
                    height={16}
                  />
                  {estado}
                </div>
              </div>
            </div>
          </div>

          {/* Episodios con animaciones */}
          <div
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl 
            transition-all duration-300 w-full animate-stagger delay-200
            border border-gray-100"
          >
            <h3 className="font-semibold text-gray-700 mb-2">Episodios</h3>
            {loadingEpisodes ? (
              <div className="flex flex-col items-center justify-center py-6 gap-3">
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#354E18]"></div>
                  <div className="absolute inset-0 rounded-full h-8 w-8 border-t-2 border-[#B6DA8B] animate-spin animation-delay-2000"></div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-700">
                    Cargando episodios...
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {progressEpisodes.loaded} / {progressEpisodes.total}
                  </p>
                </div>
                {/* Barra de progreso mejorada */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-[#B6DA8B] to-[#354E18] h-full 
                      transition-all duration-500 ease-out rounded-full
                      shadow-lg relative overflow-hidden
                      before:absolute before:inset-0 
                      before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent
                      before:animate-shimmer"
                    style={{
                      width:
                        progressEpisodes.total > 0
                          ? `${Math.round((progressEpisodes.loaded / progressEpisodes.total) * 100)}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            ) : (
              <ul
                className="text-sm text-gray-600 space-y-3 max-h-40 overflow-y-auto pr-2 
                scrollbar-glass"
              >
                {episodios.map((ep, i) => (
                  <li
                    key={i}
                    className="hover:bg-gray-50 p-2 rounded transition-colors duration-200"
                  >
                    <div>
                      <span className="text-[#808C73] me-2 font-semibold">
                        {ep.codigo}
                      </span>
                      {ep.nombre}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Ubicación actual y origen con animación */}
        <div className="flex flex-col sm:flex-row gap-4 text-sm mt-6 animate-stagger delay-300">
          <div
            className="w-1/2 flex flex-col p-3 rounded-lg bg-gradient-to-br from-gray-50 to-white
            hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <p className="text-xs font-bold text-[#808C73] mb-1">
              Primera vez en:
            </p>
            <p className="text-gray-500">{origen}</p>
          </div>
          <div
            className="w-1/2 flex flex-col p-3 rounded-lg bg-gradient-to-br from-gray-50 to-white
            hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <p className="text-xs font-bold text-[#808C73] mb-1">
              Última vez en:
            </p>
            <p className="text-gray-500">{ubicacion}</p>
          </div>
        </div>

        {/* Personajes Relacionados con animación */}
        {personajesRelacionados.length > 0 && (
          <div className="text-sm mt-6 animate-stagger delay-400">
            <h3 className="font-semibold text-gray-700 mb-2">
              Personajes relacionados
            </h3>
            <div
              className="flex gap-4 overflow-x-scroll pb-2 
              scrollbar-thin scrollbar-thumb-gray-300"
            >
              {personajesRelacionados.map((char) => (
                <RelatedCard key={char.id} character={char} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterDetail;
