import { Hero } from "@/components/home/Hero";
import { AgencySelector } from "@/components/home/AgencySelector";
import { DocumentGrid } from "@/components/home/DocumentGrid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <AgencySelector />
      <Hero />
      <DocumentGrid />

      <footer className="mt-auto py-12 px-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 opacity-30">
          <div className="w-2 h-2 rounded-full bg-[#00ff00]" />
          <span className="font-mono text-[10px] uppercase tracking-widest">
            Global Intelligence Network v2.4.0
          </span>
        </div>
        <div className="text-[10px] font-mono text-white/20 uppercase">
          &copy; {new Date().getFullYear()} Classified Archive. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
