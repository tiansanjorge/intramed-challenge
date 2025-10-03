// src/tests/Header.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Header } from "@/components/Header";
import { setSearchText } from "@/store/searchSlice";
import { RootState } from "@/store";

// --- Mock router ---
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

// --- Mock Redux ---
const dispatchMock = vi.fn();
let mockSearchText = "";

vi.mock("react-redux", () => ({
  useDispatch: () => dispatchMock,
  useSelector: (fn: (state: RootState) => unknown) =>
    fn({ search: { searchText: mockSearchText } } as RootState),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchText = "";
  });

  it("renderiza el logo y el input", () => {
    render(<Header />);

    expect(screen.getByAltText(/rick and morty/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/buscar personaje por nombre/i)
    ).toBeInTheDocument();
  });

  it("hace push('/') al clickear el logo", () => {
    render(<Header />);

    fireEvent.click(screen.getByAltText(/rick and morty/i));
    expect(pushMock).toHaveBeenCalledWith("/");
  });

  it("muestra el valor de searchText desde redux", () => {
    mockSearchText = "Morty";

    render(<Header />);
    expect(screen.getByDisplayValue("Morty")).toBeInTheDocument();
  });

  it("despacha setSearchText al escribir en el input", () => {
    render(<Header />);

    const input = screen.getByPlaceholderText(/buscar personaje/i);
    fireEvent.change(input, { target: { value: "Summer" } });

    expect(dispatchMock).toHaveBeenCalledWith(setSearchText("Summer"));
  });
});
