import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Card, type Character } from "@/components/Card";

// Mock de next/image para Vitest (usa <img> nativo)
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ""} />;
  },
}));

const mockCharacter: Character = {
  id: 1,
  name: "Rick Sanchez",
  species: "Human",
  image: "/rick.png",
  location: { name: "Earth (C-137)", url: "" },
  origin: { name: "Earth", url: "" },
  status: "Alive",
};

describe("Card", () => {
  it("renderiza la información básica del personaje", () => {
    render(<Card character={mockCharacter} />);
    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    expect(screen.getByText("Human")).toBeInTheDocument();
    expect(screen.getByText("Vivo")).toBeInTheDocument();
    expect(screen.getByText("Earth (C-137)")).toBeInTheDocument();
    expect(screen.getByText("Earth")).toBeInTheDocument();
  });

  it("muestra estrella vacía cuando no es favorito", () => {
    render(<Card character={mockCharacter} esFavorito={false} />);
    const starImg = screen.getByAltText("Agregar a favoritos");
    expect(starImg).toBeInTheDocument();
    expect(starImg).toHaveAttribute("src", "/star-empty.png");
  });

  it("muestra estrella llena cuando es favorito", () => {
    render(<Card character={mockCharacter} esFavorito={true} />);
    const starImg = screen.getByAltText("Quitar de favoritos");
    expect(starImg).toBeInTheDocument();
    expect(starImg).toHaveAttribute("src", "/star-full.png");
  });

  it("ejecuta onClick al clickear en la tarjeta", () => {
    const onClick = vi.fn();
    render(<Card character={mockCharacter} onClick={onClick} />);
    fireEvent.click(screen.getByText("Rick Sanchez"));
    expect(onClick).toHaveBeenCalled();
  });

  it("ejecuta onToggleFavorito sin disparar onClick", () => {
    const onClick = vi.fn();
    const onToggleFavorito = vi.fn();
    render(
      <Card
        character={mockCharacter}
        onClick={onClick}
        onToggleFavorito={onToggleFavorito}
      />
    );

    const starBtn = screen.getByRole("button", { name: "Toggle favorito" });
    fireEvent.click(starBtn);

    expect(onToggleFavorito).toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("match snapshot", () => {
    const { container } = render(<Card character={mockCharacter} />);
    expect(container).toMatchSnapshot();
  });
});
