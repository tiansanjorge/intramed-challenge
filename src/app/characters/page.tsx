"use client";

import CharacterList from "@/components/CharacterList";
import { EpisodesComparison } from "@/components/EpisodesComparison";
import { useCharacters } from "@/hooks/useCharacters";

export default function CharactersView() {
  const charactersData = useCharacters();

  return (
    <div>
      <CharacterList {...charactersData} />
      <EpisodesComparison
        episodesLeft={charactersData.episodesLeft}
        episodesRight={charactersData.episodesRight}
      />
    </div>
  );
}
