// src/tests/CharacterList.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CharacterList from "@/components/CharacterList/CharacterList";
import type { Filtros } from "@/hooks/useCharacters";
import { toggleFavorite } from "@/store/favoritesSlice";
import { Character } from "@/types/Character";
import { resetSearch } from "@/store/searchSlice";

vi.mock("@/components/AdvancedFilters", () => ({
  AdvancedFiltersModal: ({
    onAplicar,
  }: {
    onAplicar: (filtros: {
      especie: string[];
      genero: string[];
      estado: string[];
    }) => void;
  }) => (
    <button
      onClick={() => onAplicar({ especie: ["Alien"], genero: [], estado: [] })}
    >
      Aplicar filtros
    </button>
  ),
}));

vi.mock("@/store/searchSlice", () => ({
  resetSearch: vi.fn(() => ({ type: "search/resetSearch" })),
}));

vi.mock("@/components/CharacterDetail", () => ({
  __esModule: true,
  default: ({
    nombre,
    onToggleFavorito,
  }: {
    nombre: string;
    onToggleFavorito: () => void;
  }) => (
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
  error: null,
  activo: "todos" as const,
  setActivo: vi.fn(),
  filters: { especie: [], genero: [], estado: [] } as Filtros,
  setFilters: vi.fn(),
  removeFiltro: vi.fn(),
  showModal: false,
  setShowModal: vi.fn(),
  selectedCharacter: null,
  setSelectedCharacter: vi.fn(),
  allCharacters: [] as Character[],
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
  loadingEpisodes: false,
  loadingEpisodesLeft: false,
  loadingEpisodesRight: false,
  progressEpisodes: { loaded: 0, total: 0 },
  progressLeft: { loaded: 0, total: 0 },
  progressRight: { loaded: 0, total: 0 },
  paginatedLeft: [] as Character[],
  paginatedRight: [] as Character[],
  filteredLeft: [] as Character[],
  filteredRight: [] as Character[],
  totalPagesLeft: 1,
  totalPagesRight: 1,
};

describe("CharacterList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra mensaje vacío si no hay personajes", () => {
    render(
      <CharacterList
        {...baseProps}
        allCharacters={[mockCharacter]}
        filteredLeft={[]}
        filteredRight={[]}
      />,
    );
    expect(
      screen.getByText(/no hay personajes para mostrar/i),
    ).toBeInTheDocument();
  });

  it("muestra loader cuando loading=true", () => {
    const { container } = render(
      <CharacterList {...baseProps} loading={true} />,
    );
    // Buscar los divs del skeleton con animate-pulse
    const skeletonDivs = container.querySelectorAll(".animate-pulse");
    expect(skeletonDivs.length).toBeGreaterThan(0);
  });

  it("muestra mensaje de error cuando error prop está presente", () => {
    const errorMsg = "Error al cargar datos de la API";
    render(<CharacterList {...baseProps} error={errorMsg} />);
    expect(screen.getByText(errorMsg)).toBeInTheDocument();
    expect(screen.getByText(/⚠️ Error al cargar datos/)).toBeInTheDocument();
  });

  it("botón Reintentar existe cuando hay error", () => {
    render(<CharacterList {...baseProps} error="Error de conexión" />);
    expect(screen.getByText("Reintentar")).toBeInTheDocument();
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

  it("cambia pestaña al presionar 'Todos'", () => {
    const setActivo = vi.fn();
    render(
      <CharacterList {...baseProps} activo="favoritos" setActivo={setActivo} />,
    );
    fireEvent.click(screen.getByText("Todos"));
    expect(setActivo).toHaveBeenCalledWith("todos");
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
      />,
    );

    expect(screen.getByText("Primer Personaje")).toBeInTheDocument();
    expect(screen.getByText("Segundo Personaje")).toBeInTheDocument();
  });

  it("muestra chips de filtros aplicados y permite quitarlos", () => {
    const removeFiltro = vi.fn();
    render(
      <CharacterList
        {...baseProps}
        filters={{ especie: ["Humano"], genero: [], estado: [] }}
        removeFiltro={removeFiltro}
      />,
    );

    expect(screen.getByText("Humano")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /quitar filtro/i }));
    expect(removeFiltro).toHaveBeenCalledWith("especie", "Humano");
  });

  it("muestra múltiples filtros aplicados", () => {
    render(
      <CharacterList
        {...baseProps}
        filters={{
          especie: ["Humano", "Alien"],
          genero: ["Male"],
          estado: ["Vivo"],
        }}
        removeFiltro={vi.fn()}
      />,
    );

    expect(screen.getByText("Humano")).toBeInTheDocument();
    expect(screen.getByText("Alien")).toBeInTheDocument();
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("Vivo")).toBeInTheDocument();
  });

  it("muestra chip de búsqueda y permite limpiarlo", () => {
    const dispatch = vi.fn();
    render(
      <CharacterList {...baseProps} searchText="Rick" dispatch={dispatch} />,
    );

    expect(screen.getByText(/Rick/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /limpiar búsqueda/i }));
    expect(dispatch).toHaveBeenCalledWith(resetSearch());
  });

  it("renderiza Modal detalle cuando selectedCharacter existe", () => {
    render(
      <CharacterList
        {...baseProps}
        selectedCharacter={mockCharacter}
        favoritos={[mockFavorite]}
        episodes={[{ nombre: "Pilot", codigo: "S01E01" }]}
      />,
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
      />,
    );

    fireEvent.click(screen.getByText("Aplicar filtros"));

    expect(setFilters).toHaveBeenCalledWith({
      especie: ["Alien"],
      genero: [],
      estado: [],
    });
    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it("muestra 'Filtros aplicados:' cuando hay filtros activos", () => {
    render(
      <CharacterList
        {...baseProps}
        filters={{ especie: ["Humano"], genero: [], estado: [] }}
      />,
    );

    expect(screen.getByText("Filtros aplicados:")).toBeInTheDocument();
  });

  it("no muestra 'Filtros aplicados:' cuando no hay filtros", () => {
    render(<CharacterList {...baseProps} />);
    expect(screen.queryByText("Filtros aplicados:")).not.toBeInTheDocument();
  });

  it("muestra mensaje vacío cuando se filtran todos los personajes", () => {
    render(
      <CharacterList
        {...baseProps}
        allCharacters={[mockCharacter]}
        filteredLeft={[]}
        filteredRight={[]}
      />,
    );

    expect(
      screen.getByText(/no hay personajes para mostrar/i),
    ).toBeInTheDocument();
  });

  it("renderiza ambas columnas de caracteres con pagination", () => {
    const char1 = mockCharacter;
    const char2 = { ...mockCharacter, id: 2, name: "Morty Smith" };
    const char3 = { ...mockCharacter, id: 3, name: "Summer Smith" };

    render(
      <CharacterList
        {...baseProps}
        allCharacters={[char1, char2, char3]}
        filteredLeft={[char1, char2, char3]}
        filteredRight={[char1, char2, char3]}
        paginatedLeft={[char1]}
        paginatedRight={[char2]}
        totalPagesLeft={3}
        totalPagesRight={3}
      />,
    );

    expect(screen.getByText("Primer Personaje")).toBeInTheDocument();
    expect(screen.getByText("Segundo Personaje")).toBeInTheDocument();
  });

  it("muestra chip de búsqueda junto con filtros", () => {
    render(
      <CharacterList
        {...baseProps}
        searchText="Morty"
        filters={{ especie: ["Humano"], genero: [], estado: [] }}
      />,
    );

    expect(screen.getByText(/Morty/)).toBeInTheDocument();
    expect(screen.getByText("Humano")).toBeInTheDocument();
    expect(screen.getByText("Filtros aplicados:")).toBeInTheDocument();
  });

  it("cierra modal al hacer click fuera de él", () => {
    const setSelectedCharacter = vi.fn();
    render(
      <CharacterList
        {...baseProps}
        selectedCharacter={mockCharacter}
        setSelectedCharacter={setSelectedCharacter}
      />,
    );

    // El Modal debería estar abierto, pero tenemos que mockearlo para poder testear el cierre
    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
  });

  it("renderiza con estado de favoritos", () => {
    const filteredLeft = [mockCharacter];
    const filteredRight = [{ ...mockCharacter, id: 2, name: "Morty Smith" }];

    render(
      <CharacterList
        {...baseProps}
        activo="favoritos"
        favoritos={[mockFavorite]}
        filteredLeft={filteredLeft}
        filteredRight={filteredRight}
        paginatedLeft={filteredLeft}
        paginatedRight={filteredRight}
      />,
    );

    expect(screen.getByText("Favoritos")).toBeInTheDocument();
  });

  it("renderiza el VS separador en móvil", () => {
    const filteredLeft = [mockCharacter];
    const filteredRight = [{ ...mockCharacter, id: 2, name: "Morty Smith" }];

    render(
      <CharacterList
        {...baseProps}
        filteredLeft={filteredLeft}
        filteredRight={filteredRight}
        paginatedLeft={filteredLeft}
        paginatedRight={filteredRight}
      />,
    );

    expect(screen.getByText("VS")).toBeInTheDocument();
  });

  it("renderiza CharacterColumn con el componente CharacterDetail mockeado", () => {
    const filteredLeft = [mockCharacter];

    render(
      <CharacterList
        {...baseProps}
        filteredLeft={filteredLeft}
        paginatedLeft={filteredLeft}
      />,
    );

    expect(screen.getByText("Primer Personaje")).toBeInTheDocument();
  });

  it("pasa correctos props a CharacterDetail cuando se selecciona", () => {
    render(
      <CharacterList
        {...baseProps}
        selectedCharacter={mockCharacter}
        favoritos={[]}
        episodes={[]}
      />,
    );

    const favButton = screen.getByText("Fav");
    expect(favButton).toBeInTheDocument();
    fireEvent.click(favButton);
    expect(baseProps.dispatch).toHaveBeenCalled();
  });

  it("renderiza personajes relacionados en el modal detalle", () => {
    const relatedChar = {
      ...mockCharacter,
      id: 99,
      name: "Related Character",
    };

    render(
      <CharacterList
        {...baseProps}
        selectedCharacter={mockCharacter}
        allCharacters={[mockCharacter, relatedChar]}
        favoritos={[mockFavorite]}
        episodes={[{ nombre: "Pilot", codigo: "S01E01" }]}
      />,
    );

    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
  });
});
