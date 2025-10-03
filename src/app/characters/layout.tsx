import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export default function CharactersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#E6E7E3]">
      {" "}
      <Header /> <main className="flex-grow">{children}</main> <Footer />{" "}
    </div>
  );
}
