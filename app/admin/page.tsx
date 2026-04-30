import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Image, Building2, Upload, TrendingUp, Lock, Unlock, Clock, Shield, Terminal, Activity, Tag, Users, Globe } from "lucide-react";
import { GlitchTitle } from "@/components/effects/GlitchTitle";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [totalDocs, classified, declassified, totalAgencies, totalMedia, recentDocs] =
      await Promise.all([
        prisma.document.count(),
        prisma.document.count({ where: { status: "classified" } }),
        prisma.document.count({ where: { status: "declassified" } }),
        prisma.agency.count(),
        prisma.media.count(),
        prisma.document.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { agency: true },
        }),
      ]);

    return { totalDocs, classified, declassified, totalAgencies, totalMedia, recentDocs };
  } catch (error) {
    console.error("DASHBOARD_TELEMETRY_OFFLINE", error);
    return { 
      totalDocs: 0, classified: 0, declassified: 0, 
      totalAgencies: 0, totalMedia: 0, recentDocs: [] as any[] 
    };
  }
}

export default async function AdminDashboard() {
  const { totalDocs, classified, declassified, totalAgencies, totalMedia, recentDocs } =
    await getStats();

  const cards = [
    { label: "Total Documents", value: totalDocs, icon: FileText, color: "#00ff00", href: "/admin/documents" },
    { label: "Classified", value: classified, icon: Lock, color: "#ff0000", href: "/admin/documents?status=classified" },
    { label: "Declassified", value: declassified, icon: Unlock, color: "#00ffaa", href: "/admin/documents?status=declassified" },
    { label: "Agencies", value: totalAgencies, icon: Building2, color: "#0066cc", href: "/admin/agencies" },
    { label: "Media Files", value: totalMedia, icon: Image, color: "#ff6600", href: "/admin/media" },
    { label: "Tag Manager", value: "CRUD", icon: Tag, color: "#aa00ff", href: "/admin/tags" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="font-mono text-4xl font-black text-white tracking-tighter uppercase italic">
            <GlitchTitle text="AGENT DESK" />
          </h1>
          <p className="font-mono text-[10px] text-white/40 mt-1 uppercase tracking-widest">
            Level 5 Clearance // System Status: <span className="text-[#00ff00]">STABLE</span>
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
           <Link href="/admin/upload" className="px-4 py-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] font-mono text-[10px] uppercase tracking-widest rounded-lg hover:bg-[#00ff00]/20 transition-all">
             New_Record
           </Link>
           <Link href="/admin/media/batch" className="px-4 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 font-mono text-[10px] uppercase tracking-widest rounded-lg hover:bg-orange-500/20 transition-all">
             Batch_Upload
           </Link>
           <Link href="/admin/documents/bulk" className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-[10px] uppercase tracking-widest rounded-lg hover:bg-blue-500/20 transition-all">
             Bulk_Edit
           </Link>
           <Link href="/admin/media" className="px-4 py-2 bg-white/5 border border-white/10 text-white/60 font-mono text-[10px] uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all">
             Media_Archive
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
              <TrendingUp className="w-3 h-3 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
            <div className="font-mono text-3xl font-bold text-white mb-1">{card.value}</div>
            <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Forensic Intelligence Lab Link */}
      <div className="bg-[#00ff00]/5 border border-[#00ff00]/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2">
           <h2 className="font-mono text-xl font-black text-white uppercase italic tracking-tighter">Forensic_Intelligence_Lab_v4.2</h2>
           <p className="text-white/40 font-mono text-xs max-w-xl italic">
             Access high-end analytical modules including Redaction Recovery, Paperclip Connectivity Graphs, and Whistleblower Veracity Analyzers.
           </p>
        </div>
        <Link href="/forensics" className="w-full md:w-auto px-8 py-4 bg-[#00ff00] text-black font-mono text-sm font-bold uppercase rounded-xl hover:bg-[#00ffaa] transition-all tracking-widest text-center">
           Enter_Forensic_Lab
        </Link>
      </div>

      {/* Recent Documents & System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Uploads */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Clock className="w-4 h-4 text-white/40" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-white/40">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-2">
            {recentDocs.length === 0 ? (
              <p className="font-mono text-xs text-white/20 text-center py-4">
                NO_RECORDS_FOUND
              </p>
            ) : (
              recentDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: doc.status === "classified" ? "#ff0000" : "#00ff00" }}
                    />
                    <div>
                      <div className="font-mono text-xs text-white truncate max-w-[180px]">{doc.title}</div>
                      <div className="font-mono text-[9px] text-white/30">{doc.agency.name} // {doc.year}</div>
                    </div>
                  </div>
                  <Link href={`/admin/documents/${doc.id}`} className="font-mono text-[9px] text-[#00ff00] hover:underline uppercase">Edit_Record</Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Master System Log */}
        <div className="bg-black border border-[#00ff00]/20 rounded-xl p-6 font-mono text-[10px]">
          <div className="flex items-center justify-between mb-5 border-b border-[#00ff00]/10 pb-3">
            <div className="flex items-center gap-2 text-[#00ff00]">
              <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse" />
              MASTER_SYSTEM_LOG
            </div>
            <div className="text-white/20 uppercase tracking-tighter">Live Monitor</div>
          </div>
          <div className="space-y-2 text-[#00ff00]/70 overflow-hidden h-[180px]">
            <div className="flex gap-4"><span className="text-[#00ff00]/30 shrink-0">[02:52:12]</span> <span className="text-blue-400">INFO:</span> DB_CONNECTOR_STABLE</div>
            <div className="flex gap-4"><span className="text-[#00ff00]/30 shrink-0">[02:52:15]</span> <span className="text-yellow-400">WARN:</span> ANOMALOUS_ACCESS_ATTEMPT_ST_7</div>
            <div className="flex gap-4"><span className="text-[#00ff00]/30 shrink-0">[02:52:18]</span> <span className="text-green-400">AUTH:</span> SESSION_RENEWED_ADMIN_01</div>
            <div className="flex gap-4"><span className="text-[#00ff00]/30 shrink-0">[02:52:22]</span> <span className="text-purple-400">INTEL:</span> AQUARIUS_PACKET_DECRYPTED</div>
            <div className="flex gap-4"><span className="text-[#00ff00]/30 shrink-0">[02:52:25]</span> <span className="text-red-400">TRACE:</span> IP_SPOOF_ACTIVE_MOSSAD_NODE</div>
            <div className="flex gap-4"><span className="text-[#00ff00]/30 shrink-0">[02:52:28]</span> <span className="text-green-400">SCAN:</span> FILESYSTEM_INTEGRITY_100%</div>
          </div>
          <div className="mt-8 pt-4 border-t border-[#00ff00]/10 flex justify-between items-center text-[8px] text-white/30 uppercase tracking-[0.2em]">
            <span>Kernel: v4.20-intel-secure</span>
            <span className="animate-pulse">Active_Nodes: 47</span>
          </div>
        </div>
      </div>
    </div>
  );
}
