import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "@/components/Footer";

describe("Footer", () => {
  it("renderiza el footer con el texto correcto", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo"); // los <footer> tienen este role
    expect(footer).toBeInTheDocument();
    expect(
      screen.getByText(
        /TM & © 2025 The Cartoon Network, Inc. All Rights Reserved./i
      )
    ).toBeInTheDocument();
  });
});
