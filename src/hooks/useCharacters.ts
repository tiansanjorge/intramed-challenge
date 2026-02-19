import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "@/store/favoritesSlice";
import type { RootState } from "@/store";
import {
  fetchCharactersPage,
  fetchAllEpisodes,
  filterEpisodesByCharacter,
} from "@/services/rickAndMortyApi";
import {
  reverseTranslateStatus,
  reverseTranslateGender,
  reverseTranslateSpecies,
} from "@/utils/translations";

export type EpisodeData = {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
};

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
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [pageLeft, setPageLeft] = useState(1);
  const [pageRight, setPageRight] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [selectedLeftCard, setSelectedLeftCard] = useState<number | null>(null);
  const [selectedRightCard, setSelectedRightCard] = useState<number | null>(
    null,
  );
  const [overlayLeftCard, setOverlayLeftCard] = useState<number | null>(null);
  const [overlayRightCard, setOverlayRightCard] = useState<number | null>(null);

  // Caché global de todos los episodios
  const [allEpisodes, setAllEpisodes] = useState<EpisodeData[]>([]);
  const [loadingAllEpisodes, setLoadingAllEpisodes] = useState(false);

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

  // Refs para abort controller
  const abortControllerRef = useRef<AbortController | null>(null);

  // --- Cargar todos los episodios al inicio (una sola vez) ---
  useEffect(() => {
    setLoadingAllEpisodes(true);
    fetchAllEpisodes()
      .then(setAllEpisodes)
      .catch((error) => {
        console.error("❌ Error cargando episodios:", error);
      })
      .finally(() => setLoadingAllEpisodes(false));
  }, []);

  // --- Fetch de personajes (solo las primeras 3 páginas = 60 personajes) ---
  const fetchCharacters = useCallback(async () => {
    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      // Cargar solo las primeras 3 páginas (60 personajes)
      // Sin filtros de la API - traemos los primeros 60 personajes
      const pagesToFetch = 3;
      const promises = [];

      for (let i = 1; i <= pagesToFetch; i++) {
        promises.push(fetchCharactersPage(i));
      }

      const results = await Promise.all(promises);

      // Combinar todos los resultados
      const allChars = results.flatMap((r) => r.results);

      // Filtrar personaje que rompe el diseño
      const filteredChars = allChars.filter(
        (char) => char.name !== "Ants in my Eyes Johnson",
      );

      // Setear los datos una sola vez
      setAllCharacters(filteredChars);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name !== "AbortError") {
          console.error("❌ Error cargando personajes:", err);
          setError(err.message);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Fetch con debouncing para búsqueda ---
  useEffect(() => {
    // Cargar todos los personajes una sola vez al montar el componente
    fetchCharacters();
  }, [fetchCharacters]);

  // Reset de páginas cuando cambian filtros o tab activo
  useEffect(() => {
    setPageLeft(1);
    setPageRight(1);
  }, [activo, filters, searchText]);

  // --- Fetch episodios del personaje seleccionado ---
  useEffect(() => {
    if (selectedCharacter && allEpisodes.length > 0) {
      // Filtrar episodios localmente en lugar de hacer peticiones HTTP
      const filteredEpisodes = filterEpisodesByCharacter(
        allEpisodes,
        selectedCharacter.id,
      );
      setEpisodes(filteredEpisodes);
    } else {
      setEpisodes([]);
    }
  }, [selectedCharacter, allEpisodes]);

  // --- Filtro local para favoritos ---
  const applyFavoritesFilter = (chars: Character[]) => {
    if (activo === "favoritos") {
      return chars.filter((char) => favoritos.some((f) => f.id === char.id));
    }
    return chars;
  };

  // Aplicar filtros locales (especies, géneros, estados y búsqueda por nombre)
  const applyMultipleFilters = (chars: Character[]) => {
    return chars.filter((char) => {
      // Filtros de especie (traducir de español a inglés para comparar)
      if (filters.especie.length > 0) {
        const especiesEnIngles = filters.especie.map(reverseTranslateSpecies);
        if (!especiesEnIngles.includes(char.species)) return false;
      }
      // Filtros de género (traducir de español a inglés para comparar)
      if (filters.genero.length > 0) {
        const generosEnIngles = filters.genero.map(reverseTranslateGender);
        if (!generosEnIngles.includes(char.gender)) return false;
      }
      // Filtros de estado (traducir de español a inglés para comparar)
      if (filters.estado.length > 0) {
        const estadosEnIngles = filters.estado.map(reverseTranslateStatus);
        if (!estadosEnIngles.includes(char.status)) return false;
      }
      // Búsqueda por nombre (case-insensitive)
      if (searchText.trim()) {
        const searchLower = searchText.trim().toLowerCase();
        if (!char.name.toLowerCase().includes(searchLower)) return false;
      }
      return true;
    });
  };

  const filteredCharacters = applyMultipleFilters(
    applyFavoritesFilter(allCharacters),
  );

  // --- Paginación local (3 personajes por página) ---
  // Ambas columnas comparten los mismos datos pero con paginación independiente
  const paginatedLeft = filteredCharacters.slice(
    (pageLeft - 1) * ITEMS_PER_PAGE,
    pageLeft * ITEMS_PER_PAGE,
  );
  const paginatedRight = filteredCharacters.slice(
    (pageRight - 1) * ITEMS_PER_PAGE,
    pageRight * ITEMS_PER_PAGE,
  );

  const totalPages = Math.ceil(filteredCharacters.length / ITEMS_PER_PAGE);

  // Para compatibilidad con el componente existente
  const filteredLeft = filteredCharacters;
  const filteredRight = filteredCharacters;
  const charactersLeft = paginatedLeft;
  const charactersRight = paginatedRight;
  const totalPagesLeft = totalPages;
  const totalPagesRight = totalPages;

  // --- Manejo de filtros ---
  const removeFiltro = (tipo: keyof Filtros, valor: string) => {
    setFilters((prev) => ({
      ...prev,
      [tipo]: prev[tipo].filter((v) => v !== valor),
    }));
  };

  // Cuando se selecciona un personaje en la izquierda
  useEffect(() => {
    if (selectedLeftCard && allEpisodes.length > 0) {
      // Filtrar episodios localmente en lugar de hacer peticiones HTTP
      const filteredEpisodes = filterEpisodesByCharacter(
        allEpisodes,
        selectedLeftCard,
      );
      setEpisodesLeft(filteredEpisodes);
    } else {
      setEpisodesLeft([]);
    }
  }, [selectedLeftCard, allEpisodes]);

  // Cuando se selecciona un personaje en la derecha
  useEffect(() => {
    if (selectedRightCard && allEpisodes.length > 0) {
      // Filtrar episodios localmente en lugar de hacer peticiones HTTP
      const filteredEpisodes = filterEpisodesByCharacter(
        allEpisodes,
        selectedRightCard,
      );
      setEpisodesRight(filteredEpisodes);
    } else {
      setEpisodesRight([]);
    }
  }, [selectedRightCard, allEpisodes]);

  return {
    // Redux
    favoritos,
    searchText,
    dispatch,

    // States
    allCharacters,
    charactersLeft,
    charactersRight,
    pageLeft,
    setPageLeft,
    pageRight,
    setPageRight,
    loading,
    error,

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
    loadingEpisodes: loadingAllEpisodes,
    loadingEpisodesLeft: false,
    loadingEpisodesRight: false,
    progressEpisodes: { loaded: 0, total: 0 },
    progressLeft: { loaded: 0, total: 0 },
    progressRight: { loaded: 0, total: 0 },

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
