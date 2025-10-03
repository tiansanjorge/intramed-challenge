import { render, screen } from "@testing-library/react";
import { Modal } from "../components/Modal";
// import "@testing-library/jest-dom";

describe("Modal", () => {
  it("muestra el contenido cuando isOpen es true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Contenido del modal</div>
      </Modal>
    );
    expect(screen.getByText("Contenido del modal")).toBeInTheDocument();
  });

  it("no muestra el contenido cuando isOpen es false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Contenido oculto</div>
      </Modal>
    );
    expect(screen.queryByText("Contenido oculto")).not.toBeInTheDocument();
  });
});
