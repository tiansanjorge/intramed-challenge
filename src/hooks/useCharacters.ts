import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "@/store/favoritesSlice";
import type { RootState } from "@/store";

export type Character = {
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

export type Filtros = { especie: string[]; estado: string[]; genero: string[] };

const ITEMS_PER_PAGE = 3;

export const useCharacters = () => {
  const dispatch = useDispatch();
  const favoritos = useSelector((state: RootState) => state.favorites);
  const searchText = useSelector((state: RootState) => state.search.searchText);

  // --- States principales ---
  const [charactersLeft, setCharactersLeft] = useState<Character[]>([]);
  const [charactersRight, setCharactersRight] = useState<Character[]>([]);
  const [pageLeft, setPageLeft] = useState(1);
  const [pageRight, setPageRight] = useState(1);
  const [loading, setLoading] = useState(true);

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
  const [episodesLeft, setEpisodesLeft] = useState<
    { nombre: string; codigo: string }[]
  >([]);
  const [episodesRight, setEpisodesRight] = useState<
    { nombre: string; codigo: string }[]
  >([]);

  const [activo, setActivo] = useState<"todos" | "favoritos">("todos");
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<Filtros>({
    especie: [],
    genero: [],
    estado: [],
  });

  // --- Fetch inicial ---
  useEffect(() => {
    const fetchAllCharacters = async () => {
      setLoading(true);
      try {
        let allCharacters: Character[] = [];
        let nextUrl: string | null =
          "https://rickandmortyapi.com/api/character?page=1";

        while (nextUrl) {
          const res: Response = await fetch(nextUrl);
          const data: { info: { next: string | null }; results: Character[] } =
            await res.json();

          allCharacters = [...allCharacters, ...data.results];
          nextUrl = data.info.next;
        }

        setCharactersLeft(allCharacters);
        setCharactersRight(allCharacters);
      } catch (err) {
        console.error("❌ Error cargando personajes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCharacters();
  }, []);

  // Reset de páginas cuando cambian filtros o tab activo
  useEffect(() => {
    setPageLeft(1);
    setPageRight(1);
  }, [activo, filters, searchText]);

  // --- Fetch episodios del personaje seleccionado ---
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

  // --- Función de filtros globales ---
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

  // --- Paginación local ---
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

  // --- Manejo de filtros ---
  const removeFiltro = (tipo: keyof Filtros, valor: string) => {
    setFilters((prev) => ({
      ...prev,
      [tipo]: prev[tipo].filter((v) => v !== valor),
    }));
  };

  // Cuando se selecciona un personaje en la izquierda
  useEffect(() => {
    if (selectedLeftCard) {
      const char = charactersLeft.find((c) => c.id === selectedLeftCard);
      if (char) {
        Promise.all(
          char.episode.map((epUrl) =>
            fetch(epUrl)
              .then((res) => res.json())
              .then((ep) => ({ nombre: ep.name, codigo: ep.episode }))
          )
        ).then(setEpisodesLeft);
      }
    } else {
      setEpisodesLeft([]);
    }
  }, [selectedLeftCard, charactersLeft]);

  // Cuando se selecciona un personaje en la derecha
  useEffect(() => {
    if (selectedRightCard) {
      const char = charactersRight.find((c) => c.id === selectedRightCard);
      if (char) {
        Promise.all(
          char.episode.map((epUrl) =>
            fetch(epUrl)
              .then((res) => res.json())
              .then((ep) => ({ nombre: ep.name, codigo: ep.episode }))
          )
        ).then(setEpisodesRight);
      }
    } else {
      setEpisodesRight([]);
    }
  }, [selectedRightCard, charactersRight]);

  return {
    // Redux
    favoritos,
    searchText,
    dispatch,

    // States
    charactersLeft,
    charactersRight,
    pageLeft,
    setPageLeft,
    pageRight,
    setPageRight,
    loading,

    selectedCharacter,
    setSelectedCharacter,
    selectedLeftCard,
    setSelectedLeftCard,
    selectedRightCard,
    setSelectedRightCard,
    overlayLeftCard,
    setOverlayLeftCard,
    overlayRightCard,
    setOverlayRightCard,

    episodes,
    episodesLeft,
    episodesRight,

    activo,
    setActivo,
    showModal,
    setShowModal,
    filters,
    setFilters,

    // Derivados
    filteredLeft,
    filteredRight,
    paginatedLeft,
    paginatedRight,
    totalPagesLeft,
    totalPagesRight,

    // Helpers
    removeFiltro,
    toggleFavorite,
  };
};
