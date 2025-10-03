// RootLayout.test.tsx
import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "@/app/layout";
import { describe, it, expect } from "vitest";

vi.mock("next/font/google", () => ({
  Montserrat: () => ({
    variable: "--mock-montserrat",
    style: { fontFamily: "mock-montserrat" },
  }),
}));

describe("RootLayout", () => {
  it("debería exponer el metadata correcto", () => {
    expect(metadata.title).toBe("Rick & Morty Challenge");
    expect(metadata.description).toBe(
      "Frontend challenge with Next.js, Redux, Tailwind"
    );
    expect(metadata.icons).toEqual({ icon: "/favicon.png" });
  });

  it("debería renderizar el children dentro del layout", () => {
    render(
      <RootLayout>
        <p data-testid="child">Hola Mundo</p>
      </RootLayout>
    );

    // El child debería aparecer en el DOM
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
