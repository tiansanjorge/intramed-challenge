import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Providers from "@/providers/Providers";

// Mock de store y persistor
vi.mock("@/store", () => ({
  store: { dispatch: vi.fn(), getState: vi.fn(), subscribe: vi.fn() },
  persistor: {
    getState: vi.fn(() => ({ bootstrapped: true })), // necesario para PersistGate
    flush: vi.fn(),
    pause: vi.fn(),
    persist: vi.fn(),
    purge: vi.fn(),
    subscribe: vi.fn(),
  },
}));

describe("Providers", () => {
  it("renderiza sus children correctamente", () => {
    render(
      <Providers>
        <p>Contenido de prueba</p>
      </Providers>
    );

    expect(screen.getByText("Contenido de prueba")).toBeInTheDocument();
  });
});
