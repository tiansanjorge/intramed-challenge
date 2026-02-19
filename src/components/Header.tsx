"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { setSearchText } from "@/store/searchSlice";
import Image from "next/image";
import { useState } from "react";

export const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchText = useSelector((state: RootState) => state.search.searchText);
  const [logoLoaded, setLogoLoaded] = useState(false);

  return (
    <header
      className="relative bg-cover bg-center h-[256px] sm:h-[328px] flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage: `
          radial-gradient(
            30% 50% at 50% 50%, 
            rgba(0, 0, 0, 0.3) 25%, 
            rgba(0, 0, 0, 0.7) 100%
          ),
          url('/portada.jpg')
        `,
        backgroundPosition: "center 40%",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
      }}
    >
      <div className="absolute inset-0"></div>

      <div className="relative z-10 text-center w-full sm:max-w-[75%] ">
        {/* Logo optimizado con carga suave */}
        <div className="relative mx-auto mb-6 w-72 h-[127px]">
          {/* Skeleton placeholder sutil */}
          {!logoLoaded && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-lime-400/10 via-lime-400/20 to-lime-400/10 
              animate-pulse rounded-lg blur-sm"
            />
          )}

          <Image
            src="/logo.png"
            alt="Rick and Morty"
            width={288}
            height={127}
            priority
            className={`cursor-pointer 
              transform transition-all duration-300 ease-in-out
              hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(139,197,71,0.4)]
              active:scale-95
              ${logoLoaded ? "opacity-100" : "opacity-0"}`}
            onClick={() => router.push("/")}
            onLoad={() => setLogoLoaded(true)}
          />
        </div>

        {/* Input de búsqueda */}
        <div
          className="flex items-center bg-black border border-white/30 rounded-lg px-4 py-2
            transition-all duration-300 ease-in-out
            hover:border-lime-400/50 hover:shadow-lg hover:shadow-lime-400/20
            focus-within:border-lime-400 focus-within:shadow-xl focus-within:shadow-lime-400/30
            focus-within:scale-[1.02]"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        >
          <svg
            className="w-5 h-5 text-lime-400 mr-3 transition-transform duration-300 ease-in-out
              group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M16.65 11.5a5.15 5.15 0 11-10.3 0 5.15 5.15 0 0110.3 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar personaje por nombre"
            value={searchText}
            onChange={(e) => dispatch(setSearchText(e.target.value))}
            className="bg-transparent text-white placeholder-white/70 w-full focus:outline-none
              transition-all duration-200"
          />
        </div>
      </div>
    </header>
  );
};
