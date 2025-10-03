"use client";

import { SlidersHorizontalIcon } from "lucide-react";
import { Modal } from "@/components/Modal";
import { AdvancedFiltersModal } from "@/components/AdvancedFilters";
import CharacterDetail from "./CharacterDetail";
import { useCharacters } from "@/hooks/useCharacters";
import { CharacterColumn } from "./CharacterColumn";
type Props = ReturnType<typeof useCharacters>;

const CharacterList = ({
  dispatch,
  favoritos,
  toggleFavorite,
  loading,
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
  paginatedLeft,
  pageLeft,
  setPageLeft,
  totalPagesLeft,
  paginatedRight,
  pageRight,
  setPageRight,
  totalPagesRight,
}: Props) => {
  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-64"
        data-testid="spinner"
      >
        <div className="w-12 h-12 border-4 border-[#B6DA8B] border-t-[#354E18] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="md:hidden text-2xl font-bold mt-6 text-center">
        Selección de personajes
      </h2>
      <div className="p-6 w-full xl:w-10/12 2xl:w-9/12 m-auto">
        {/* Tabs + filtros */}
        <div className="flex items-center justify-between mx-auto mb-4">
          {/* Tabs */}
          <div className="flex gap-56">
            <div className="flex gap-2 bg-white rounded-full shadow-sm p-1 h-10 items-center">
              <button
                onClick={() => setActivo("todos")}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  activo === "todos"
                    ? "bg-[#B6DA8B] text-[#354E18]"
                    : "text-gray-500"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActivo("favoritos")}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  activo === "favoritos"
                    ? "bg-[#B6DA8B] text-[#354E18]"
                    : "text-gray-500"
                }`}
              >
                Favoritos
              </button>
            </div>
            <h2 className="hidden md:block text-2xl font-bold mb-6 text-center">
              Selección de personajes
            </h2>
            {/* Filtros aplicados */}
          </div>

          {/* Botón filtros */}
          <button
            onClick={() => setShowModal(true)}
            aria-label="Abrir filtros"
            className="w-10 h-10 rounded-full bg-white shadow border border-gray-300 flex items-center justify-center"
          >
            <SlidersHorizontalIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className=" flex flex-wrap justify-between items-start gap-4 my-5">
          <div className="flex gap-4 items-center">
            {(filters.especie.length > 0 ||
              filters.genero.length > 0 ||
              filters.estado.length > 0) && (
              <div className="text-sm font-semibold text-gray-800">
                Filtros aplicados:
              </div>
            )}
            <div className="flex flex-wrap gap-2 font-semibold">
              {(["especie", "genero", "estado"] as const).flatMap((tipo) =>
                filters[tipo].map((valor) => (
                  <span
                    key={`${tipo}-${valor}`}
                    className="flex gap-2 items-center bg-[#C7CBC2] text-[#333630] text-sm px-3 py-1 rounded-full"
                  >
                    {valor}
                    <button
                      onClick={() => removeFiltro(tipo, valor)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <img
                        src="/cross.png"
                        alt="Quitar filtro"
                        className="w-4 h-4"
                      />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Listados */}
        {filteredLeft.length === 0 && filteredRight.length === 0 ? (
          <div className="text-center py-12 text-gray-600 font-semibold">
            {" "}
            No hay personajes para mostrar.{" "}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6">
            {/* Columna izquierda */}
            <CharacterColumn
              title="Personaje #1"
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
            />

            {/* Divisor */}
            <div className="hidden md:block border-l-2 border-dashed border-[#354e1859] mx-auto"></div>

            {/* Columna derecha */}
            <CharacterColumn
              title="Personaje #2"
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
            />
          </div>
        )}

        {/* Modal detalle */}
        <Modal
          isOpen={!!selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        >
          {selectedCharacter && (
            <CharacterDetail
              nombre={selectedCharacter.name}
              imagen={selectedCharacter.image}
              especie={selectedCharacter.species}
              estado={
                selectedCharacter.status === "Alive"
                  ? "Vivo"
                  : selectedCharacter.status === "Dead"
                  ? "Muerto"
                  : "Desconocido"
              }
              genero={selectedCharacter.gender}
              origen={selectedCharacter.origin.name}
              ubicacion={selectedCharacter.location.name}
              episodios={episodes}
              esFavorito={favoritos.some((f) => f.id === selectedCharacter.id)}
              onToggleFavorito={() =>
                dispatch(
                  toggleFavorite({
                    id: selectedCharacter.id,
                    nombre: selectedCharacter.name,
                    especie: selectedCharacter.species,
                    imagen: selectedCharacter.image,
                    ubicacion: selectedCharacter.location.name,
                    origen: selectedCharacter.origin.name,
                    estado:
                      selectedCharacter.status === "Alive"
                        ? "Vivo"
                        : selectedCharacter.status === "Dead"
                        ? "Muerto"
                        : "Desconocido",
                  })
                )
              }
              backgroundImageUrl="/detail-bg.jpg"
            />
          )}
        </Modal>

        {/* Modal filtros */}
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
    </div>
  );
};

export default CharacterList;
