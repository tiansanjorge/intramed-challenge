import { render, screen } from "@testing-library/react";
import CharactersLayout from "@/app/characters/layout";
import { describe, it, expect, vi } from "vitest";

// 🔹 Mocks para Header y Footer con Vitest
vi.mock("@/components/Header", () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
}));
vi.mock("@/components/Footer", () => ({
  Footer: () => <div data-testid="mock-footer">Footer</div>,
}));

describe("CharactersLayout", () => {
  it("renderiza Header y Footer", () => {
    render(
      <CharactersLayout>
        <div>Contenido de prueba</div>
      </CharactersLayout>
    );

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });

  it("renderiza los children en el main", () => {
    render(
      <CharactersLayout>
        <p>Hola personajes</p>
      </CharactersLayout>
    );

    expect(screen.getByText("Hola personajes")).toBeInTheDocument();
  });
});
