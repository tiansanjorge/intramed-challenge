"use client";

import { SlidersHorizontalIcon } from "lucide-react";
import { Modal } from "@/components/Modal";
import { AdvancedFiltersModal } from "@/components/AdvancedFilters";
import CharacterDetail from "./CharacterDetail";
import { useCharacters } from "@/hooks/useCharacters";
import { CharacterColumn } from "./CharacterColumn";
import { useRef, useEffect, useState } from "react";
import { resetSearch } from "@/store/searchSlice";
import { translateGender, translateSpecies } from "@/utils/translations";

type Props = ReturnType<typeof useCharacters>;

const CharacterList = ({
  dispatch,
  favoritos,
  toggleFavorite,
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
  // Refs para medir los botones
  const todosRef = useRef<HTMLButtonElement>(null);
  const favoritosRef = useRef<HTMLButtonElement>(null);
  const [backgroundStyle, setBackgroundStyle] = useState({
    left: "4px",
    width: "0px",
  });

  // Actualizar posición y ancho del fondo cuando cambie la opción activa
  useEffect(() => {
    const updateBackground = () => {
      if (activo === "todos" && todosRef.current) {
        setBackgroundStyle({
          left: "4px",
          width: `${todosRef.current.offsetWidth}px`,
        });
      } else if (activo === "favoritos" && favoritosRef.current) {
        const offset = todosRef.current ? todosRef.current.offsetWidth + 8 : 0;
        setBackgroundStyle({
          left: `${offset}px`,
          width: `${favoritosRef.current.offsetWidth}px`,
        });
      }
    };

    updateBackground();
    // Actualizar en resize por si cambia el tamaño
    window.addEventListener("resize", updateBackground);
    return () => window.removeEventListener("resize", updateBackground);
  }, [activo]);

  // Obtener personajes relacionados: primeros 3 que no sean el seleccionado
  const getRelatedCharacters = () => {
    if (!selectedCharacter) return [];
    return allCharacters
      .filter((char) => char.id !== selectedCharacter.id)
      .slice(0, 3);
  };

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
            hover:bg-[#a3c77a] hover:shadow-lg hover:scale-105
            active:scale-95"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Título mobile con mejor contraste */}
      <div className="md:hidden mt-6 mb-4 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#354E18] to-[#5a7f2e] bg-clip-text text-transparent drop-shadow-sm">
          Selección de Personajes
        </h2>
      </div>

      {/* Contenedor principal con efecto glassmorphism */}
      <div className="p-6 w-full xl:w-10/12 2xl:w-9/12 m-auto">
        <div
          className="backdrop-blur-sm bg-white/40 rounded-3xl shadow-2xl border border-white/60 p-8
          transform transition-all duration-500 hover:shadow-[0_20px_60px_rgba(139,197,71,0.15)]
          animate-fadeIn"
        >
          {/* Tabs + título + filtros */}
          <div className="relative flex justify-between items-center mb-6">
            {/* Tabs */}
            <div className="relative flex gap-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/20 p-1 h-10 items-center">
              {/* Fondo animado con gradiente */}
              <div
                className="absolute top-1 bottom-1 bg-gradient-to-r from-[#B6DA8B] to-[#8BC547] rounded-full transition-all duration-300 ease-in-out shadow-md"
                style={{
                  left: backgroundStyle.left,
                  width: backgroundStyle.width,
                }}
              />

              {/* Botones */}
              <button
                ref={todosRef}
                onClick={() => setActivo("todos")}
                className={`relative z-10 px-4 py-2 rounded-full text-sm font-semibold 
                  transition-all duration-300 ease-in-out
                  hover:scale-105 active:scale-95 ${
                    activo === "todos"
                      ? "text-[#354E18]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Todos
              </button>
              <button
                ref={favoritosRef}
                onClick={() => setActivo("favoritos")}
                className={`relative z-10 px-4 py-2 rounded-full text-sm font-semibold 
                  transition-all duration-300 ease-in-out
                  hover:scale-105 active:scale-95 ${
                    activo === "favoritos"
                      ? "text-[#354E18]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Favoritos
              </button>
            </div>

            {/* Título centrado absolutamente */}
            <h2 className="hidden md:block absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-center bg-gradient-to-r from-[#354E18] to-[#5a7f2e] bg-clip-text text-transparent drop-shadow-sm pointer-events-none">
              Selección de Personajes
            </h2>

            {/* Botón filtros */}
            <button
              onClick={() => setShowModal(true)}
              aria-label="Abrir filtros"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white/20
                flex items-center justify-center
                transform transition-all duration-300 ease-in-out
                hover:scale-110 hover:shadow-xl hover:border-[#8BC547] hover:bg-gradient-to-br hover:from-[#8BC547]/20 hover:to-[#B6DA8B]/20
                active:scale-95"
            >
              <SlidersHorizontalIcon className="w-4 h-4 text-gray-500 transition-colors duration-300 hover:text-[#8BC547]" />
            </button>
          </div>

          <div className="flex flex-wrap justify-between items-start gap-4 my-5">
            <div className="flex gap-4 items-center">
              {(filters.especie.length > 0 ||
                filters.genero.length > 0 ||
                filters.estado.length > 0 ||
                searchText.length > 0) && (
                <div className="text-sm font-semibold text-gray-800">
                  Filtros aplicados:
                </div>
              )}
              <div className="flex flex-wrap gap-2 font-semibold">
                {/* Chip de búsqueda */}
                {searchText && (
                  <span
                    className="flex gap-2 items-center bg-white/70 backdrop-blur-sm border border-white/40 text-[#333630] text-sm px-3 py-1.5 rounded-full shadow-md
                      transform transition-all duration-300 ease-in-out
                      hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-[#B6DA8B] hover:to-[#8BC547] hover:text-white
                      animate-fadeIn"
                  >
                    <span className="italic">&quot;{searchText}&quot;</span>
                    <button
                      onClick={() => dispatch(resetSearch())}
                      className="text-gray-600 hover:text-white
                        transform transition-all duration-200 ease-in-out
                        hover:scale-125 hover:rotate-90 active:scale-90"
                      aria-label="Limpiar búsqueda"
                    >
                      <img
                        src="/cross.png"
                        alt="Limpiar búsqueda"
                        className="w-4 h-4"
                      />
                    </button>
                  </span>
                )}
                {/* Chips de filtros */}
                {(["especie", "genero", "estado"] as const).flatMap((tipo) =>
                  filters[tipo].map((valor) => (
                    <span
                      key={`${tipo}-${valor}`}
                      className="flex gap-2 items-center bg-white/70 backdrop-blur-sm border border-white/40 text-[#333630] text-sm px-3 py-1.5 rounded-full shadow-md
                        transform transition-all duration-300 ease-in-out
                        hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-[#B6DA8B] hover:to-[#8BC547] hover:text-white
                        animate-fadeIn"
                    >
                      {valor}
                      <button
                        onClick={() => removeFiltro(tipo, valor)}
                        className="text-gray-600 hover:text-white
                          transform transition-all duration-200 ease-in-out
                          hover:scale-125 hover:rotate-90 active:scale-90"
                      >
                        <img
                          src="/cross.png"
                          alt="Quitar filtro"
                          className="w-4 h-4"
                        />
                      </button>
                    </span>
                  )),
                )}
              </div>
            </div>
          </div>

          {/* Listados */}
          {filteredLeft.length === 0 && filteredRight.length === 0 ? (
            <div className="text-center py-12 text-gray-700 font-semibold text-lg">
              No hay personajes para mostrar.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6">
              {/* Columna izquierda */}
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

              {/* Divisor con efecto mejorado */}
              <div className="hidden md:block relative">
                <div className="absolute inset-0 left-1/2 -translate-x-1/2 border-l-2 border-dashed border-[#354e1859]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-[#8BC547] to-[#B6DA8B] rounded-full shadow-lg"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-[#B6DA8B] to-[#8BC547] rounded-full shadow-lg"></div>
              </div>

              {/* Columna derecha */}
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
          )}
        </div>
      </div>

      {/* Modales fuera del contenedor glassmorphism */}
      {/* Modal detalle */}
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
              dispatch(
                toggleFavorite({
                  id: selectedCharacter.id,
                  nombre: selectedCharacter.name,
                  especie: translateSpecies(selectedCharacter.species),
                  imagen: selectedCharacter.image,
                  ubicacion: selectedCharacter.location.name,
                  origen: selectedCharacter.origin.name,
                  estado:
                    selectedCharacter.status === "Alive"
                      ? "Vivo"
                      : selectedCharacter.status === "Dead"
                        ? "Muerto"
                        : "Desconocido",
                }),
              )
            }
            backgroundImageUrl="/detail-bg.jpg"
            personajesRelacionados={getRelatedCharacters()}
            onSelectRelated={(char) => setSelectedCharacter(char)}
            favoritosIds={favoritos.map((f) => f.id)}
            onToggleFavoritoRelacionado={(char) =>
              dispatch(
                toggleFavorite({
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
                }),
              )
            }
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
  );
};

export default CharacterList;
