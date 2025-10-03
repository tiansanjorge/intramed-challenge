"use client";

import { X, ArrowLeft, MoreVertical } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex sm:items-center justify-center sm:px-0">
      <div className="bg-white sm:rounded-xl w-full sm:max-w-[600px] relative shadow-lg min-h-[100vh] sm:min-h-0 sm:max-h-[90vh] overflow-y-scroll">
        <button
          aria-label="Cerrar modal"
          onClick={onClose}
          className="hidden sm:flex bg-white p-2 rounded-full absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <MoreVertical className="hidden sm:flex absolute top-[165px] right-5 w-6 h-6 text-[#808C73] cursor-pointer" />

        <button
          onClick={onClose}
          className="sm:hidden absolute top-3 left-3 rounded-full w-10 h-10 flex items-center justify-center shadow z-50"
        >
          <ArrowLeft className="w-8 h-8 text-white" />
        </button>

        <MoreVertical className="sm:hidden absolute top-4 right-3 w-8 h-8 text-white cursor-pointer z-50" />

        {children}
      </div>
    </div>
  );
};
