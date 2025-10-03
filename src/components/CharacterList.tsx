"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontalIcon } from "lucide-react";
import { Modal } from "@/components/Modal";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "@/store/favoritesSlice";
import { resetSearch } from "@/store/searchSlice";
import type { RootState } from "@/store";
import { AdvancedFiltersModal } from "@/components/AdvancedFilters";
import { Tarjeta } from "./Tarjeta";
import CharacterDetail from "./CharacterDetail";

type Character = {
  id: number;
  name: string;
  species: "Human" | "Alien";
  image: string;
  location: { name: string; url: string };
  origin: { name: string; url: string };
  status: "Alive" | "Dead" | "unknown";
  gender: "Male" | "Female" | "unknown";
  episode: string[];
};

type Filtros = { especie: string[]; estado: string[]; genero: string[] };

const CharacterList = () => {
  const dispatch = useDispatch();

  // 🔥 obtenemos Redux states
  const favoritos = useSelector((state: RootState) => state.favorites);
  const searchText = useSelector((state: RootState) => state.search.searchText);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
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

  // Fetch personajes
  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character")
      .then((res) => res.json())
      .then((data) => setCharacters(data.results));
  }, []);

  // Fetch episodios de un personaje
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

  // Filtros aplicados
  const filteredCharacters = characters
    .filter((char) =>
      char.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((char) => {
      const matchEspecie =
        filters.especie.length === 0 || filters.especie.includes(char.species);
      const matchGenero =
        filters.genero.length === 0 || filters.genero.includes(char.gender);
      const matchEstado =
        filters.estado.length === 0 || filters.estado.includes(char.status);
      return matchEspecie && matchGenero && matchEstado;
    })
    .filter((char) =>
      activo === "favoritos" ? favoritos.some((f) => f.id === char.id) : true
    );

  const removeFiltro = (tipo: keyof Filtros, valor: string) => {
    setFilters((prev) => ({
      ...prev,
      [tipo]: prev[tipo].filter((v) => v !== valor),
    }));
  };

  return (
    <>
      <div className="p-6 w-full xl:w-10/12 2xl:w-9/12 m-auto">
        {/* Pestañas & Botón filtros */}
        <div className="flex items-center justify-between mx-auto">
          <div className="flex gap-2 bg-white rounded-full shadow-sm p-1 ">
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

          <button
            onClick={() => setShowModal(true)}
            className="w-10 h-10 rounded-full bg-white shadow border border-gray-300 flex items-center justify-center"
          >
            <SlidersHorizontalIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Filtros aplicados */}
        <div className="flex flex-wrap justify-between items-start gap-4 py-6">
          <div>
            {(filters.especie.length > 0 ||
              filters.genero.length > 0 ||
              filters.estado.length > 0) && (
              <p className="text-sm font-semibold text-gray-800 mb-2">
                Filtros aplicados
              </p>
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
                      <img src="/cross.png" alt="Cerrar" className="w-4 h-4" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="text-sm text-gray-700 font-semibold whitespace-nowrap">
            {filteredCharacters.length} personajes
          </div>
        </div>

        {/* Lista de personajes */}
        {filteredCharacters.length === 0 ? (
          <div className="text-center py-12">
            {activo === "favoritos" && favoritos.length === 0 ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Sin favoritos
                </h2>
                <p className="font-semibold text-gray-600 mb-6">
                  Aún no marcaste ningún personaje como favorito.
                </p>
                <button
                  onClick={() => setActivo("todos")}
                  className="bg-white text-green-900 font-semibold py-2 px-6 rounded-full shadow-sm hover:bg-gray-100 transition"
                >
                  Ver todos los personajes
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Oh no!
                </h2>
                <p className=" font-semibold text-gray-600 mb-6">
                  ¡Pareces perdido en tu viaje!
                </p>
                <button
                  onClick={() => {
                    setFilters({ especie: [], genero: [], estado: [] });
                    setActivo("todos");
                    dispatch(resetSearch());
                    {
                      /* 🔥 usamos Redux */
                    }
                  }}
                  className="bg-white text-green-900 font-semibold py-2 px-6 rounded-full shadow-sm hover:bg-gray-100 transition"
                >
                  Limpiar filtros
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-y-5 justify-between">
            {filteredCharacters.map((char) => (
              <div
                key={char.id}
                className="w-full lg:w-[49%] 2xl:w-[50%] flex justify-center"
              >
                <Tarjeta
                  nombre={char.name}
                  especie={char.species}
                  imagen={char.image}
                  ubicacion={char.location.name}
                  origen={char.origin.name}
                  estado={
                    char.status === "Alive"
                      ? "Vivo"
                      : char.status === "Dead"
                      ? "Muerto"
                      : "Desconocido"
                  }
                  esFavorito={favoritos.some((f) => f.id === char.id)}
                  onClick={() => setSelectedCharacter(char)}
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
              </div>
            ))}
          </div>
        )}
      </div>

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

      <AdvancedFiltersModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        valoresIniciales={filters}
        onAplicar={(f: Filtros) => {
          setFilters(f);
          setShowModal(false);
        }}
      />
    </>
  );
};

export default CharacterList;
