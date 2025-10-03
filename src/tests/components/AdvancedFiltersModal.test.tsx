import { AdvancedFiltersModal } from "@/components/AdvancedFilters";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

describe("AdvancedFiltersModal", () => {
  const valoresIniciales = {
    especie: [],
    estado: [],
    genero: [],
  };

  it("no renderiza nada si isOpen es false", () => {
    const { container } = render(
      <AdvancedFiltersModal
        isOpen={false}
        onClose={vi.fn()}
        valoresIniciales={valoresIniciales}
        onAplicar={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renderiza correctamente cuando isOpen es true", () => {
    render(
      <AdvancedFiltersModal
        isOpen={true}
        onClose={vi.fn()}
        valoresIniciales={valoresIniciales}
        onAplicar={vi.fn()}
      />
    );

    expect(screen.getByText("Filtros avanzados")).toBeInTheDocument();
    expect(screen.getByText("Especie")).toBeInTheDocument();
    expect(screen.getByText("Género")).toBeInTheDocument();
    expect(screen.getByText("Estado")).toBeInTheDocument();
  });

  it("permite seleccionar filtros y llama a onAplicar", () => {
    const onAplicar = vi.fn();

    render(
      <AdvancedFiltersModal
        isOpen={true}
        onClose={vi.fn()}
        valoresIniciales={valoresIniciales}
        onAplicar={onAplicar}
      />
    );

    const humanChip = screen.getByRole("button", { name: "Human" });
    fireEvent.click(humanChip);

    const aplicarBtn = screen.getByRole("button", { name: "Aplicar filtros" });
    fireEvent.click(aplicarBtn);

    expect(onAplicar).toHaveBeenCalledWith({
      especie: ["Human"],
      estado: [],
      genero: [],
    });
  });

  it("llama a onClose al clickear en la X", () => {
    const onClose = vi.fn();

    render(
      <AdvancedFiltersModal
        isOpen={true}
        onClose={onClose}
        valoresIniciales={valoresIniciales}
        onAplicar={vi.fn()}
      />
    );

    const closeBtn = screen.getAllByRole("button")[0];
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
