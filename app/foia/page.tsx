"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  ChevronRight,
  Lock,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "#ffaa00",
  processing: "#0088ff",
  fulfilled: "#00ff00",
  denied: "#ff3333",
  partial: "#ff8800",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3.5 h-3.5" />,
  processing: <AlertCircle className="w-3.5 h-3.5" />,
  fulfilled: <CheckCircle2 className="w-3.5 h-3.5" />,
  denied: <XCircle className="w-3.5 h-3.5" />,
  partial: <Shield className="w-3.5 h-3.5" />,
};

type FormState = "idle" | "submitting" | "success" | "error";

export default function FoiaPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    subject: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.description) {
      setErrorMsg("All required fields must be filled.");
      return;
    }
    setFormState("submitting");
    try {
      const res = await fetch("/api/foia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setFormState("success");
    } catch {
      setFormState("error");
      setErrorMsg("Submission failed. Try again.");
    }
  };

  const Field = ({
    label,
    required,
    children,
  }: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
  }) => (
    <div>
      <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );

  const inputClass =
    "w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff00]/50 focus:ring-1 focus:ring-[#00ff00]/20 transition-all";

  return (
    <div className="min-h-screen pt-16 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">
            <Shield className="w-3.5 h-3.5 text-[#00ff00]" />
            Freedom of Information Act
          </div>
          <h1 className="font-mono text-4xl font-black text-white tracking-tight mb-3">
            FOIA REQUEST CENTER
          </h1>
          <p className="text-white/50 leading-relaxed max-w-xl font-light">
            Submit a formal Freedom of Information Act request to access classified or restricted
            intelligence documents. All requests are reviewed by authorized personnel and processed
            within 20 business days per federal statute.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {formState === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#00ff00]/5 border border-[#00ff00]/20 rounded-2xl p-12 flex flex-col items-center gap-4 text-center"
                >
                  <div className="p-4 bg-[#00ff00]/10 rounded-full">
                    <CheckCircle2 className="w-10 h-10 text-[#00ff00]" />
                  </div>
                  <h2 className="font-mono text-xl font-bold text-white">REQUEST SUBMITTED</h2>
                  <p className="font-mono text-sm text-white/50 max-w-sm">
                    Your FOIA request has been logged and assigned a tracking number. You will
                    receive confirmation at the email provided within 5 business days.
                  </p>
                  <div className="font-mono text-[10px] text-[#00ff00]/60 tracking-widest mt-2">
                    CASE NO: FOIA-{Date.now().toString(36).toUpperCase()}
                  </div>
                  <button
                    onClick={() => {
                      setFormState("idle");
                      setForm({ name: "", email: "", organization: "", subject: "", description: "" });
                    }}
                    className="mt-4 font-mono text-xs text-white/40 hover:text-white transition-colors"
                  >
                    Submit another request →
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 space-y-5"
                >
                  <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Form IA-2024 — FOIA Request Submission
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Full Name" required>
                      <input
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="John Doe"
                        className={inputClass}
                        required
                      />
                    </Field>
                    <Field label="Email Address" required>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="agent@domain.com"
                        className={inputClass}
                        required
                      />
                    </Field>
                    <Field label="Organization / Agency">
                      <input
                        value={form.organization}
                        onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                        placeholder="Optional"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Request Subject" required>
                      <input
                        value={form.subject}
                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                        placeholder="e.g. Roswell Incident Files"
                        className={inputClass}
                        required
                      />
                    </Field>
                  </div>

                  <Field label="Detailed Description" required>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      rows={5}
                      placeholder="Describe the specific records you are seeking, including dates, subject matter, agencies involved, or any other details that would help locate the records..."
                      className={`${inputClass} resize-none`}
                      required
                    />
                  </Field>

                  {(formState === "error" || errorMsg) && (
                    <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 font-mono text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {errorMsg || "An error occurred. Please try again."}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="w-full py-3.5 bg-[#00ff00]/10 hover:bg-[#00ff00]/20 border border-[#00ff00]/30 hover:border-[#00ff00]/60 text-[#00ff00] font-mono text-sm rounded-xl uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {formState === "submitting" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#00ff00]/30 border-t-[#00ff00] rounded-full animate-spin" />
                        TRANSMITTING REQUEST...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        SUBMIT FOIA REQUEST
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Process Timeline */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">
                Processing Timeline
              </div>
              <div className="space-y-4">
                {[
                  { step: "01", label: "Submission", desc: "Request logged & assigned case number", color: "#00ff00" },
                  { step: "02", label: "Review", desc: "Analysts review scope & clearance", color: "#0088ff" },
                  { step: "03", label: "Processing", desc: "Records located & reviewed for exemptions", color: "#ffaa00" },
                  { step: "04", label: "Response", desc: "Documents released, denied, or partial", color: "#ff8800" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div
                      className="font-mono text-[10px] font-bold w-6 shrink-0 mt-0.5"
                      style={{ color: item.color }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <div className="font-mono text-xs text-white">{item.label}</div>
                      <div className="font-mono text-[10px] text-white/40 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Legend */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">
                Request Status Codes
              </div>
              <div className="space-y-2">
                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color }}>
                      {status}
                    </span>
                    <span className="font-mono text-[9px] text-white/30 ml-auto">
                      {status === "pending" && "Awaiting review"}
                      {status === "processing" && "Under analysis"}
                      {status === "fulfilled" && "Records released"}
                      {status === "denied" && "Request denied"}
                      {status === "partial" && "Partial release"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Note */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-mono text-[10px] text-amber-400 uppercase tracking-widest mb-1">
                    Legal Notice
                  </div>
                  <p className="font-mono text-[10px] text-white/40 leading-relaxed">
                    Submitting false information in a FOIA request may constitute a federal offense under 18 U.S.C. § 1001. All requests are processed in accordance with 5 U.S.C. § 552.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
