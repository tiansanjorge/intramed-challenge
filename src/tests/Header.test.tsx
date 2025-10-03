import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../components/Header";
import { MemoryRouter } from "react-router-dom";

test("renderiza input de búsqueda con valor inicial", () => {
  render(
    <MemoryRouter>
      <Header searchText="Rick" onSearch={() => {}} />
    </MemoryRouter>
  );
  expect(screen.getByPlaceholderText(/Buscar personaje/i)).toHaveValue("Rick");
});

test("dispara onSearch al cambiar el input", () => {
  const mockOnSearch = jest.fn();
  render(
    <MemoryRouter>
      <Header searchText="" onSearch={mockOnSearch} />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/Buscar personaje/i), {
    target: { value: "Morty" },
  });

  expect(mockOnSearch).toHaveBeenCalledWith("Morty");
});
