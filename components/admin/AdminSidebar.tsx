"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Image,
  Building2,
  Upload,
  LogOut,
  ShieldAlert,
  ExternalLink,
  Shield,
  CheckCircle2,
  Clock,
  Archive as ArchiveIcon,
  Eye,
  AlertTriangle,
  Globe,
  Folder,
} from "lucide-react";

const navGroups = [
  {
    label: "Management",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/upload", label: "Upload Document", icon: Upload },
      { href: "/admin/documents", label: "Documents", icon: FileText },
      { href: "/admin/media", label: "Media Archive", icon: Image },
      { href: "/admin/agencies", label: "Agencies", icon: Building2 },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/admin/operations", label: "Operations", icon: Folder },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 fixed top-0 left-0 h-full bg-black/80 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-red-500/20 blur-md rounded-full" />
            <ShieldAlert className="w-5 h-5 text-red-400 relative z-10" />
          </div>
          <div>
            <div className="font-mono text-sm font-bold text-white">INTEL ARCHIVE</div>
            <div className="font-mono text-[9px] text-red-400/60 uppercase tracking-widest">Admin Control Center</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="font-mono text-[9px] text-white/20 uppercase tracking-widest px-3 mb-2">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-xs transition-all group ${
                      isActive
                        ? "bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/20"
                        : "text-white/40 hover:text-white/80 hover:bg-white/5"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? "text-[#00ff00]" : "text-white/30 group-hover:text-white/60"}`} />
                    {item.label}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-xs text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          View Public Archive
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
}
