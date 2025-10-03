import { describe, it, expect } from "vitest";
import { store, persistor } from "@/store";
import { setSearchText } from "@/store/searchSlice";
import { toggleFavorite, type Favorite } from "@/store/favoritesSlice";

describe("Redux Store", () => {
  it("crea el store con el estado inicial esperado", () => {
    const state = store.getState();
    expect(state.search.searchText).toBe("");
    expect(state.favorites).toEqual([]);
  });

  it("actualiza el searchText correctamente", () => {
    store.dispatch(setSearchText("Rick"));
    const state = store.getState();
    expect(state.search.searchText).toBe("Rick");
  });

  it("agrega y elimina favoritos correctamente", () => {
    const character: Favorite = {
      id: 1,
      nombre: "Rick",
      especie: "Human",
      imagen: "/rick.png",
      ubicacion: "Earth",
      origen: "Earth",
      estado: "Vivo", // 👈 literal correcto
    };

    // Agregar
    store.dispatch(toggleFavorite(character));
    let state = store.getState();
    expect(state.favorites).toContainEqual(character);

    // Quitar
    store.dispatch(toggleFavorite(character));
    state = store.getState();
    expect(state.favorites).not.toContainEqual(character);
  });

  it("existe el persistor y tiene las funciones básicas", () => {
    expect(persistor).toBeDefined();
    expect(typeof persistor.persist).toBe("function");
    expect(typeof persistor.flush).toBe("function");
  });
});
