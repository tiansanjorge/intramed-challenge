import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "@/components/Modal";

describe("Modal", () => {
  it("no renderiza nada cuando isOpen=false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Contenido modal</p>
      </Modal>
    );

    expect(screen.queryByText("Contenido modal")).not.toBeInTheDocument();
  });

  it("renderiza el contenido cuando isOpen=true", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Contenido modal</p>
      </Modal>
    );

    expect(screen.getByText("Contenido modal")).toBeInTheDocument();
  });

  it("ejecuta onClose al clickear botón X (desktop)", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Contenido</p>
      </Modal>
    );

    const closeBtn = screen.getByLabelText("Cerrar modal");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("ejecuta onClose al clickear botón ArrowLeft (mobile)", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Contenido</p>
      </Modal>
    );

    const buttons = screen.getAllByRole("button");
    const mobileBtn = buttons[1];
    fireEvent.click(mobileBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
