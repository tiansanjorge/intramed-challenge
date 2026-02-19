"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./Card";
import { toggleFavorite } from "@/store/favoritesSlice";
import type { AppDispatch } from "@/store";

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

interface Props {
  title: string;
  paginated: Character[];
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  selectedCard: number | null;
  setSelectedCard: (id: number | null) => void;
  overlayCard: number | null;
  setOverlayCard: (id: number | null) => void;
  favoritos: { id: number }[];
  dispatch: AppDispatch;
  setSelectedCharacter: (c: Character) => void;
  otherSideSelectedId?: number | null;
}

export const CharacterColumn = ({
  title,
  paginated,
  page,
  setPage,
  totalPages,
  selectedCard,
  setSelectedCard,
  overlayCard,
  setOverlayCard,
  favoritos,
  dispatch,
  setSelectedCharacter,
  otherSideSelectedId = null,
}: Props) => {
  return (
    <div className="lg:mx-0 mx-auto max-w-[31.75rem]">
      {/* Título + paginación */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold">{title}</h2>
        {paginated.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full 
                disabled:opacity-20 disabled:cursor-not-allowed
                hover:bg-[#B6DA8B] hover:shadow-md 
                transform transition-all duration-300 ease-in-out
                hover:scale-110 active:scale-95
                enabled:hover:-translate-x-0.5"
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold min-w-[3.5rem] text-center">
              {page} / {totalPages || 1}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full 
                disabled:opacity-20 disabled:cursor-not-allowed
                hover:bg-[#B6DA8B] hover:shadow-md
                transform transition-all duration-300 ease-in-out
                hover:scale-110 active:scale-95
                enabled:hover:translate-x-0.5"
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Listado de Cards */}
      <div className="flex flex-col justify-between">
        <div>
          {paginated.map((char) => {
            const isDisabled = char.id === otherSideSelectedId;

            return (
              <div
                key={char.id}
                className="relative mb-4 rounded-lg"
                onMouseLeave={() => setOverlayCard(null)}
              >
                <Card
                  character={char}
                  esFavorito={favoritos.some((f) => f.id === char.id)}
                  onClick={() =>
                    setOverlayCard(overlayCard === char.id ? null : char.id)
                  }
                  onToggleFavorito={() =>
                    dispatch(
                      toggleFavorite({
                        id: char.id,
                        nombre: char.name,
                        especie: char.species,
                        imagen: char.image,
                        ubicacion: char.location.name,
                        origen: char.origin.name,
                        estado:
                          char.status === "Alive"
                            ? "Vivo"
                            : char.status === "Dead"
                              ? "Muerto"
                              : "Desconocido",
                      }),
                    )
                  }
                  disabled={isDisabled}
                  overlayVisible={overlayCard === char.id}
                  isSelected={selectedCard === char.id}
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 flex items-center justify-center gap-4 rounded-lg
                  bg-black bg-opacity-60 transition-opacity duration-500 ease-in-out
                  ${
                    overlayCard === char.id
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedCharacter(char)}
                      className="bg-white text-gray-800 px-5 py-2 rounded-full font-semibold shadow 
                        transform transition-all duration-300 ease-in-out
                        hover:bg-gray-100 hover:shadow-lg hover:scale-105
                        active:scale-95"
                    >
                      Detalle
                    </button>

                    {isDisabled ? (
                      <button
                        disabled
                        className="bg-gray-400 text-gray-200 px-5 py-2 rounded-full font-semibold shadow cursor-not-allowed"
                        title="Este personaje ya está seleccionado en el otro lado"
                      >
                        Ya seleccionado
                      </button>
                    ) : selectedCard === char.id ? (
                      <button
                        onClick={() => setSelectedCard(null)}
                        className="bg-red-600 text-white px-5 py-2 rounded-full font-semibold shadow 
                          transform transition-all duration-300 ease-in-out
                          hover:bg-red-700 hover:shadow-lg hover:scale-105
                          active:scale-95"
                      >
                        Quitar
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedCard(char.id)}
                        className="bg-[#B6DA8B] text-[#354E18] px-5 py-2 rounded-full font-semibold shadow 
                          transform transition-all duration-300 ease-in-out
                          hover:bg-[#354E18] hover:text-[#B6DA8B] hover:shadow-lg hover:scale-105
                          active:scale-95"
                      >
                        Elegir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
