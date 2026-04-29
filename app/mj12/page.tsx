"use client";

import { motion } from "framer-motion";
import { Star, Shield, FileText, ExternalLink, AlertTriangle, Lock, Users, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

const MJ12_MEMBERS = [
  { name: "Roscoe H. Hillenkoetter", role: "Director of Central Intelligence (1947–50)", status: "CONFIRMED" },
  { name: "Vannevar Bush", role: "Chairman, Joint Research and Development Board", status: "CONFIRMED" },
  { name: "James Forrestal", role: "Secretary of Defense", status: "CONFIRMED" },
  { name: "Nathan F. Twining", role: "Chief of Staff, US Air Force", status: "CONFIRMED" },
  { name: "Hoyt S. Vandenberg", role: "Chief of Staff, US Air Force (1948–53)", status: "CONFIRMED" },
  { name: "Detlev Bronk", role: "Chairman, National Research Council", status: "CONFIRMED" },
  { name: "Jerome Hunsaker", role: "Chairman, National Advisory Committee for Aeronautics", status: "CONFIRMED" },
  { name: "Sidney Souers", role: "Executive Secretary, National Security Council", status: "CONFIRMED" },
  { name: "Gordon Gray", role: "Special Assistant to the President for NSA", status: "CONFIRMED" },
  { name: "Donald Menzel", role: "Director, Harvard College Observatory", status: "ALLEGED" },
  { name: "Robert M. Montague", role: "Commander, Sandia Base", status: "ALLEGED" },
  { name: "Lloyd Berkner", role: "Research Director, Carnegie Institution", status: "ALLEGED" },
];

const KEY_DOCUMENTS = [
  {
    title: "Majestic 12 Briefing Document (1952)",
    desc: "Alleged briefing prepared for President-Elect Eisenhower on November 18, 1952. Describes the recovery of crashed craft near Roswell and the creation of MJ-12 by executive order in 1947.",
    url: "https://www.majesticdocuments.com/",
    classification: "ULTRA TOP SECRET",
    year: "1952",
  },
  {
    title: "Cutler-Twining Memo (1954)",
    desc: "A memo from Robert Cutler (NSC Special Assistant) to General Nathan Twining, referencing 'MJ-12 Special Studies Project.' Found in the National Archives in 1985. The only MJ-12 document found in official government files.",
    url: "https://www.archives.gov/",
    classification: "TOP SECRET",
    year: "1954",
  },
  {
    title: "SOM 1-01: Extraterrestrial Entities and Technology — Recovery and Disposal",
    desc: "Alleged 1954 Majestic-12 Group special operations manual detailing recovery procedures for crashed ET craft and biological entities (EBEs). Outlines security protocols and 'sanitization' of crash sites.",
    url: "https://www.majesticdocuments.com/",
    classification: "ULTRA TOP SECRET",
    year: "1954",
  },
  {
    title: "Aquarius Briefing Document (1977)",
    desc: "NSA document referencing Project Aquarius as a sub-project of MJ-12. Heavily redacted. Describes ongoing surveillance and interaction programs with extraterrestrial biological entities.",
    url: "https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/ufo/",
    classification: "TOP SECRET",
    year: "1977",
  },
];

const TIMELINE = [
  { year: "1947", event: "Roswell crash — alleged recovery of craft and EBEs. President Truman signs classified executive order creating MJ-12." },
  { year: "1947", event: "First MJ-12 meeting. Group formed with 12 members drawn from military, intelligence, and science." },
  { year: "1948", event: "EBE-1 (alleged surviving entity from Roswell) dies in captivity. Cause of death undetermined." },
  { year: "1949", event: "James Forrestal (MJ-12 member, Secretary of Defense) forced to resign. Dies May 22 from fall from Bethesda hospital window. MJ-12 concerned about his mental stability and leaking." },
  { year: "1952", event: "MJ-12 briefing document prepared for President-Elect Eisenhower." },
  { year: "1953", event: "Project Sigma initiated — alleged attempt to communicate with ETs via radio signals." },
  { year: "1954", event: "President Eisenhower allegedly meets with ETs at Holloman AFB. SOM 1-01 manual issued." },
  { year: "1954", event: "Grenada Treaty allegedly signed between US government and a group of ETs, exchanging technology for abduction rights." },
  { year: "1961", event: "President Kennedy allegedly demands CIA/MJ-12 share UFO files. Denied." },
  { year: "1984", event: "MJ-12 documents surface, given to researcher Jaime Shandera on undeveloped film." },
  { year: "1985", event: "Cutler-Twining memo discovered in National Archives — only MJ-12 document in official files." },
  { year: "2017", event: "DIA's Advanced Aerospace Threat Identification Program (AATIP) exposed; Luis Elizondo resigns." },
  { year: "2023", event: "David Grusch testifies before Congress about crash retrieval programs — echoing MJ-12 allegations." },
];

const CLASS_COLORS: Record<string, string> = {
  "ULTRA TOP SECRET": "#ff3333",
  "TOP SECRET": "#ffaa00",
  "CLASSIFIED": "#ff8800",
};

export default function MJ12Page() {
  return (
    <div className="min-h-screen pt-16 bg-[#030303]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-red-500/10 py-20 px-6 bg-gradient-to-br from-red-950/30 to-transparent">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.1)_3px,rgba(0,0,0,0.1)_4px)] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-2 font-mono text-[10px] text-red-400/60 uppercase tracking-widest mb-4">
            <Star className="w-3.5 h-3.5" />
            COMPARTMENTED SPECIAL ACCESS PROGRAM
          </div>
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="font-mono text-6xl font-black tracking-tighter text-white mb-2">MAJESTIC-12</h1>
              <p className="font-mono text-xl text-red-400/70">Alleged Secret UFO Oversight Committee</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-mono text-[10px] px-3 py-1.5 border border-red-500/30 bg-red-500/10 text-red-400 rounded-lg uppercase tracking-widest">ULTRA TOP SECRET</span>
              <span className="font-mono text-[9px] text-white/20">Existence: DISPUTED</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl max-w-3xl">
            <p className="font-mono text-xs text-white/60 leading-relaxed">
              <span className="text-red-400">⚠ NOTICE:</span> The authenticity of MJ-12 documents remains officially disputed. The FBI investigated the documents in 1988 and determined they were fabricated. However, the Cutler-Twining memo was found in official National Archives files. Multiple government insiders have referenced the program by name. The truth remains classified — or does not officially exist.
            </p>
          </div>

          <p className="mt-6 text-white/50 text-sm leading-relaxed max-w-3xl font-light">
            Operation Majestic-12 (also known as MJ-12, Majority-12, or MAJIC) is the alleged name of a secret committee of scientists, military leaders, and government officials, formed in 1947 by executive order of President Harry S. Truman. Its alleged purpose: to investigate, recover, and maintain absolute secrecy concerning crashed extraterrestrial craft and biological entities recovered on American soil.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">

        {/* What is MJ-12 */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <SectionHeader title="WHAT IS MAJESTIC-12?" icon={<Shield className="w-4 h-4" />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {[
              { title: "Origins", text: "MJ-12 allegedly emerged from the chaos following the July 1947 Roswell, New Mexico crash. With multiple credible witnesses, recovered debris, and alleged bodies, President Truman needed a mechanism to manage the intelligence and prevent public panic." },
              { title: "Structure", text: "Twelve senior officials — a mix of military commanders, intelligence directors, and civilian scientists — were handpicked. They operated above normal government oversight, answering only to the President and sworn to absolute secrecy." },
              { title: "Mission", text: "To investigate the crashed craft and occupants, reverse-engineer their technology, manage public perception through disinformation, and establish protocols for future encounters with non-human intelligence." },
              { title: "Legacy", text: "Whether real or fabricated, MJ-12 documents have profoundly shaped UFO research. Congressional whistleblower David Grusch's 2023 testimony described programs matching MJ-12 accounts almost exactly — under oath." },
            ].map((card) => (
              <div key={card.title} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                <div className="font-mono text-[10px] text-red-400/70 uppercase tracking-widest mb-2">{card.title}</div>
                <p className="text-sm text-white/60 leading-relaxed font-light">{card.text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Members */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <SectionHeader title="THE 12 MEMBERS" icon={<Users className="w-4 h-4" />} />
          <p className="text-sm text-white/40 mt-2 mb-6 font-light">
            All 12 alleged members were real historical figures in senior government and scientific positions in 1947. Their selection has been cited as evidence of authenticity — a forger would need deep historical knowledge.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MJ12_MEMBERS.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} viewport={{ once: true }}
                className="flex items-start gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <div className="font-mono text-lg font-black text-white/10 w-6 shrink-0 text-right">{String(i + 1).padStart(2, "0")}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs font-bold text-white">{member.name}</div>
                  <div className="font-mono text-[9px] text-white/40 mt-0.5">{member.role}</div>
                </div>
                <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded border shrink-0 ${member.status === "CONFIRMED" ? "text-amber-400 border-amber-400/20 bg-amber-400/5" : "text-red-400 border-red-400/20 bg-red-400/5"}`}>
                  {member.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Key Documents */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <SectionHeader title="KEY DOCUMENTS" icon={<FileText className="w-4 h-4" />} />
          <div className="space-y-4 mt-6">
            {KEY_DOCUMENTS.map((doc, i) => (
              <motion.div key={doc.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} viewport={{ once: true }}
                className="bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-xl p-5 transition-all group">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[8px] px-2 py-0.5 rounded border uppercase"
                        style={{ color: CLASS_COLORS[doc.classification] || "#fff", borderColor: `${CLASS_COLORS[doc.classification] || "#fff"}30`, backgroundColor: `${CLASS_COLORS[doc.classification] || "#fff"}10` }}>
                        {doc.classification}
                      </span>
                      <span className="font-mono text-[9px] text-white/30">{doc.year}</span>
                    </div>
                    <h3 className="font-mono text-sm font-bold text-white">{doc.title}</h3>
                  </div>
                </div>
                <p className="text-xs text-white/50 leading-relaxed font-light mb-3">{doc.desc}</p>
                <a href={doc.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-mono text-[10px] text-white/30 hover:text-[#00ff00] transition-colors group-hover:text-white/50">
                  <ExternalLink className="w-3 h-3" /> View Source
                </a>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Timeline */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <SectionHeader title="CHRONOLOGY" icon={<Calendar className="w-4 h-4" />} />
          <div className="mt-6 space-y-0 border-l border-white/10 pl-6 ml-3">
            {TIMELINE.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} viewport={{ once: true }}
                className="relative pb-6 last:pb-0">
                <div className="absolute -left-[29px] top-0.5 w-3 h-3 rounded-full border border-red-500/40 bg-[#030303] flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-red-500/60" />
                </div>
                <div className="font-mono text-[10px] text-red-400/60 mb-1">{item.year}</div>
                <p className="font-mono text-xs text-white/50 leading-relaxed">{item.event}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Related Projects */}
        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <SectionHeader title="RELATED PROGRAMS" icon={<Shield className="w-4 h-4" />} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
            {["aquarius", "sigma", "stargate", "blue-book", "gateway", "aatip"].map((slug) => (
              <Link key={slug} href={`/projects/${slug}`} className="flex items-center justify-between font-mono text-xs text-white/40 hover:text-white py-2.5 px-4 rounded-xl border border-white/5 hover:border-white/20 hover:bg-white/5 uppercase tracking-widest transition-all group">
                {slug.replace("-", " ")}
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Disclaimer */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-[10px] text-amber-400 uppercase tracking-widest mb-2">Research Disclaimer</div>
              <p className="font-mono text-xs text-white/50 leading-relaxed">
                The MJ-12 documents have not been officially authenticated by any government agency. The FBI concluded in 1988 they were fabricated. However, no government agency has definitively proven them forgeries, and the Cutler-Twining memo remains in the National Archives. This archive presents all information for research purposes. The existence of Majestic-12 as a formal government body is unconfirmed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pb-3 border-b border-white/5">
      <span className="text-red-400/60">{icon}</span>
      <span className="font-mono text-xs text-white/40 uppercase tracking-[0.25em]">{title}</span>
    </div>
  );
}
