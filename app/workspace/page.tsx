"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * LEGACY_WORKSPACE_REDIRECT
 * The original 'Agent Workspace' was flagged as redundant/inutile by high-clearance operators.
 * This route now redirects to the Media Archive Registry (Admin Media Control).
 */
export default function WorkspaceRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the functional Media Registry
    router.replace("/admin/media");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center font-mono text-[#00ff00]">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <div className="text-xs uppercase tracking-[0.3em] animate-pulse">
        Transmitting_to_Media_Vault_Control...
      </div>
      <div className="text-[10px] text-white/20 mt-2 uppercase">
        Sector_Redirect: 0x47_WORKSPACE {"->"} 0xADMIN_MEDIA
      </div>
    </div>
  );
}
