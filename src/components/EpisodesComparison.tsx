"use client";

import Image from "next/image";

type Episode = {
  nombre: string;
  codigo: string;
};

interface Props {
  episodesLeft: Episode[];
  episodesRight: Episode[];
  nameLeft: string; // 👈 nuevo
  nameRight: string; // 👈 nuevo
  imageLeft: string; // 👈 imagen personaje izquierda
  imageRight: string; // 👈 imagen personaje derecha
  statusLeft: "Alive" | "Dead" | "unknown"; // 👈 estado del personaje izquierda
  statusRight: "Alive" | "Dead" | "unknown"; // 👈 estado del personaje derecha
  loadingLeft?: boolean; // Estado de carga izquierda
  loadingRight?: boolean; // Estado de carga derecha
  progressLeft?: { loaded: number; total: number };
  progressRight?: { loaded: number; total: number };
  onLeftClick?: () => void; // 👈 callback para click en personaje izquierdo
  onRightClick?: () => void; // 👈 callback para click en personaje derecho
}

export const EpisodesComparison = ({
  episodesLeft,
  episodesRight,
  nameLeft,
  nameRight,
  imageLeft,
  imageRight,
  statusLeft,
  statusRight,
  loadingLeft = false,
  loadingRight = false,
  progressLeft = { loaded: 0, total: 0 },
  progressRight = { loaded: 0, total: 0 },
  onLeftClick,
  onRightClick,
}: Props) => {
  // Función para obtener el color del indicador según el estado
  const getStatusColor = (status: "Alive" | "Dead" | "unknown") => {
    switch (status) {
      case "Alive":
        return "bg-[#8BC547]";
      case "Dead":
        return "bg-red-500";
      case "unknown":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };
  // Intersección por "codigo"
  const intersection = episodesLeft.filter((ep) =>
    episodesRight.some((e) => e.codigo === ep.codigo),
  );

  const renderList = (
    episodes: Episode[],
    emptyText: string,
    isLoading: boolean = false,
    progress: { loaded: number; total: number } = { loaded: 0, total: 0 },
  ) => {
    if (isLoading) {
      const percentage =
        progress.total > 0
          ? Math.round((progress.loaded / progress.total) * 100)
          : 0;

      return (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-[#8BC547] border-t-transparent"></div>
          <div className="text-center">
            <p className="text-sm font-medium text-white">
              Cargando episodios...
            </p>
            <p className="text-xs text-gray-300 mt-1">
              {progress.loaded} / {progress.total} ({percentage}%)
            </p>
          </div>
          {/* Barra de progreso */}
          <div className="w-full max-w-xs bg-white/20 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#8BC547] to-[#B6DA8B] h-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    }

    if (episodes.length === 0) {
      return (
        <p className="text-gray-300 text-center py-6 italic">{emptyText}</p>
      );
    }

    return (
      <div className="max-h-64 overflow-y-auto pr-2 scrollbar-glass">
        <ul className="space-y-2.5">
          {episodes.map((ep, index) => (
            <li
              key={ep.codigo}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm flex justify-between items-center
                transform transition-all duration-300 ease-in-out
                hover:border-[#8BC547] hover:bg-[#8BC547]/10 hover:shadow-lg hover:scale-[1.02]
                animate-fadeIn group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="font-medium text-white group-hover:text-[#B6DA8B] transition-colors">
                {ep.nombre}
              </span>
              <span className="text-gray-400 text-xs font-mono bg-black/20 px-2 py-1 rounded group-hover:bg-[#8BC547]/20 group-hover:text-[#B6DA8B] transition-all">
                {ep.codigo}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/episodes-bg.jpg"
          alt="Episodes Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Episodios
          </h2>
          <p className="text-gray-200 text-sm md:text-base">
            Explora los episodios de cada personaje y descubre los compartidos
          </p>
        </div>

        {/* Grid: 2 columnas en desktop para los personajes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Episodios Personaje 1 */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl shadow-2xl p-6 border border-white/20 transform transition-all duration-300 hover:bg-white/15 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,197,71,0.3)]">
            <div className="flex items-center gap-4 mb-5 pb-4 border-b border-white/20">
              <div className="relative">
                <Image
                  src={imageLeft}
                  alt={nameLeft}
                  width={56}
                  height={56}
                  className={`rounded-full object-cover border-3 border-[#8BC547] shadow-lg
                    transform transition-all duration-300 ease-in-out
                    hover:scale-110 hover:border-[#B6DA8B] ${
                      onLeftClick ? "cursor-pointer" : ""
                    }`}
                  onClick={onLeftClick}
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(statusLeft)} rounded-full border-2 border-white`}
                ></div>
              </div>
              <div className="flex-1">
                <h3
                  className={`text-xl font-bold text-white transition-all duration-300 origin-left ${
                    onLeftClick
                      ? "cursor-pointer hover:text-[#B6DA8B] hover:scale-105"
                      : ""
                  }`}
                  onClick={onLeftClick}
                >
                  {nameLeft}
                </h3>
                <p className="text-gray-300 text-sm">
                  {loadingLeft
                    ? "Cargando..."
                    : `${episodesLeft.length} episodios`}
                </p>
              </div>
            </div>
            <div className="text-white">
              {renderList(
                episodesLeft,
                "Sin episodios",
                loadingLeft,
                progressLeft,
              )}
            </div>
          </div>

          {/* Episodios Personaje 2 */}
          <div className="backdrop-blur-md bg-white/10 rounded-xl shadow-2xl p-6 border border-white/20 transform transition-all duration-300 hover:bg-white/15 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,197,71,0.3)]">
            <div className="flex items-center gap-4 mb-5 pb-4 border-b border-white/20">
              <div className="relative">
                <Image
                  src={imageRight}
                  alt={nameRight}
                  width={56}
                  height={56}
                  className={`rounded-full object-cover border-3 border-[#8BC547] shadow-lg
                    transform transition-all duration-300 ease-in-out
                    hover:scale-110 hover:border-[#B6DA8B] ${
                      onRightClick ? "cursor-pointer" : ""
                    }`}
                  onClick={onRightClick}
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 ${getStatusColor(statusRight)} rounded-full border-2 border-white`}
                ></div>
              </div>
              <div className="flex-1">
                <h3
                  className={`text-xl font-bold text-white transition-all duration-300 origin-left ${
                    onRightClick
                      ? "cursor-pointer hover:text-[#B6DA8B] hover:scale-105"
                      : ""
                  }`}
                  onClick={onRightClick}
                >
                  {nameRight}
                </h3>
                <p className="text-gray-300 text-sm">
                  {loadingRight
                    ? "Cargando..."
                    : `${episodesRight.length} episodios`}
                </p>
              </div>
            </div>
            <div className="text-white">
              {renderList(
                episodesRight,
                "Sin episodios",
                loadingRight,
                progressRight,
              )}
            </div>
          </div>
        </div>

        {/* Episodios Compartidos - Full width abajo */}
        <div className="backdrop-blur-lg bg-gradient-to-r from-[#8BC547]/20 to-[#B6DA8B]/20 rounded-xl shadow-2xl p-6 md:p-8 border-2 border-[#8BC547]/30 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(139,197,71,0.4)]">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6 pb-5 border-b border-[#8BC547]/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={imageLeft}
                  alt={nameLeft}
                  width={48}
                  height={48}
                  className={`rounded-full object-cover border-2 border-[#8BC547] shadow-lg
                    transform transition-all duration-300 ease-in-out
                    hover:scale-110 ${onLeftClick ? "cursor-pointer" : ""}`}
                  onClick={onLeftClick}
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(statusLeft)} rounded-full border-2 border-white`}
                ></div>
              </div>
              <div className="hidden md:block w-16 h-0.5 bg-gradient-to-r from-[#8BC547] to-transparent"></div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Episodios Compartidos
              </h3>
              <p className="text-[#B6DA8B] text-sm font-medium">
                {loadingLeft || loadingRight
                  ? "Calculando..."
                  : `${intersection.length} episodios en común`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:block w-16 h-0.5 bg-gradient-to-l from-[#8BC547] to-transparent"></div>
              <div className="relative">
                <Image
                  src={imageRight}
                  alt={nameRight}
                  width={48}
                  height={48}
                  className={`rounded-full object-cover border-2 border-[#8BC547] shadow-lg
                    transform transition-all duration-300 ease-in-out
                    hover:scale-110 ${onRightClick ? "cursor-pointer" : ""}`}
                  onClick={onRightClick}
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(statusRight)} rounded-full border-2 border-white`}
                ></div>
              </div>
            </div>
          </div>

          <div className="text-white max-w-4xl mx-auto">
            {renderList(
              intersection,
              "No comparten episodios",
              loadingLeft || loadingRight,
              loadingLeft ? progressLeft : progressRight,
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
