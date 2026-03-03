import { resetSearch } from "@/store/searchSlice";
import type { Filtros } from "@/hooks/useCharacters";
import type { Dispatch } from "@reduxjs/toolkit";

type Props = {
  filters: Filtros;
  searchText: string;
  dispatch: Dispatch;
  removeFiltro: (tipo: keyof Filtros, valor: string) => void;
};

const CharacterListAppliedFilters = ({
  filters,
  searchText,
  dispatch,
  removeFiltro,
}: Props) => {
  const hasFilters =
    filters.especie.length > 0 ||
    filters.genero.length > 0 ||
    filters.estado.length > 0 ||
    searchText.length > 0;

  return (
    <div className="flex flex-wrap justify-between items-start gap-4 my-5">
      <div className="flex gap-4 items-center">
        {hasFilters && (
          <div className="text-sm font-semibold text-gray-800">
            Filtros aplicados:
          </div>
        )}

        <div className="flex flex-wrap gap-2 font-semibold">
          {searchText && (
            <span className="flex gap-2 items-center bg-white/70 border text-sm px-3 py-1.5 rounded-full shadow-md">
              <span className="italic">&quot;{searchText}&quot;</span>
              <button
                onClick={() => dispatch(resetSearch())}
                aria-label="Limpiar búsqueda"
              >
                <img
                  src="/cross.png"
                  alt="Limpiar búsqueda"
                  className="w-4 h-4"
                />
              </button>
            </span>
          )}

          {(["especie", "genero", "estado"] as const).flatMap((tipo) =>
            filters[tipo].map((valor) => (
              <span
                key={`${tipo}-${valor}`}
                className="flex gap-2 items-center bg-white/70 border text-sm px-3 py-1.5 rounded-full shadow-md"
              >
                {valor}
                <button onClick={() => removeFiltro(tipo, valor)}>
                  <img
                    src="/cross.png"
                    alt="Quitar filtro"
                    className="w-4 h-4"
                  />
                </button>
              </span>
            )),
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterListAppliedFilters;
