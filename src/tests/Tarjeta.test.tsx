// <reference types="vitest" />
import { render, screen, fireEvent } from "@testing-library/react";
import { Tarjeta } from "./Tarjeta";
import type { TarjetaProps } from "./Tarjeta";
import { describe, it, expect, vi } from "vitest";

const mockProps: TarjetaProps = {
  nombre: "Rick Sanchez",
  especie: "Humano",
  imagen: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
  origen: "Earth (C-137)",
  ubicacion: "Pilot",
  estado: "Vivo",
};

describe("Tarjeta", () => {
  it("renderiza sin errores", () => {
    render(<Tarjeta {...mockProps} />);
    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
  });

  it("muestra la estrella de favorito si esFavorito es true", () => {
    render(<Tarjeta {...mockProps} esFavorito />);
    const estrellaLlena = screen.getByAltText("Quitar de favoritos");
    expect(estrellaLlena).toBeInTheDocument();
    expect(estrellaLlena).toHaveAttribute(
      "src",
      expect.stringContaining("star-full")
    );
  });

  it("muestra la estrella vacía si esFavorito es false o no está", () => {
    render(<Tarjeta {...mockProps} />);
    const estrellaVacia = screen.getByAltText("Agregar a favoritos");
    expect(estrellaVacia).toBeInTheDocument();
    expect(estrellaVacia).toHaveAttribute(
      "src",
      expect.stringContaining("star-empty")
    );
  });

  it("ejecuta onClick al hacer click", () => {
    const handleClick = vi.fn();
    render(<Tarjeta {...mockProps} onClick={handleClick} />);
    fireEvent.click(screen.getByText("Rick Sanchez"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("ejecuta onToggleFavorito al hacer click en la estrella", () => {
    const handleToggle = vi.fn();
    render(<Tarjeta {...mockProps} onToggleFavorito={handleToggle} />);
    const boton = screen.getByLabelText("Toggle favorito");
    fireEvent.click(boton);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
