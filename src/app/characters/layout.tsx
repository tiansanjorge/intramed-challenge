import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export default function CharactersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(139, 197, 71, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(182, 218, 139, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(53, 78, 24, 0.08) 0%, transparent 40%),
          linear-gradient(135deg, #e8ebe4 0%, #dde0d8 50%, #d4d8cd 100%)
        `,
      }}
    >
      {/* Patrón de fondo decorativo */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(53, 78, 24, 0.4) 35px, rgba(53, 78, 24, 0.4) 70px),
            repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(139, 197, 71, 0.4) 35px, rgba(139, 197, 71, 0.4) 70px)
          `,
        }}
      />

      {/* Círculos decorativos flotantes */}
      <div className="absolute top-32 left-10 w-64 h-64 bg-[#8BC547]/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-[#B6DA8B]/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#354E18]/5 rounded-full blur-2xl" />

      <Header />
      <main className="flex-grow relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
