"use client";

import { useEffect, useRef } from "react";
import CharacterList from "@/components/CharacterList";
import { EpisodesComparison } from "@/components/EpisodesComparison";
import { useCharacters } from "@/hooks/useCharacters";

export default function CharactersView() {
  const charactersData = useCharacters();
  const episodesRef = useRef<HTMLDivElement>(null);

  const {
    selectedLeftCard,
    selectedRightCard,
    episodesLeft,
    episodesRight,
    loadingEpisodesLeft,
    loadingEpisodesRight,
    progressLeft,
    progressRight,
    allCharacters,
  } = charactersData;

  // Buscar los personajes seleccionados en todos los personajes (no solo en la página actual)
  const leftCharacter = allCharacters.find((c) => c.id === selectedLeftCard);
  const rightCharacter = allCharacters.find((c) => c.id === selectedRightCard);

  // Función de easing para un scroll más suave
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Scroll automático cuando se selecciona un personaje y ya hay otro seleccionado
  useEffect(() => {
    // Si ambos personajes están seleccionados, hacer scroll a la sección de episodios
    if (leftCharacter && rightCharacter && episodesRef.current) {
      // Pequeño delay para asegurar que el componente se haya renderizado
      setTimeout(() => {
        const element = episodesRef.current;
        if (element) {
          const offset = 80;
          const targetPosition =
            element.getBoundingClientRect().top + window.pageYOffset - offset;
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          const duration = 1200; // Duración más larga para más suavidad
          let startTime: number | null = null;

          const animation = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (progress < 1) {
              requestAnimationFrame(animation);
            }
          };

          requestAnimationFrame(animation);
        }
      }, 150);
    }
  }, [selectedLeftCard, selectedRightCard, leftCharacter, rightCharacter]);

  return (
    <div>
      <CharacterList {...charactersData} />

      {/* Mostrar solo si hay 2 personajes seleccionados */}
      {leftCharacter && rightCharacter && (
        <div ref={episodesRef}>
          <EpisodesComparison
            episodesLeft={episodesLeft}
            episodesRight={episodesRight}
            nameLeft={leftCharacter.name}
            nameRight={rightCharacter.name}
            imageLeft={leftCharacter.image}
            imageRight={rightCharacter.image}
            statusLeft={leftCharacter.status}
            statusRight={rightCharacter.status}
            loadingLeft={loadingEpisodesLeft}
            loadingRight={loadingEpisodesRight}
            progressLeft={progressLeft}
            progressRight={progressRight}
            onLeftClick={() =>
              charactersData.setSelectedCharacter(leftCharacter)
            }
            onRightClick={() =>
              charactersData.setSelectedCharacter(rightCharacter)
            }
          />
        </div>
      )}
    </div>
  );
}
