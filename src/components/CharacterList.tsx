"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontalIcon } from "lucide-react";
import { Modal } from "@/components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "@/store/favoritesSlice";
import type { RootState } from "@/store";
import { AdvancedFiltersModal } from "@/components/AdvancedFilters";
import { Tarjeta } from "./Tarjeta";
import CharacterDetail from "./CharacterDetail";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

type Filtros = { especie: string[]; estado: string[]; genero: string[] };

const ITEMS_PER_PAGE = 3;

const CharacterList = () => {
  const dispatch = useDispatch();

  const favoritos = useSelector((state: RootState) => state.favorites);
  const searchText = useSelector((state: RootState) => state.search.searchText);

  const [charactersLeft, setCharactersLeft] = useState<Character[]>([]);
  const [charactersRight, setCharactersRight] = useState<Character[]>([]);
  const [pageLeft, setPageLeft] = useState(1);
  const [pageRight, setPageRight] = useState(1);

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [selectedLeftCard, setSelectedLeftCard] = useState<number | null>(null);
  const [selectedRightCard, setSelectedRightCard] = useState<number | null>(
    null
  );
  const [overlayLeftCard, setOverlayLeftCard] = useState<number | null>(null);
  const [overlayRightCard, setOverlayRightCard] = useState<number | null>(null);

  const [episodes, setEpisodes] = useState<
    { nombre: string; codigo: string }[]
  >([]);
  const [activo, setActivo] = useState<"todos" | "favoritos">("todos");
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<Filtros>({
    especie: [],
    genero: [],
    estado: [],
  });

  // Fetch inicial (podes cambiar si queres traer más páginas en paralelo)
  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character?page=1")
      .then((res) => res.json())
      .then((data) => {
        setCharactersLeft(data.results || []);
        setCharactersRight(data.results || []);
      });
  }, []);

  useEffect(() => {
    setPageLeft(1);
    setPageRight(1);
  }, [activo, filters, searchText]);

  // Fetch episodios del personaje seleccionado
  useEffect(() => {
    if (selectedCharacter) {
      Promise.all(
        selectedCharacter.episode.map((epUrl) =>
          fetch(epUrl)
            .then((res) => res.json())
            .then((ep) => ({ nombre: ep.name, codigo: ep.episode }))
        )
      ).then(setEpisodes);
    }
  }, [selectedCharacter]);

  // Filtro global (se aplica sobre cada listado)
  const applyFilters = (chars: Character[]) =>
    chars
      .filter((char) =>
        char.name.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((char) => {
        const matchEspecie =
          filters.especie.length === 0 ||
          filters.especie.includes(char.species);
        const matchGenero =
          filters.genero.length === 0 || filters.genero.includes(char.gender);
        const matchEstado =
          filters.estado.length === 0 || filters.estado.includes(char.status);
        return matchEspecie && matchGenero && matchEstado;
      })
      .filter((char) =>
        activo === "favoritos" ? favoritos.some((f) => f.id === char.id) : true
      );

  const filteredLeft = applyFilters(charactersLeft);
  const filteredRight = applyFilters(charactersRight);

  // Paginación local de 3 por página
  const paginatedLeft = filteredLeft.slice(
    (pageLeft - 1) * ITEMS_PER_PAGE,
    pageLeft * ITEMS_PER_PAGE
  );
  const paginatedRight = filteredRight.slice(
    (pageRight - 1) * ITEMS_PER_PAGE,
    pageRight * ITEMS_PER_PAGE
  );

  const totalPagesLeft = Math.ceil(filteredLeft.length / ITEMS_PER_PAGE);
  const totalPagesRight = Math.ceil(filteredRight.length / ITEMS_PER_PAGE);

  const removeFiltro = (tipo: keyof Filtros, valor: string) => {
    setFilters((prev) => ({
      ...prev,
      [tipo]: prev[tipo].filter((v) => v !== valor),
    }));
  };

  return (
    <div className="p-6 w-full xl:w-10/12 2xl:w-9/12 m-auto">
      {/* Tabs + filtros */}
      <div className="flex items-center justify-between mx-auto mb-6">
        <div className="flex gap-20">
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
          {/* Filtros aplicados */}
          <div className="hidden md:flex flex-wrap justify-between items-start gap-4 mt-3">
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
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-10 h-10 rounded-full bg-white shadow border border-gray-300 flex items-center justify-center"
        >
          <SlidersHorizontalIcon className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="md:hidden flex flex-wrap justify-between items-start gap-4 my-3">
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

      {/* Grid con 2 listados */}
      {filteredLeft.length === 0 && filteredRight.length === 0 ? (
        <div className="text-center py-12 text-gray-600 font-semibold">
          {" "}
          No hay personajes para mostrar.{" "}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold">Personaje #1</h2>
              {/* Flecha izquierda */}
              {filteredLeft.length > 0 && (
                <div className="flex items-center gap-3">
                  {/* Flecha izquierda */}
                  <button
                    disabled={pageLeft === 1}
                    onClick={() => setPageLeft((p) => p - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full disabled:opacity-20 hover:bg-[#B6DA8B] transition-colors duration-500"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Indicador de página */}
                  <span className="text-sm font-semibold">
                    {pageLeft} / {totalPagesLeft || 1}
                  </span>

                  {/* Flecha derecha */}
                  <button
                    disabled={pageLeft === totalPagesLeft}
                    onClick={() => setPageLeft((p) => p + 1)}
                    className="p-2 mr-5 bg-gray-200 rounded-full disabled:opacity-20 hover:bg-[#B6DA8B] transition-colors duration-500"
                    aria-label="Página siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <div>
                {paginatedLeft.map((char) => (
                  <div
                    key={char.id}
                    className={`relative mb-4 rounded-lg transition max-w-[31.75rem] ${
                      selectedLeftCard === char.id
                        ? "shadow-[0_0_15px_4px_rgba(34,197,94,0.7)]"
                        : ""
                    }`}
                    onMouseLeave={() => setOverlayLeftCard(null)}
                  >
                    <Tarjeta
                      character={char}
                      esFavorito={favoritos.some((f) => f.id === char.id)}
                      onClick={() =>
                        setOverlayLeftCard(
                          overlayLeftCard === char.id ? null : char.id
                        )
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
                          })
                        )
                      }
                    />

                    <div
                      className={`absolute inset-0 flex items-center justify-center gap-4 rounded-lg max-w-[31.75rem] 
    bg-black transition-opacity duration-300 ease-in-out
    ${
      overlayLeftCard === char.id
        ? "opacity-100 bg-opacity-60 pointer-events-auto"
        : "opacity-0 bg-opacity-0 pointer-events-none"
    }`}
                    >
                      <button
                        onClick={() => setSelectedCharacter(char)}
                        className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold shadow hover:bg-gray-300 transition"
                      >
                        Detalle
                      </button>

                      {selectedLeftCard === char.id ? (
                        <button
                          onClick={() => setSelectedLeftCard(null)}
                          className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-red-700 transition"
                        >
                          Deseleccionar
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedLeftCard(char.id)}
                          className="bg-[#B6DA8B] text-[#354E18] px-4 py-2 rounded-full font-semibold shadow hover:bg-[#354E18] hover:text-[#B6DA8B] transition"
                        >
                          Seleccionar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold">Personaje #2</h2>

              {/* Flecha izquierda */}
              {filteredRight.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    disabled={pageRight === 1}
                    onClick={() => setPageRight((p) => p - 1)}
                    className="p-2 bg-gray-200 rounded-full disabled:opacity-20 hover:bg-[#B6DA8B] transition-colors duration-500"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-sm font-semibold">
                    {pageRight} / {totalPagesRight || 1}
                  </span>

                  {/* Flecha derecha */}
                  <button
                    disabled={pageRight === totalPagesRight}
                    onClick={() => setPageRight((p) => p + 1)}
                    className="p-2 mr-5 bg-gray-200 rounded-full disabled:opacity-20 hover:bg-[#B6DA8B] transition-colors duration-500"
                    aria-label="Página siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <div>
                {paginatedRight.map((char) => (
                  <div
                    key={char.id}
                    className={`relative mb-4 rounded-lg transition max-w-[31.75rem] ${
                      selectedRightCard === char.id
                        ? "shadow-[0_0_15px_4px_rgba(34,197,94,0.7)]"
                        : ""
                    }`}
                    onMouseLeave={() => setOverlayRightCard(null)}
                  >
                    <Tarjeta
                      character={char}
                      esFavorito={favoritos.some((f) => f.id === char.id)}
                      onClick={() =>
                        setOverlayRightCard(
                          overlayRightCard === char.id ? null : char.id
                        )
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
                          })
                        )
                      }
                    />

                    <div
                      className={`absolute inset-0 flex items-center justify-center gap-4 rounded-lg max-w-[31.75rem] 
    bg-black transition-opacity duration-300 ease-in-out
    ${
      overlayRightCard === char.id
        ? "opacity-100 bg-opacity-60 pointer-events-auto"
        : "opacity-0 bg-opacity-0 pointer-events-none"
    }`}
                    >
                      <button
                        onClick={() => setSelectedCharacter(char)}
                        className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold shadow hover:bg-gray-300 transition"
                      >
                        Detalle
                      </button>

                      {selectedRightCard === char.id ? (
                        <button
                          onClick={() => setSelectedRightCard(null)}
                          className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-red-700 transition"
                        >
                          Deseleccionar
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedRightCard(char.id)}
                          className="bg-[#B6DA8B] text-[#354E18] px-4 py-2 rounded-full font-semibold shadow hover:bg-[#354E18] hover:text-[#B6DA8B] transition"
                        >
                          Seleccionar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
        onAplicar={(f: Filtros) => {
          setFilters(f);
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default CharacterList;
