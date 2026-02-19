"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Zap,
  Heart,
  Search,
  Filter,
  Star,
  BarChart3,
} from "lucide-react";

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
    <div className="relative min-h-screen overflow-hidden cursor-default">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 animate-gradient"></div>

      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage: `url('/portada.jpg')`,
          filter: "blur(3px)",
        }}
      ></div>

      {/* Subtle dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/15"></div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-lime-500/20 rounded-full blur-3xl animate-particle-1"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl animate-particle-2"></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-purple-500/20 rounded-full blur-3xl animate-particle-1"
          style={{ animationDelay: "5s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-44 h-44 bg-lime-500/20 rounded-full blur-3xl animate-particle-2"
          style={{ animationDelay: "7s" }}
        ></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-4">
        <div className="w-full max-w-4xl">
          {/* Main content card */}
          <div className="p-6 md:p-8">
            {/* Logo with float animation */}
            <div className="animate-float animate-scale-in">
              <img
                src="/brand-logo.svg"
                alt="Rick and Morty logo"
                className="mx-auto max-w-md w-full drop-shadow-2xl"
              />
            </div>

            {/* CTA Button with glow effect */}
            <div className="animate-scale-in delay-100 text-center mt-8">
              <button
                className="group relative bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-400 hover:to-lime-500 text-black font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 animate-pulse-glow overflow-hidden"
                onClick={() => router.push("/characters")}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Comenzar
                  <Zap
                    className="w-5 h-5"
                    fill="#22d3ee"
                    stroke="#000000"
                    strokeWidth="2"
                  />
                </span>
                <div className="absolute inset-0 animate-shimmer"></div>
              </button>
            </div>

            {/* Features grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in-up delay-200">
              <div className="glass-effect rounded-xl p-4 border border-lime-500/20 hover:border-lime-500/50 transition-all duration-300 hover:scale-105 group">
                <Search className="w-8 h-8 text-lime-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                <p className="text-sm font-semibold text-gray-200 text-center">
                  Búsqueda Avanzada
                </p>
              </div>
              <div className="glass-effect rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 group">
                <Filter className="w-8 h-8 text-cyan-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                <p className="text-sm font-semibold text-gray-200 text-center">
                  Filtros Dinámicos
                </p>
              </div>
              <div className="glass-effect rounded-xl p-4 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 group">
                <Heart className="w-8 h-8 text-pink-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                <p className="text-sm font-semibold text-gray-200 text-center">
                  Sistema de Favoritos
                </p>
              </div>
              <div className="glass-effect rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 group">
                <BarChart3 className="w-8 h-8 text-purple-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
                <p className="text-sm font-semibold text-gray-200 text-center">
                  Comparación de Episodios
                </p>
              </div>
            </div>

            {/* Features list */}
            <div className="mt-4 space-y-3 animate-slide-in-up delay-300">
              <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base">
                <span className="glass-effect px-4 py-2 rounded-full border border-white/10 text-gray-300 hover:border-lime-500/50 transition-all">
                  ✨ Full Responsive
                </span>
                <span className="glass-effect px-4 py-2 rounded-full border border-white/10 text-gray-300 hover:border-lime-500/50 transition-all">
                  🎨 UI Moderna
                </span>
                <span className="glass-effect px-4 py-2 rounded-full border border-white/10 text-gray-300 hover:border-lime-500/50 transition-all">
                  ⚡ UX Intuitiva
                </span>
                <span className="glass-effect px-4 py-2 rounded-full border border-white/10 text-gray-300 hover:border-lime-500/50 transition-all">
                  📊 Vista Detalle
                </span>
              </div>
            </div>

            {/* Test badge */}
            <div className="mt-4 flex justify-center animate-scale-in delay-400">
              <div className="glass-effect flex items-center gap-2 font-bold px-6 py-3 rounded-full border-2 border-lime-400 text-lime-400 shadow-lg shadow-lime-500/20 hover:shadow-lime-500/40 transition-all hover:scale-105">
                <Check className="w-6 h-6" />
                <span className="text-sm md:text-base">100% TESTEADA</span>
                <Star className="w-6 h-6 fill-lime-400" />
              </div>
            </div>

            {/* Developer info */}
            <div className="mt-6 pt-6 border-t border-white/10 animate-slide-in-up delay-500 text-center">
              <p className="text-gray-400 text-sm mb-2">Desarrollado por</p>
              <a
                href="https://ssanjorge.netlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400 hover:from-lime-300 hover:to-cyan-300 transition-all duration-300 hover:scale-110 transform"
              >
                Sebastián Sanjorge
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
