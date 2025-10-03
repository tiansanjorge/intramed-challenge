import { render, screen } from "@testing-library/react";
import { Footer } from "../components/Footer";

test("muestra el texto de derechos correctamente", () => {
  render(<Footer />);
  expect(screen.getByText(/The Cartoon Network, Inc/i)).toBeInTheDocument();
});
