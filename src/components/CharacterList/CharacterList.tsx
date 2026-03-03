"use client";

import { Modal } from "@/components/Modal";
import { AdvancedFiltersModal } from "@/components/AdvancedFilters";
import CharacterDetail from "../CharacterDetail";
import { useCharacters } from "@/hooks/useCharacters";
import { toggleFavorite } from "@/store/favoritesSlice";
import { resetSearch } from "@/store/searchSlice";
import { translateGender, translateSpecies } from "@/utils/translations";

import CharacterListDecorations from "./CharacterListDecorations";
import CharacterListSkeleton from "./CharacterListSkeleton";
import CharacterListHeader from "./CharacterListHeader";
import CharacterListAppliedFilters from "./CharacterListAppliedFilters";
import CharacterListGrid from "./CharacterListGrid";
import { Character } from "@/types/Character";
import { useMemo } from "react";

type Props = ReturnType<typeof useCharacters>;

const CharacterList = ({
  dispatch,
  favoritos,
  loading,
  error,
  activo,
  setActivo,
  filters,
  setFilters,
  removeFiltro,
  showModal,
  setShowModal,
  selectedCharacter,
  setSelectedCharacter,
  filteredLeft,
  filteredRight,
  selectedLeftCard,
  setSelectedLeftCard,
  selectedRightCard,
  setSelectedRightCard,
  overlayLeftCard,
  setOverlayLeftCard,
  overlayRightCard,
  setOverlayRightCard,
  episodes,
  loadingEpisodes,
  progressEpisodes,
  paginatedLeft,
  pageLeft,
  setPageLeft,
  totalPagesLeft,
  paginatedRight,
  pageRight,
  setPageRight,
  totalPagesRight,
  allCharacters,
  searchText,
}: Props) => {
  const relatedCharacters = useMemo(() => {
    if (!selectedCharacter) return [];
    return allCharacters
      .filter((char) => char.id !== selectedCharacter.id)
      .slice(0, 3);
  }, [allCharacters, selectedCharacter]);

  type FavoritePayload = {
    id: number;
    nombre: string;
    especie: string;
    imagen: string;
    ubicacion: string;
    origen: string;
    estado: "Vivo" | "Muerto" | "Desconocido";
  };

  const toFavoritePayload = (char: Character): FavoritePayload => ({
    id: char.id,
    nombre: char.name,
    especie: translateSpecies(char.species),
    imagen: char.image,
    ubicacion: char.location.name,
    origen: char.origin.name,
    estado:
      char.status === "Alive"
        ? "Vivo"
        : char.status === "Dead"
          ? "Muerto"
          : "Desconocido",
  });

  // Error early return (se mantiene igual)
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="text-red-600 font-semibold">
          ⚠️ Error al cargar datos
        </div>
        <div className="text-gray-600 text-sm">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-[#B6DA8B] text-[#354E18] rounded-full font-semibold 
            transform transition-all duration-300 ease-in-out
            hover:bg-[#a3c77a] hover:shadow-lg hover:scale-105 active:scale-95"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <CharacterListDecorations />

      {/* Título mobile — siempre reserva espacio */}
      <div className="lg:hidden mt-6 mb-4 text-center min-h-[2.5rem]">
        {loading ? (
          <div className="mx-auto h-10 w-64 bg-gray-200 rounded-full animate-pulse" />
        ) : (
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#354E18] to-[#5a7f2e] bg-clip-text text-transparent drop-shadow-sm">
            Selección de Personajes
          </h2>
        )}
      </div>

      <div className="p-6 w-full xl:w-10/12 2xl:w-9/12 m-auto">
        <div className="backdrop-blur-sm bg-white/40 rounded-3xl shadow-2xl border border-white/60 p-8 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(139,197,71,0.15)] min-h-[700px]">
          {loading ? (
            <CharacterListSkeleton />
          ) : (
            <>
              <CharacterListHeader
                activo={activo}
                setActivo={setActivo}
                onOpenFilters={() => setShowModal(true)}
              />

              <CharacterListAppliedFilters
                filters={filters}
                searchText={searchText}
                dispatch={dispatch}
                removeFiltro={removeFiltro}
              />

              <CharacterListGrid
                allCharacters={allCharacters}
                filteredLeft={filteredLeft}
                filteredRight={filteredRight}
                paginatedLeft={paginatedLeft}
                paginatedRight={paginatedRight}
                pageLeft={pageLeft}
                setPageLeft={setPageLeft}
                totalPagesLeft={totalPagesLeft}
                pageRight={pageRight}
                setPageRight={setPageRight}
                totalPagesRight={totalPagesRight}
                selectedLeftCard={selectedLeftCard}
                setSelectedLeftCard={setSelectedLeftCard}
                selectedRightCard={selectedRightCard}
                setSelectedRightCard={setSelectedRightCard}
                overlayLeftCard={overlayLeftCard}
                setOverlayLeftCard={setOverlayLeftCard}
                overlayRightCard={overlayRightCard}
                setOverlayRightCard={setOverlayRightCard}
                favoritos={favoritos}
                dispatch={dispatch}
                setSelectedCharacter={setSelectedCharacter}
              />
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      >
        {selectedCharacter && (
          <CharacterDetail
            nombre={selectedCharacter.name}
            imagen={selectedCharacter.image}
            especie={translateSpecies(selectedCharacter.species)}
            estado={
              selectedCharacter.status === "Alive"
                ? "Vivo"
                : selectedCharacter.status === "Dead"
                  ? "Muerto"
                  : "Desconocido"
            }
            genero={translateGender(selectedCharacter.gender)}
            origen={selectedCharacter.origin.name}
            ubicacion={selectedCharacter.location.name}
            episodios={episodes}
            loadingEpisodes={loadingEpisodes}
            progressEpisodes={progressEpisodes}
            esFavorito={favoritos.some((f) => f.id === selectedCharacter.id)}
            onToggleFavorito={() =>
              dispatch(toggleFavorite(toFavoritePayload(selectedCharacter)))
            }
            backgroundImageUrl="/detail-bg.jpg"
            personajesRelacionados={relatedCharacters}
            onSelectRelated={(char) => setSelectedCharacter(char)}
            favoritosIds={favoritos.map((f) => f.id)}
            onToggleFavoritoRelacionado={(char) =>
              dispatch(toggleFavorite(toFavoritePayload(char)))
            }
          />
        )}
      </Modal>

      <AdvancedFiltersModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        valoresIniciales={filters}
        onAplicar={(f) => {
          setFilters(f);
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default CharacterList;
