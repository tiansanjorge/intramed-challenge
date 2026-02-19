import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EpisodesComparison } from "@/components/EpisodesComparison";

const makeEpisodes = (prefix: string, count: number) =>
  Array.from({ length: count }).map((_, i) => ({
    nombre: `${prefix} ${i + 1}`,
    codigo: `${prefix}-${i + 1}`,
  }));

describe("EpisodesComparison", () => {
  it("muestra mensajes vacíos cuando no hay episodios", () => {
    render(
      <EpisodesComparison
        episodesLeft={[]}
        episodesRight={[]}
        nameLeft="Character 1"
        nameRight="Character 2"
        imageLeft="https://example.com/image1.jpg"
        imageRight="https://example.com/image2.jpg"
        statusLeft="Alive"
        statusRight="Dead"
      />,
    );

    // Hay 2 bloques vacíos: personaje 1 y personaje 2
    expect(screen.getAllByText("Sin episodios")).toHaveLength(2);

    // El bloque de intersección debe mostrar "No comparten episodios"
    expect(screen.getByText("No comparten episodios")).toBeInTheDocument();
  });

  it("muestra hasta 5 episodios por bloque", () => {
    const episodesLeft = makeEpisodes("L", 7);
    const episodesRight = makeEpisodes("R", 7);

    render(
      <EpisodesComparison
        episodesLeft={episodesLeft}
        episodesRight={episodesRight}
        nameLeft="Character 1"
        nameRight="Character 2"
        imageLeft="https://example.com/image1.jpg"
        imageRight="https://example.com/image2.jpg"
        statusLeft="Alive"
        statusRight="unknown"
      />,
    );

    // Solo 5 episodios visibles de cada lado
    expect(screen.getAllByText(/L-/)).toHaveLength(5);
    expect(screen.getAllByText(/R-/)).toHaveLength(5);

    // Botón ver más visible
    expect(screen.getAllByText("Ver más")).toHaveLength(2);
  });

  it("expande la lista al hacer click en Ver más", () => {
    const episodesLeft = makeEpisodes("L", 7);
    render(
      <EpisodesComparison
        episodesLeft={episodesLeft}
        episodesRight={[]}
        nameLeft="Character 1"
        nameRight="Character 2"
        imageLeft="https://example.com/image1.jpg"
        imageRight="https://example.com/image2.jpg"
        statusLeft="Alive"
        statusRight="Dead"
      />,
    );

    const btn = screen.getByText("Ver más");
    fireEvent.click(btn);

    // Ahora muestra los 7 episodios
    expect(screen.getAllByText(/L-/)).toHaveLength(7);
    expect(screen.getByText("Ver menos")).toBeInTheDocument();
  });

  it("calcula correctamente la intersección de episodios", () => {
    const left = [
      { nombre: "Ep A", codigo: "A" },
      { nombre: "Ep B", codigo: "B" },
    ];
    const right = [
      { nombre: "Ep B", codigo: "B" },
      { nombre: "Ep C", codigo: "C" },
    ];

    render(
      <EpisodesComparison
        episodesLeft={left}
        episodesRight={right}
        nameLeft="Character 1"
        nameRight="Character 2"
        imageLeft="https://example.com/image1.jpg"
        imageRight="https://example.com/image2.jpg"
        statusLeft="unknown"
        statusRight="Alive"
      />,
    );

    const ambosSection = screen.getByText("Compartidos")
      .parentElement as HTMLElement;

    // En la sección "Ambos" debe estar solo Ep B
    expect(within(ambosSection).getByText("Ep B")).toBeInTheDocument();
    expect(within(ambosSection).queryByText("Ep A")).not.toBeInTheDocument();
    expect(within(ambosSection).queryByText("Ep C")).not.toBeInTheDocument();
  });
});
