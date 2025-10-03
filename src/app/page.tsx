"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
            className="mx-auto mb-6"
          />
          <h2 className="text-2xl font-semibold mb-4">Bienvenido</h2>
          <p className="mb-6 font-medium w-full mx-auto">
            App interactiva de Rick & Morty con búsqueda, filtros, favoritos y
            vista de episodios. Desarrollada con microfrontends e integrada con
            una librería de componentes propia. Diseño responsive y enfoque en
            una experiencia UX/UI moderna e intuitiva.
          </p>
          <button
            className="bg-lime-500 hover:bg-lime-600 text-black font-semibold py-2 px-6 rounded-full shadow-md transition"
            onClick={() => router.push("/characters")}
          >
            Comenzar
          </button>
          <p className="mt-20">Desarrollado por</p>
          <p className="text-xl font-bold">Sebastián Sanjorge</p>
        </div>
      </div>
    </div>
  );
}
