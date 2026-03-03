"use client";

import { Favorite } from "@/store/favoritesSlice";
import { CharacterColumn } from "../CharacterColumn";
import type { Character } from "@/types/Character";
import type { UnknownAction, Dispatch } from "@reduxjs/toolkit";

type Props = {
  allCharacters: Character[];
  filteredLeft: Character[];
  filteredRight: Character[];
  paginatedLeft: Character[];
  paginatedRight: Character[];
  pageLeft: number;
  setPageLeft: (n: number) => void;
  totalPagesLeft: number;
  pageRight: number;
  setPageRight: (n: number) => void;
  totalPagesRight: number;

  selectedLeftCard: number | null;
  setSelectedLeftCard: (id: number | null) => void;
  selectedRightCard: number | null;
  setSelectedRightCard: (id: number | null) => void;

  overlayLeftCard: number | null;
  setOverlayLeftCard: (id: number | null) => void;
  overlayRightCard: number | null;
  setOverlayRightCard: (id: number | null) => void;

  favoritos: Favorite[];
  dispatch: Dispatch<UnknownAction>;
  setSelectedCharacter: (char: Character | null) => void;
};

export default function CharacterListGrid({
  allCharacters,
  filteredLeft,
  filteredRight,
  paginatedLeft,
  paginatedRight,
  pageLeft,
  setPageLeft,
  totalPagesLeft,
  pageRight,
  setPageRight,
  totalPagesRight,
  selectedLeftCard,
  setSelectedLeftCard,
  selectedRightCard,
  setSelectedRightCard,
  overlayLeftCard,
  setOverlayLeftCard,
  overlayRightCard,
  setOverlayRightCard,
  favoritos,
  dispatch,
  setSelectedCharacter,
}: Props) {
  // Empty state: había personajes pero filtros dejaron todo vacío
  if (
    allCharacters.length > 0 &&
    filteredLeft.length === 0 &&
    filteredRight.length === 0
  ) {
    return (
      <div className="text-center py-12 text-gray-700 font-semibold text-lg">
        No hay personajes para mostrar
      </div>
    );
  }

  // Si no hay nada para renderizar, devolvemos null (igual que antes)
  if (filteredLeft.length === 0 && filteredRight.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6">
      <CharacterColumn
        title="Primer Personaje"
        paginated={paginatedLeft}
        page={pageLeft}
        setPage={setPageLeft}
        totalPages={totalPagesLeft}
        selectedCard={selectedLeftCard}
        setSelectedCard={setSelectedLeftCard}
        overlayCard={overlayLeftCard}
        setOverlayCard={setOverlayLeftCard}
        favoritos={favoritos}
        dispatch={dispatch}
        setSelectedCharacter={setSelectedCharacter}
        otherSideSelectedId={selectedRightCard}
      />

      {/* VS separador en mobile */}
      <div className="lg:hidden relative h-12 flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-[#354E18]/30" />
        </div>
        <div className="relative px-4 bg-white/80 backdrop-blur-sm rounded-full">
          <span className="text-[#354E18] text-sm font-semibold">VS</span>
        </div>
      </div>

      {/* Separador en desktop */}
      <div className="hidden lg:block relative w-4">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-[#354e1859]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-br from-[#8BC547] to-[#B6DA8B] rounded-full shadow-lg" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-gradient-to-br from-[#B6DA8B] to-[#8BC547] rounded-full shadow-lg" />
      </div>

      <CharacterColumn
        title="Segundo Personaje"
        paginated={paginatedRight}
        page={pageRight}
        setPage={setPageRight}
        totalPages={totalPagesRight}
        selectedCard={selectedRightCard}
        setSelectedCard={setSelectedRightCard}
        overlayCard={overlayRightCard}
        setOverlayCard={setOverlayRightCard}
        favoritos={favoritos}
        dispatch={dispatch}
        setSelectedCharacter={setSelectedCharacter}
        otherSideSelectedId={selectedLeftCard}
      />
    </div>
  );
}
