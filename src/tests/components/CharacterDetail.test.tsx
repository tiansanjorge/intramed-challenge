import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CharacterDetail from "@/components/CharacterDetail";

// Mock de next/image porque Next lo reemplaza en runtime
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || "image"} />;
  },
}));

describe("CharacterDetail", () => {
  const baseProps = {
    nombre: "Rick Sanchez",
    imagen: "/rick.png",
    especie: "Humano",
    estado: "Vivo" as const,
    genero: "Masculino",
    origen: "Earth",
    ubicacion: "Citadel",
    episodios: [
      { nombre: "Pilot", codigo: "S01E01" },
      { nombre: "Lawnmower Dog", codigo: "S01E02" },
    ],
  };

  it("renderiza el nombre, especie y estado en el bloque principal", () => {
    render(<CharacterDetail {...baseProps} />);

    // Selecciona el h2 principal
    const mainHeading = screen.getByRole("heading", {
      level: 2,
      name: /rick sanchez/i,
    });
    expect(mainHeading).toBeInTheDocument();

    // Especie: aparece 4 veces (1 principal + 3 relacionados)
    expect(screen.getAllByText(/humano/i)).toHaveLength(4);

    // Estado: aparece solo 1 vez
    expect(screen.getByText(/vivo/i)).toBeInTheDocument();
  });

  it("muestra los episodios", () => {
    render(<CharacterDetail {...baseProps} />);
    expect(screen.getByText("S01E01")).toBeInTheDocument();
    expect(screen.getByText("S01E02")).toBeInTheDocument();
  });

  it("llama a onToggleFavorito al hacer click en la estrella", () => {
    const onToggleFavorito = vi.fn();
    render(
      <CharacterDetail {...baseProps} onToggleFavorito={onToggleFavorito} />
    );

    const favButtons = screen.getAllByRole("button");
    fireEvent.click(favButtons[0]); // primer botón estrella

    expect(onToggleFavorito).toHaveBeenCalled();
  });

  it("usa la imagen de estrella llena cuando esFavorito=true", () => {
    render(<CharacterDetail {...baseProps} esFavorito={true} />);
    const favImg = screen.getAllByAltText("favorito")[0] as HTMLImageElement;
    expect(favImg).toHaveAttribute("src", "/star-full.png");
  });

  it("renderiza personajes relacionados", () => {
    render(<CharacterDetail {...baseProps} />);
    expect(screen.getByText("Personajes relacionados")).toBeInTheDocument();

    // 1 principal + 3 relacionados
    expect(screen.getAllByText("Rick Sanchez")).toHaveLength(4);
  });
});
