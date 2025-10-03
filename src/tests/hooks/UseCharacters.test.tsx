import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "@/store/favoritesSlice";
import searchReducer from "@/store/searchSlice";
import { useCharacters, type Character } from "@/hooks/useCharacters";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock de fetch
global.fetch = vi.fn();

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

    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      json: async () => ({
        info: { next: null },
        results: mockCharacters,
      }),
    });

    const { result } = renderHook(() => useCharacters(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.charactersLeft).toHaveLength(2);
    expect(result.current.charactersRight).toHaveLength(2);
  });

  it("maneja error en fetch inicial", async () => {
    (fetch as unknown as vi.Mock).mockRejectedValueOnce(
      new Error("network error")
    );

    const { result } = renderHook(() => useCharacters(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.charactersLeft).toEqual([]);
    expect(result.current.charactersRight).toEqual([]);
  });

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
      .mockResolvedValueOnce({
        json: async () => ({
          info: { next: null },
          results: [mockCharacter],
        }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ name: "Pilot", episode: "S01E01" }),
      });

    const { result } = renderHook(() => useCharacters(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSelectedCharacter(mockCharacter);
    });

    await waitFor(() => {
      expect(result.current.episodes).toEqual([
        { nombre: "Pilot", codigo: "S01E01" },
      ]);
    });
  });

  it("elimina un filtro con removeFiltro", () => {
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
      .mockResolvedValueOnce({
        json: async () => ({ info: { next: null }, results: [mockCharacter] }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ name: "Pilot", episode: "S01E01" }),
      });

    const { result } = renderHook(() => useCharacters(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSelectedLeftCard(1);
    });

    await waitFor(() => {
      expect(result.current.episodesLeft).toEqual([
        { nombre: "Pilot", codigo: "S01E01" },
      ]);
    });
  });

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
      .mockResolvedValueOnce({
        json: async () => ({ info: { next: null }, results: [mockCharacter] }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ name: "Lawnmower Dog", episode: "S01E02" }),
      });

    const { result } = renderHook(() => useCharacters(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSelectedRightCard(2);
    });

    await waitFor(() => {
      expect(result.current.episodesRight).toEqual([
        { nombre: "Lawnmower Dog", codigo: "S01E02" },
      ]);
    });
  });

  it("resetea páginas al cambiar filtros", async () => {
    (fetch as unknown as vi.Mock).mockResolvedValueOnce({
      json: async () => ({ info: { next: null }, results: [] }),
    });

    const { result } = renderHook(() => useCharacters(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setPageLeft(3);
      result.current.setPageRight(2);
    });

    act(() => {
      result.current.setFilters({ especie: ["Alien"], estado: [], genero: [] });
    });

    expect(result.current.pageLeft).toBe(1);
    expect(result.current.pageRight).toBe(1);
  });
});
