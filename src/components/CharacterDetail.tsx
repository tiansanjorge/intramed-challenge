"use client";

import Image from "next/image";
import React from "react";

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
}: CharacterDetailProps) => {
  const starSrc = esFavorito ? "/star-full.png" : "/star-empty.png";
  const estadoColor =
    estado === "Vivo"
      ? "bg-[#E7F3D8] text-[#354E18]"
      : estado === "Muerto"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-700";

  // Sub-componente para personajes relacionados
  const RelatedCard = () => (
    <div className="bg-white rounded-xl shadow w-[192px] min-w-[192px] flex-none font-sans mt-2 mb-3">
      <div className="relative">
        <div className="h-[144px] w-full overflow-hidden flex items-center justify-center">
          <Image
            src={imagen}
            alt={nombre}
            width={192}
            height={144}
            className="w-full h-[144px] object-cover object-center rounded-t-xl"
          />
        </div>
        <button
          className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow"
          onClick={onToggleFavorito}
        >
          <Image src={starSrc} alt="favoritos" width={14} height={14} />
        </button>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">{nombre}</h3>
        <p className="text-gray-400 text-xs font-semibold">{especie}</p>
      </div>
    </div>
  );

  return (
    <div className="rounded-xl bg-[#F0F1EC]">
      {/* Header */}
      <div
        className="relative h-[128px] bg-cover bg-top 
          before:content-[''] before:absolute before:inset-0 
          before:bg-[linear-gradient(0deg,_rgba(0,0,0,0)_-10%,_rgba(0,0,0,0.8)_80%)] 
          before:bg-blend-multiply sm:before:hidden 
          sm:after:content-[''] sm:after:absolute sm:after:inset-0 
          sm:after:bg-black sm:after:opacity-40"
        style={{
          backgroundImage: backgroundImageUrl
            ? `url(${backgroundImageUrl})`
            : undefined,
        }}
      >
        <Image
          src={imagen}
          alt={nombre}
          width={128}
          height={128}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white absolute left-1/2 translate-x-[-48px] sm:translate-x-0 sm:left-6 top-[80px] sm:top-[64px] z-10 object-cover"
        />
      </div>

      <div className="pt-14 sm:pt-4 px-5 pb-5">
        <div className="text-center sm:text-left sm:ml-40">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <h2 className="text-2xl font-semibold">{nombre}</h2>
            <button onClick={onToggleFavorito}>
              <Image src={starSrc} alt="favorito" width={20} height={20} />
            </button>
          </div>
          <p className="text-gray-400 text-sm font-semibold">{especie}</p>
        </div>

        {/* Información */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
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

          {/* Episodios */}
          <div className="bg-white p-4 rounded-lg shadow w-full">
            <h3 className="font-semibold text-gray-700 mb-2">Episodios</h3>
            <ul className="text-sm text-gray-600 space-y-3">
              {episodios.slice(0, 5).map((ep, i) => (
                <li key={i}>
                  <div>
                    <span className="text-[#808C73] me-2">{ep.codigo}</span>
                    {ep.nombre}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ubicación actual y origen */}
        <div className="flex flex-col sm:flex-row gap-4 text-sm mt-6">
          <div className="w-1/2 flex flex-col">
            <p className="text-xs font-bold text-[#808C73] mb-1">
              First seen in
            </p>
            <p className="text-gray-500">{origen}</p>
          </div>
          <div className="w-1/2 flex flex-col">
            <p className="text-xs font-bold text-[#808C73] mb-1">
              Last known location
            </p>
            <p className="text-gray-500">{ubicacion}</p>
          </div>
        </div>

        {/* Personajes Relacionados */}
        <div className="text-sm mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">
            Personajes relacionados
          </h3>
          <div className="flex gap-4 overflow-x-scroll">
            <RelatedCard />
            <RelatedCard />
            <RelatedCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetail;
