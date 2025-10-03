import { describe, it, expect } from "vitest";
import reducer, { setSearchText, resetSearch } from "@/store/searchSlice";

describe("searchSlice", () => {
  it("debe retornar el estado inicial", () => {
    expect(reducer(undefined, { type: "" })).toEqual({ searchText: "" });
  });

  it("debe actualizar el searchText con setSearchText", () => {
    const state = reducer({ searchText: "" }, setSearchText("Rick"));
    expect(state.searchText).toBe("Rick");
  });

  it("debe resetear el searchText con resetSearch", () => {
    const state = reducer({ searchText: "Morty" }, resetSearch());
    expect(state.searchText).toBe("");
  });
});
