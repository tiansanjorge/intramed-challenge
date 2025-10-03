// CharactersView.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, type Mock } from "vitest"; // 👈 importamos Mock
import CharactersView from "@/app/characters/page";

// Mock de CharacterList y EpisodesComparison
vi.mock("@/components/CharacterList", () => ({
  default: () => <div data-testid="character-list">CharacterList</div>,
}));

vi.mock("@/components/EpisodesComparison", () => ({
  EpisodesComparison: ({
    episodesLeft = [],
    episodesRight = [],
  }: {
    episodesLeft?: string[];
    episodesRight?: string[];
  }) => (
    <div data-testid="episodes-comparison">
      EpisodesComparison - {episodesLeft.length} vs {episodesRight.length}
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
    });

    render(<CharactersView />);

    expect(screen.getByTestId("character-list")).toBeInTheDocument();
    expect(screen.queryByTestId("episodes-comparison")).not.toBeInTheDocument();
  });

  it("renderiza EpisodesComparison solo si hay 2 personajes seleccionados", () => {
    (useCharacters as Mock).mockReturnValue({
      selectedLeftCard: { id: 1, name: "Rick" },
      selectedRightCard: { id: 2, name: "Morty" },
      episodesLeft: ["E1", "E2"],
      episodesRight: ["E3"],
    });

    render(<CharactersView />);

    expect(screen.getByTestId("character-list")).toBeInTheDocument();
    expect(screen.getByTestId("episodes-comparison")).toHaveTextContent(
      "EpisodesComparison - 2 vs 1"
    );
  });
});
