import { render, screen, waitFor } from "@testing-library/react";
import CharacterList from "../components/CharacterList";
import { Provider } from "react-redux";
import { store } from "../store";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        results: [
          {
            id: 1,
            name: "Rick Sanchez",
            species: "Human",
            image: "rick.png",
            location: { name: "Citadel", url: "" },
            origin: { name: "Earth", url: "" },
            status: "Alive",
            gender: "Male",
            episode: [],
          },
        ],
      }),
  })
) as jest.Mock;

describe("CharacterList", () => {
  it("renderiza personajes después de fetch", async () => {
    render(
      <Provider store={store}>
        <CharacterList searchText="" resetSearch={() => {}} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    });
  });
});
