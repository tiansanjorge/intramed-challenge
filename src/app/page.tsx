"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);

    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center sm:bg-[url('/portada.jpg')]"
      style={{
        backgroundImage: isMobile
          ? `
          radial-gradient(
            70% 35% at 50% 50%,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.8) 100%
          ),
          url('/portada.jpg')
        `
          : undefined,
        backgroundBlendMode: isMobile ? "multiply" : undefined,
      }}
    >
      <div className="absolute inset-0 sm:bg-black sm:bg-opacity-60"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full sm:w-10/12 md:w-8/12 lg:w-6/12 p-8 rounded-xl text-center text-white">
          <img
            src="/brand-logo.svg"
            alt="Rick and Morty logo"
            className="mx-auto"
          />
          <h2 className="text-2xl font-semibold mb-4">Bienvenido</h2>
          <div className="mb-6 font-medium w-8/12 mx-auto">
            App interactiva con selección de personajes y comparación de
            apariciones en episodios.
          </div>
          <button
            className="bg-lime-500 hover:bg-lime-600 text-black font-semibold py-2 px-6 rounded-full shadow-md transition"
            onClick={() => router.push("/characters")}
          >
            Comenzar
          </button>
          <p className="mt-14 font-bold">EXTRAS:</p>
          <p className=" ">
            Búsqueda • Filtros • Favoritos • Vista de detalle
          </p>{" "}
          <p>Full responsive • UI moderna • UX intuitiva</p>
          <h2 className="flex items-center justify-center gap-2 font-bold mt-4 border border-lime-400 rounded-full w-max mx-auto px-4 py-2">
            100% TESTEADA <Check className="w-6 h-6 text-lime-400" />
          </h2>
          <p className="mt-10">Desarrollado por</p>
          <a
            href="https://ssanjorge.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl font-bold hover:text-lime-400 transition duration-500 ease-in"
          >
            Sebastián Sanjorge
          </a>
        </div>
      </div>
    </div>
  );
}
