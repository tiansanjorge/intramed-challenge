import { describe, it, expect } from "vitest";
import reducer, {
  toggleFavorite,
  clearFavorites,
  type Favorite,
} from "@/store/favoritesSlice";

const mockFavorite: Favorite = {
  id: 1,
  nombre: "Rick",
  especie: "Human",
  imagen: "/rick.png",
  ubicacion: "Earth",
  origen: "Earth",
  estado: "Vivo",
};

describe("favoritesSlice", () => {
  it("debe retornar el estado inicial", () => {
    expect(reducer(undefined, { type: "" })).toEqual([]);
  });

  it("agrega un favorito cuando no existe", () => {
    const state = reducer([], toggleFavorite(mockFavorite));
    expect(state).toEqual([mockFavorite]);
  });

  it("elimina un favorito cuando ya existe", () => {
    const state = reducer([mockFavorite], toggleFavorite(mockFavorite));
    expect(state).toEqual([]); // ✅ toggle quita el favorito existente
  });

  it("puede manejar múltiples favoritos", () => {
    const morty: Favorite = {
      id: 2,
      nombre: "Morty",
      especie: "Human",
      imagen: "/morty.png",
      ubicacion: "Earth",
      origen: "Earth",
      estado: "Vivo",
    };

    let state = reducer([], toggleFavorite(mockFavorite));
    state = reducer(state, toggleFavorite(morty));

    expect(state).toHaveLength(2);
    expect(state).toContainEqual(mockFavorite);
    expect(state).toContainEqual(morty);
  });

  it("limpia todos los favoritos con clearFavorites", () => {
    const state = reducer([mockFavorite], clearFavorites());
    expect(state).toEqual([]);
  });
});
