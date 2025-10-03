// src/tests/CharacterList.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CharacterList from "@/components/CharacterList";
import type { Character, Filtros } from "@/hooks/useCharacters";
import { toggleFavorite } from "@/store/favoritesSlice";

vi.mock("@/components/AdvancedFilters", () => ({
  AdvancedFiltersModal: ({ onAplicar }: any) => (
    <button
      onClick={() => onAplicar({ especie: ["Alien"], genero: [], estado: [] })}
    >
      Aplicar filtros
    </button>
  ),
}));

vi.mock("@/components/CharacterDetail", () => ({
  __esModule: true,
  default: ({ nombre, onToggleFavorito }: any) => (
    <div>
      <span>{nombre}</span>
      <button onClick={onToggleFavorito}>Fav</button>
    </div>
  ),
}));

const mockFavorite = {
  id: 1,
  nombre: "Rick Sanchez",
  especie: "Humano",
  imagen: "/rick.png",
  ubicacion: "Citadel",
  origen: "Earth",
  estado: "Vivo" as const, // 👈 asegura que es el literal
};

// 🔹 Personaje mockeado completo
const mockCharacter: Character = {
  id: 1,
  name: "Rick Sanchez",
  species: "Humano",
  image: "/rick.png",
  location: { name: "Citadel", url: "" },
  origin: { name: "Earth", url: "" },
  status: "Alive",
  gender: "Male",
  episode: [],
};

const baseProps = {
  dispatch: vi.fn(),
  favoritos: [],
  searchText: "",
  toggleFavorite,
  loading: false,
  activo: "todos" as const,
  setActivo: vi.fn(),
  filters: { especie: [], genero: [], estado: [] } as Filtros,
  setFilters: vi.fn(),
  removeFiltro: vi.fn(),
  showModal: false,
  setShowModal: vi.fn(),
  selectedCharacter: null,
  setSelectedCharacter: vi.fn(),
  charactersLeft: [] as Character[],
  charactersRight: [] as Character[],
  pageLeft: 1,
  setPageLeft: vi.fn(),
  pageRight: 1,
  setPageRight: vi.fn(),
  selectedLeftCard: null,
  setSelectedLeftCard: vi.fn(),
  selectedRightCard: null,
  setSelectedRightCard: vi.fn(),
  overlayLeftCard: null,
  setOverlayLeftCard: vi.fn(),
  overlayRightCard: null,
  setOverlayRightCard: vi.fn(),
  episodes: [] as { nombre: string; codigo: string }[],
  episodesLeft: [] as { nombre: string; codigo: string }[],
  episodesRight: [] as { nombre: string; codigo: string }[],
  paginatedLeft: [] as Character[],
  paginatedRight: [] as Character[],
  filteredLeft: [] as Character[],
  filteredRight: [] as Character[],
  totalPagesLeft: 1,
  totalPagesRight: 1,
};

describe("CharacterList", () => {
  it("muestra mensaje vacío si no hay personajes", () => {
    render(<CharacterList {...baseProps} />);
    expect(
      screen.getByText(/no hay personajes para mostrar/i)
    ).toBeInTheDocument();
  });

  it("muestra loader cuando loading=true", () => {
    render(<CharacterList {...baseProps} loading={true} />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("abre el modal de filtros al clickear el botón", () => {
    const setShowModal = vi.fn();
    render(<CharacterList {...baseProps} setShowModal={setShowModal} />);

    fireEvent.click(screen.getByRole("button", { name: /abrir filtros/i }));
    expect(setShowModal).toHaveBeenCalledWith(true);
  });

  it("cambia pestaña al presionar 'Favoritos'", () => {
    const setActivo = vi.fn();
    render(<CharacterList {...baseProps} setActivo={setActivo} />);
    fireEvent.click(screen.getByText("Favoritos"));
    expect(setActivo).toHaveBeenCalledWith("favoritos");
  });

  it("renderiza columnas cuando hay personajes filtrados", () => {
    const filteredLeft = [mockCharacter];
    const filteredRight = [{ ...mockCharacter, id: 2, name: "Morty Smith" }];

    render(
      <CharacterList
        {...baseProps}
        filteredLeft={filteredLeft}
        filteredRight={filteredRight}
        paginatedLeft={filteredLeft}
        paginatedRight={filteredRight}
      />
    );

    expect(screen.getByText("Personaje #1")).toBeInTheDocument();
    expect(screen.getByText("Personaje #2")).toBeInTheDocument();
  });

  it("muestra chips de filtros aplicados y permite quitarlos", () => {
    const removeFiltro = vi.fn();
    render(
      <CharacterList
        {...baseProps}
        filters={{ especie: ["Humano"], genero: [], estado: [] }}
        removeFiltro={removeFiltro}
      />
    );

    expect(screen.getByText("Humano")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /quitar filtro/i }));
    expect(removeFiltro).toHaveBeenCalledWith("especie", "Humano");
  });
  it("renderiza Modal detalle cuando selectedCharacter existe", () => {
    render(
      <CharacterList
        {...baseProps}
        selectedCharacter={mockCharacter}
        favoritos={[mockFavorite]}
        episodes={[{ nombre: "Pilot", codigo: "S01E01" }]}
      />
    );

    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Fav"));
    expect(baseProps.dispatch).toHaveBeenCalled();
  });

  it("ejecuta setFilters y setShowModal al aplicar filtros en AdvancedFiltersModal", () => {
    const setFilters = vi.fn();
    const setShowModal = vi.fn();

    render(
      <CharacterList
        {...baseProps}
        showModal={true}
        setFilters={setFilters}
        setShowModal={setShowModal}
      />
    );

    fireEvent.click(screen.getByText("Aplicar filtros"));

    expect(setFilters).toHaveBeenCalledWith({
      especie: ["Alien"],
      genero: [],
      estado: [],
    });
    expect(setShowModal).toHaveBeenCalledWith(false);
  });
});
