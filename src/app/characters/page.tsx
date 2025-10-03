"use client";

import CharacterList from "@/components/CharacterList";
import { EpisodesComparison } from "@/components/EpisodesComparison";
import { useCharacters } from "@/hooks/useCharacters";

export default function CharactersView() {
  const charactersData = useCharacters();

  const {
    selectedLeftCard,
    selectedRightCard,
    episodesLeft,
    episodesRight,
    charactersLeft,
    charactersRight,
  } = charactersData;

  // Buscar los personajes seleccionados
  const leftCharacter = charactersLeft.find((c) => c.id === selectedLeftCard);
  const rightCharacter = charactersRight.find(
    (c) => c.id === selectedRightCard
  );

  return (
    <div>
      <CharacterList {...charactersData} />

      {/* Mostrar solo si hay 2 personajes seleccionados */}
      {leftCharacter && rightCharacter && (
        <EpisodesComparison
          episodesLeft={episodesLeft}
          episodesRight={episodesRight}
          nameLeft={leftCharacter.name}
          nameRight={rightCharacter.name}
        />
      )}
    </div>
  );
}
