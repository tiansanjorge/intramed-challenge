// CharactersView.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, type Mock } from "vitest";
import CharactersView from "@/app/characters/page";

// Mock de CharacterList y EpisodesComparison
vi.mock("@/components/CharacterList", () => ({
  default: () => <div data-testid="character-list">CharacterList</div>,
}));

vi.mock("@/components/EpisodesComparison", () => ({
  EpisodesComparison: ({
    episodesLeft = [],
    episodesRight = [],
    nameLeft,
    nameRight,
    imageLeft,
    imageRight,
    statusLeft,
    statusRight,
  }: {
    episodesLeft?: { nombre: string; codigo: string }[];
    episodesRight?: { nombre: string; codigo: string }[];
    nameLeft?: string;
    nameRight?: string;
    imageLeft?: string;
    imageRight?: string;
    statusLeft?: "Alive" | "Dead" | "unknown";
    statusRight?: "Alive" | "Dead" | "unknown";
  }) => (
    <div data-testid="episodes-comparison">
      EpisodesComparison - {episodesLeft.length} vs {episodesRight.length} -{" "}
      {nameLeft} & {nameRight}
    </div>
  ),
}));

// Mock del hook
vi.mock("@/hooks/useCharacters", () => ({
  useCharacters: vi.fn(),
}));

import { useCharacters } from "@/hooks/useCharacters";

describe("CharactersView", () => {
  it("renderiza siempre CharacterList", () => {
    (useCharacters as Mock).mockReturnValue({
      selectedLeftCard: null,
      selectedRightCard: null,
      episodesLeft: [],
      episodesRight: [],
      charactersLeft: [],
      charactersRight: [],
      allCharacters: [],
    });

    render(<CharactersView />);

    expect(screen.getByTestId("character-list")).toBeInTheDocument();
    expect(screen.queryByTestId("episodes-comparison")).not.toBeInTheDocument();
  });

  it("renderiza EpisodesComparison solo si hay 2 personajes seleccionados", () => {
    (useCharacters as Mock).mockReturnValue({
      selectedLeftCard: 1,
      selectedRightCard: 2,
      episodesLeft: [{ nombre: "Ep1", codigo: "E1" }],
      episodesRight: [{ nombre: "Ep2", codigo: "E2" }],
      charactersLeft: [{ id: 1, name: "Rick", image: "rick.jpg" }],
      charactersRight: [{ id: 2, name: "Morty", image: "morty.jpg" }],
      allCharacters: [
        { id: 1, name: "Rick", image: "rick.jpg" },
        { id: 2, name: "Morty", image: "morty.jpg" },
      ],
    });

    render(<CharactersView />);

    expect(screen.getByTestId("character-list")).toBeInTheDocument();
    expect(screen.getByTestId("episodes-comparison")).toHaveTextContent(
      "EpisodesComparison - 1 vs 1 - Rick & Morty",
    );
  });
});
