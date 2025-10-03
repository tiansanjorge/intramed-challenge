import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Home from "@/app/page";

// Mock de next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("Home Page", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    mockPush.mockReset();

    // devolver objeto que cumple con AppRouterInstance
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as AppRouterInstance);

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("renderiza el logo y el texto de bienvenida", () => {
    render(<Home />);
    expect(screen.getByAltText("Rick and Morty logo")).toBeInTheDocument();
    expect(screen.getByText("Bienvenido")).toBeInTheDocument();
    expect(
      screen.getByText("Sebastián Sanjorge", { exact: false })
    ).toBeInTheDocument();
  });

  it("ejecuta router.push('/characters') al hacer click en Comenzar", () => {
    render(<Home />);
    fireEvent.click(screen.getByRole("button", { name: "Comenzar" }));
    expect(mockPush).toHaveBeenCalledWith("/characters");
  });

  it("aplica backgroundImage en modo mobile", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 400,
    });
    render(<Home />);
    const container = screen.getByText("Bienvenido").closest("div")
      ?.parentElement?.parentElement;
    expect(container?.getAttribute("style")).toContain(
      "background-blend-mode: multiply"
    );
  });
});
