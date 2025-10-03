import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CharacterColumn } from "@/components/CharacterColumn";
import { toggleFavorite } from "@/store/favoritesSlice";
import { Card } from "@/components/Card";
import { Character } from "@/hooks/useCharacters";

// Mock de Card (sin `any`)
type CardProps = React.ComponentProps<typeof Card>;
vi.mock("@/components/Card", () => ({
  Card: ({ character, onClick, onToggleFavorito, esFavorito }: CardProps) => (
    <div data-testid={`card-${character.id}`}>
      <p>{character.name}</p>
      <button onClick={onClick}>CardClick</button>
      <button onClick={onToggleFavorito}>
        {esFavorito ? "Unfavorite" : "Favorite"}
      </button>
    </div>
  ),
}));

// Mock del slice de favoritos
vi.mock("@/store/favoritesSlice", () => ({
  toggleFavorite: vi.fn((payload) => ({ type: "favorites/toggle", payload })),
}));

const mockCharacter: Character = {
  id: 1,
  name: "Rick Sanchez",
  species: "Human",
  image: "/rick.png",
  location: { name: "Earth (C-137)", url: "" },
  origin: { name: "Earth", url: "" },
  status: "Alive",
  gender: "Male",
  episode: ["E1", "E2"],
};

describe("CharacterColumn", () => {
  const setPage = vi.fn();
  const setSelectedCard = vi.fn();
  const setOverlayCard = vi.fn();
  const setSelectedCharacter = vi.fn();
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza título y paginación", () => {
    render(
      <CharacterColumn
        title="Columna Test"
        paginated={[mockCharacter]}
        page={1}
        setPage={setPage}
        totalPages={3}
        selectedCard={null}
        setSelectedCard={setSelectedCard}
        overlayCard={null}
        setOverlayCard={setOverlayCard}
        favoritos={[]}
        dispatch={dispatch}
        setSelectedCharacter={setSelectedCharacter}
      />
    );

    expect(screen.getByText("Columna Test")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("llama a setPage cuando se hace click en Página siguiente", () => {
    render(
      <CharacterColumn
        title="Columna Test"
        paginated={[mockCharacter]}
        page={1}
        setPage={setPage}
        totalPages={3}
        selectedCard={null}
        setSelectedCard={setSelectedCard}
        overlayCard={null}
        setOverlayCard={setOverlayCard}
        favoritos={[]}
        dispatch={dispatch}
        setSelectedCharacter={setSelectedCharacter}
      />
    );

    fireEvent.click(screen.getByLabelText("Página siguiente"));
    expect(setPage).toHaveBeenCalledWith(2);
  });

  it("dispara toggleFavorite al clickear en botón de favorito", () => {
    render(
      <CharacterColumn
        title="Columna Test"
        paginated={[mockCharacter]}
        page={1}
        setPage={setPage}
        totalPages={1}
        selectedCard={null}
        setSelectedCard={setSelectedCard}
        overlayCard={null}
        setOverlayCard={setOverlayCard}
        favoritos={[]}
        dispatch={dispatch}
        setSelectedCharacter={setSelectedCharacter}
      />
    );

    fireEvent.click(screen.getByText("Favorite"));
    expect(toggleFavorite).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        nombre: "Rick Sanchez",
      })
    );
    expect(dispatch).toHaveBeenCalled();
  });

  it("muestra overlay con botones Seleccionar/Detalle cuando overlayCard coincide", () => {
    render(
      <CharacterColumn
        title="Columna Test"
        paginated={[mockCharacter]}
        page={1}
        setPage={setPage}
        totalPages={1}
        selectedCard={null}
        setSelectedCard={setSelectedCard}
        overlayCard={1}
        setOverlayCard={setOverlayCard}
        favoritos={[]}
        dispatch={dispatch}
        setSelectedCharacter={setSelectedCharacter}
      />
    );

    expect(screen.getByText("Detalle")).toBeInTheDocument();
    expect(screen.getByText("Seleccionar")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Detalle"));
    expect(setSelectedCharacter).toHaveBeenCalledWith(mockCharacter);

    fireEvent.click(screen.getByText("Seleccionar"));
    expect(setSelectedCard).toHaveBeenCalledWith(1);
  });

  it("muestra botón Deseleccionar si el personaje ya está seleccionado", () => {
    render(
      <CharacterColumn
        title="Columna Test"
        paginated={[mockCharacter]}
        page={1}
        setPage={setPage}
        totalPages={1}
        selectedCard={1}
        setSelectedCard={setSelectedCard}
        overlayCard={1}
        setOverlayCard={setOverlayCard}
        favoritos={[]}
        dispatch={dispatch}
        setSelectedCharacter={setSelectedCharacter}
      />
    );

    expect(screen.getByText("Deseleccionar")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Deseleccionar"));
    expect(setSelectedCard).toHaveBeenCalledWith(null);
  });
});
