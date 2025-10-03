"use client";

import { useState } from "react";

type Episode = {
  nombre: string;
  codigo: string;
};

interface Props {
  episodesLeft: Episode[];
  episodesRight: Episode[];
}

export const EpisodesComparison = ({ episodesLeft, episodesRight }: Props) => {
  // Intersección por "codigo"
  const intersection = episodesLeft.filter((ep) =>
    episodesRight.some((e) => e.codigo === ep.codigo)
  );

  // --- Estados de "ver más" para cada bloque ---
  const [showAllLeft, setShowAllLeft] = useState(false);
  const [showAllRight, setShowAllRight] = useState(false);
  const [showAllIntersection, setShowAllIntersection] = useState(false);

  const renderList = (
    episodes: Episode[],
    emptyText: string,
    showAll: boolean,
    setShowAll: (val: boolean) => void
  ) => {
    if (episodes.length === 0) {
      return <p className="text-gray-500 text-center">{emptyText}</p>;
    }

    const toShow = showAll ? episodes : episodes.slice(0, 5);

    return (
      <div>
        <ul className="space-y-2">
          {toShow.map((ep) => (
            <li
              key={ep.codigo}
              className="border rounded px-3 py-2 text-sm flex justify-between"
            >
              <span>{ep.nombre}</span>
              <span className="text-gray-500">{ep.codigo}</span>
            </li>
          ))}
        </ul>
        {episodes.length > 5 && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-semibold text-[#354E18] bg-[#B6DA8B] px-3 py-1 rounded hover:bg-[#A1C86A] transition-colors duration-300"
            >
              {showAll ? "Ver menos" : "Ver más"}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className=" p-4 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Episodios</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Episodios Personaje 1 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-4 text-center">Personaje #1</h3>
          {renderList(
            episodesLeft,
            "Sin episodios",
            showAllLeft,
            setShowAllLeft
          )}
        </div>

        {/* Episodios compartidos */}
        <div className="bg-gray-50 rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-4 text-center">Ambos</h3>
          {renderList(
            intersection,
            "No comparten episodios",
            showAllIntersection,
            setShowAllIntersection
          )}
        </div>

        {/* Episodios Personaje 2 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-4 text-center">Personaje #2</h3>
          {renderList(
            episodesRight,
            "Sin episodios",
            showAllRight,
            setShowAllRight
          )}
        </div>
      </div>
    </div>
  );
};
