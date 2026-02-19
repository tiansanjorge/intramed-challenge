import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "@/store/favoritesSlice";
import searchReducer from "@/store/searchSlice";
import { useCharacters, type Character } from "@/hooks/useCharacters";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock de fetch
global.fetch = vi.fn();

// Mock de episodios reutilizable
const mockAllEpisodes = [
  {
    id: 1,
    name: "Pilot",
    air_date: "December 2, 2013",
    episode: "S01E01",
    characters: [
      "https://rickandmortyapi.com/api/character/1",
      "https://rickandmortyapi.com/api/character/3",
    ],
    url: "https://rickandmortyapi.com/api/episode/1",
    created: "2017-11-10T12:56:33.798Z",
  },
  {
    id: 2,
    name: "Lawnmower Dog",
    air_date: "December 9, 2013",
    episode: "S01E02",
    characters: [
      "https://rickandmortyapi.com/api/character/2",
      "https://rickandmortyapi.com/api/character/3",
    ],
    url: "https://rickandmortyapi.com/api/episode/2",
    created: "2017-11-10T12:56:33.916Z",
  },
];

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = configureStore({
    reducer: {
      favorites: favoritesReducer,
      search: searchReducer,
    },
  });
  return <Provider store={store}>{children}</Provider>;
};

describe("useCharacters", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("carga personajes correctamente", async () => {
    const mockCharacters = [
      {
        id: 1,
        name: "Rick Sanchez",
        species: "Human",
        image: "/rick.png",
        location: { name: "Earth", url: "" },
        origin: { name: "Earth", url: "" },
        status: "Alive",
        gender: "Male",
        episode: ["/episode/1"],
      },
      {
        id: 2,
        name: "Morty Smith",
        species: "Human",
        image: "/morty.png",
        location: { name: "Earth", url: "" },
        origin: { name: "Earth", url: "" },
        status: "Alive",
        gender: "Male",
        episode: ["/episode/2"],
      },
    ] as const satisfies Character[];

    (fetch as unknown as vi.Mock)
      // Mock para fetchAllEpisodes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { count: 2, pages: 1, next: null, prev: null },
          results: mockAllEpisodes,
        }),
      })
      // Mock para fetchCharactersPage (página 1)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { pages: 1, next: null },
          results: mockCharacters,
        }),
      })
      // Mock para fetchCharactersPage (página 2)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { pages: 1, next: null },
          results: [],
        }),
      })
      // Mock para fetchCharactersPage (página 3)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { pages: 1, next: null },
          results: [],
        }),
      });

    const { result } = renderHook(() => useCharacters(), { wrapper });

    //Esperar a que termine el debouncing (500ms) y se carguen los personajes
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
        expect(result.current.charactersLeft.length).toBeGreaterThan(0);
      },
      { timeout: 2000 },
    );

    expect(result.current.charactersLeft).toHaveLength(2);
    expect(result.current.charactersRight).toHaveLength(2);
  }, 3000);

  it("maneja error en fetch inicial", async () => {
    (fetch as unknown as vi.Mock)
      // Mock para fetchAllEpisodes - error
      .mockRejectedValueOnce(new Error("network error"))
      // Mock para fetchCharactersPage (página 1) - también error
      .mockRejectedValueOnce(new Error("network error"))
      // Mock para fetchCharactersPage (página 2)
      .mockRejectedValueOnce(new Error("network error"))
      // Mock para fetchCharactersPage (página 3)
      .mockRejectedValueOnce(new Error("network error"));

    const { result } = renderHook(() => useCharacters(), { wrapper });

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 2000 },
    );

    expect(result.current.charactersLeft).toEqual([]);
    expect(result.current.charactersRight).toEqual([]);
  }, 3000);

  it("setea personaje seleccionado y carga episodios", async () => {
    const mockCharacter = {
      id: 1,
      name: "Rick Sanchez",
      species: "Human",
      image: "/rick.png",
      location: { name: "Earth", url: "" },
      origin: { name: "Earth", url: "" },
      status: "Alive",
      gender: "Male",
      episode: ["/episode/1"],
    } as const satisfies Character;

    (fetch as unknown as vi.Mock)
      // Mock para fetchAllEpisodes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { count: 2, pages: 1, next: null, prev: null },
          results: mockAllEpisodes,
        }),
      })
      // Mock para fetchCharactersPage (página 1)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { pages: 1, next: null },
          results: [mockCharacter],
        }),
      })
      // Mock para fetchCharactersPage (página 2)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { pages: 1, next: null },
          results: [],
        }),
      })
      // Mock para fetchCharactersPage (página 3)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { pages: 1, next: null },
          results: [],
        }),
      });

    const { result } = renderHook(() => useCharacters(), { wrapper });

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 2000 },
    );

    act(() => {
      result.current.setSelectedCharacter(mockCharacter);
    });

    await waitFor(
      () => {
        expect(result.current.episodes).toEqual([
          { nombre: "Pilot", codigo: "S01E01" },
        ]);
      },
      { timeout: 1000 },
    );
  }, 4000);

  it("elimina un filtro con removeFiltro", async () => {
    (fetch as unknown as vi.Mock)
      // Mock para fetchAllEpisodes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { count: 2, pages: 1, next: null, prev: null },
          results: mockAllEpisodes,
        }),
      });

    const { result } = renderHook(() => useCharacters(), { wrapper });

    act(() => {
      result.current.setFilters({ especie: ["Human"], estado: [], genero: [] });
    });

    act(() => {
      result.current.removeFiltro("especie", "Human");
    });

    expect(result.current.filters.especie).toHaveLength(0);
  });

  it("carga episodios cuando se selecciona un personaje a la izquierda", async () => {
    const mockCharacter = {
      id: 1,
      name: "Rick Sanchez",
      species: "Human",
      image: "/rick.png",
      location: { name: "Earth", url: "" },
      origin: { name: "Earth", url: "" },
      status: "Alive",
      gender: "Male",
      episode: ["/episode/1"],
    } as Character;

    (fetch as unknown as vi.Mock)
      // Mock para fetchAllEpisodes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { count: 2, pages: 1, next: null, prev: null },
          results: mockAllEpisodes,
        }),
      })
      // Mock para fetchCharactersPage (página 1)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { pages: 1, next: null },
          results: [mockCharacter],
        }),
      })
      // Mock para fetchCharactersPage (página 2)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ info: { pages: 1, next: null }, results: [] }),
      })
      // Mock para fetchCharactersPage (página 3)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ info: { pages: 1, next: null }, results: [] }),
      });

    const { result } = renderHook(() => useCharacters(), { wrapper });

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 2000 },
    );

    act(() => {
      result.current.setSelectedLeftCard(1);
    });

    await waitFor(
      () => {
        expect(result.current.episodesLeft).toEqual([
          { nombre: "Pilot", codigo: "S01E01" },
        ]);
      },
      { timeout: 1000 },
    );
  }, 4000);

  it("carga episodios cuando se selecciona un personaje a la derecha", async () => {
    const mockCharacter = {
      id: 2,
      name: "Morty Smith",
      species: "Human",
      image: "/morty.png",
      location: { name: "Earth", url: "" },
      origin: { name: "Earth", url: "" },
      status: "Alive",
      gender: "Male",
      episode: ["/episode/2"],
    } as Character;

    (fetch as unknown as vi.Mock)
      // Mock para fetchAllEpisodes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { count: 2, pages: 1, next: null, prev: null },
          results: mockAllEpisodes,
        }),
      })
      // Mock para fetchCharactersPage (página 1)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { pages: 1, next: null },
          results: [mockCharacter],
        }),
      })
      // Mock para fetchCharactersPage (página 2)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ info: { pages: 1, next: null }, results: [] }),
      })
      // Mock para fetchCharactersPage (página 3)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ info: { pages: 1, next: null }, results: [] }),
      });

    const { result } = renderHook(() => useCharacters(), { wrapper });

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 2000 },
    );

    act(() => {
      result.current.setSelectedRightCard(2);
    });

    await waitFor(
      () => {
        expect(result.current.episodesRight).toEqual([
          { nombre: "Lawnmower Dog", codigo: "S01E02" },
        ]);
      },
      { timeout: 1000 },
    );
  }, 4000);

  it("resetea páginas al cambiar filtros", async () => {
    (fetch as unknown as vi.Mock)
      // Mock para fetchAllEpisodes
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          info: { count: 2, pages: 1, next: null, prev: null },
          results: mockAllEpisodes,
        }),
      })
      // Mock para fetchCharactersPage (página 1)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ info: { pages: 1, next: null }, results: [] }),
      })
      // Mock para fetchCharactersPage (página 2)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ info: { pages: 1, next: null }, results: [] }),
      })
      // Mock para fetchCharactersPage (página 3)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ info: { pages: 1, next: null }, results: [] }),
      });

    const { result } = renderHook(() => useCharacters(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false), {
      timeout: 2000,
    });

    act(() => {
      result.current.setPageLeft(3);
      result.current.setPageRight(2);
    });

    act(() => {
      result.current.setFilters({ especie: ["Alien"], estado: [], genero: [] });
    });

    expect(result.current.pageLeft).toBe(1);
    expect(result.current.pageRight).toBe(1);
  }, 3000);
});
