import { SlidersHorizontalIcon } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

type Props = {
  activo: "todos" | "favoritos";
  setActivo: (value: "todos" | "favoritos") => void;
  onOpenFilters: () => void;
};

const CharacterListHeader = ({ activo, setActivo, onOpenFilters }: Props) => {
  const todosRef = useRef<HTMLButtonElement>(null);
  const favoritosRef = useRef<HTMLButtonElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: "4px", width: "0px" });

  useLayoutEffect(() => {
    const btn = activo === "todos" ? todosRef.current : favoritosRef.current;

    if (btn) {
      setPillStyle({
        left: btn.offsetLeft + "px",
        width: btn.offsetWidth + "px",
      });
    }
  }, [activo]);

  return (
    <div className="relative flex justify-between items-center mb-6">
      <div className="relative flex bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/20 p-1 h-10 items-center">
        <div
          className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-in-out shadow-md bg-gradient-to-r from-[#B6DA8B] to-[#8BC547]"
          style={pillStyle}
        />

        <button
          ref={todosRef}
          onClick={() => setActivo("todos")}
          className={`relative z-10 px-4 py-2 rounded-full text-sm font-semibold 
            transition-all duration-300 ease-in-out hover:scale-105 active:scale-95
            ${
              activo === "todos"
                ? "text-[#354E18]"
                : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Todos
        </button>

        <button
          ref={favoritosRef}
          onClick={() => setActivo("favoritos")}
          className={`relative z-10 px-4 py-2 rounded-full text-sm font-semibold 
            transition-all duration-300 ease-in-out hover:scale-105 active:scale-95
            ${
              activo === "favoritos"
                ? "text-[#354E18]"
                : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Favoritos
        </button>
      </div>

      <h2 className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-center bg-gradient-to-r from-[#354E18] to-[#5a7f2e] bg-clip-text text-transparent drop-shadow-sm pointer-events-none">
        Selección de Personajes
      </h2>

      <button
        onClick={onOpenFilters}
        aria-label="Abrir filtros"
        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white/20
          flex items-center justify-center
          transform transition-all duration-300 ease-in-out
          hover:scale-110 hover:shadow-xl hover:border-[#8BC547]
          active:scale-95"
      >
        <SlidersHorizontalIcon className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
};

export default CharacterListHeader;
