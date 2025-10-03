"use client";

import CharacterList from "@/components/CharacterList";
import { EpisodesComparison } from "@/components/EpisodesComparison";
import { useCharacters } from "@/hooks/useCharacters";

export default function CharactersView() {
  const charactersData = useCharacters();

  const { selectedLeftCard, selectedRightCard, episodesLeft, episodesRight } =
    charactersData;

  return (
    <div>
      <CharacterList {...charactersData} />

      {/* Mostrar solo si hay 2 personajes seleccionados */}
      {selectedLeftCard && selectedRightCard && (
        <EpisodesComparison
          episodesLeft={episodesLeft}
          episodesRight={episodesRight}
        />
      )}
    </div>
  );
}
