"use client";

import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Calendar, Building2, Lock, Shield, FileText, ChevronDown, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Full project data with rich content
const PROJECT_DATA: Record<string, {
  slug: string; name: string; codename: string; agency: string; agencyColor: string;
  classification: string; years: string; overview: string; fullDescription: string[];
  keyFacts: string[]; keyFigures: string[]; timeline: { year: string; event: string }[];
  relatedDocs: { title: string; url: string }[];
  images: { url: string; caption: string }[];
  sourceUrl: string; coverColor: string; tags: string[];
}> = {
  "gateway": {
    slug: "gateway", name: "Analysis and Assessment of Gateway Process", codename: "GATEWAY EXPERIENCE",
    agency: "CIA / US Army Intelligence & Security Command",
    agencyColor: "#0066cc", classification: "DECLASSIFIED", years: "1983–1984",
    coverColor: "#003380", tags: ["consciousness", "hemi-sync", "monroe", "cia"],
    overview: "Colonel Wayne McDonnell's CIA-commissioned classified assessment of the Monroe Institute's Gateway Experience — a program using binaural beat audio to achieve altered states of consciousness. The report explores whether the human mind can transcend space-time.",
    fullDescription: [
      "In 1983, the US Army Intelligence and Security Command commissioned an internal assessment of the Monroe Institute's 'Gateway Experience' program. The task fell to Lieutenant Colonel Wayne McDonnell, who produced a classified document that would remain hidden for nearly 20 years.",
      "The Gateway Process uses a patented audio technology called Hemi-Sync — binaural beats that synchronize the brain's left and right hemispheres — to guide participants into deep meditative states. The Monroe Institute claimed these states allowed access to non-physical realms, including out-of-body experiences and contact with other intelligences.",
      "McDonnell's assessment took the program seriously. His report attempts to explain the Gateway's effects using physics — specifically, how human consciousness might operate as an energy field capable of interacting with the holographic universe described by physicist David Bohm.",
      "The document concludes that the Gateway Experience 'does work' and that the brain, synchronized via Hemi-Sync, enters states that transcend normal time-space constraints. McDonnell theorized that consciousness exists as a form of holographic energy that can, under certain conditions, access information beyond normal sensory limits.",
      "The CIA's interest in the program was practical: if remote viewing and altered states could provide intelligence value, the Gateway was worth studying. Project Stargate was already underway. The Gateway assessment was one piece of a broader government investigation into the weaponization of consciousness.",
      "The document was declassified in 2003 but attracted little attention until 2021, when it went viral on Reddit and social media — stunning readers with its serious academic tone and physics-based attempt to explain mystical experiences.",
    ],
    keyFacts: [
      "Document ID: CIA-RDP96-00788R001700210016-5",
      "Authored by: Lieutenant Colonel Wayne McDonnell, 1983",
      "Classification at time of writing: CONFIDENTIAL",
      "Declassified: 2003 via FOIA request",
      "Monroe Institute founded by Robert Monroe, who coined 'out-of-body experience'",
      "Hemi-Sync technology still commercially available today",
      "The report references physicist David Bohm's holographic universe theory",
      "Page 25 is famously missing from the declassified version",
    ],
    keyFigures: ["Lt. Col. Wayne McDonnell (author)", "Robert Monroe (Monroe Institute founder)", "David Bohm (physicist, referenced)", "Itzhak Bentov (referenced)"],
    timeline: [
      { year: "1956", event: "Robert Monroe begins experimenting with out-of-body experiences" },
      { year: "1971", event: "Monroe Institute for Applied Sciences founded in Virginia" },
      { year: "1972", event: "Project Stargate begins — government remote viewing program" },
      { year: "1978", event: "US Army sends personnel to Monroe Institute for evaluation" },
      { year: "1983", event: "McDonnell completes classified Gateway Experience assessment" },
      { year: "1995", event: "Project Stargate declassified by CIA" },
      { year: "2003", event: "Gateway document released under FOIA" },
      { year: "2021", event: "Document goes viral on Reddit, millions of reads" },
    ],
    relatedDocs: [
      { title: "Original CIA Document (CIA Reading Room)", url: "https://www.cia.gov/readingroom/document/cia-rdp96-00788r001700210016-5" },
      { title: "Project Stargate Collection (CIA)", url: "https://www.cia.gov/readingroom/collection/stargate" },
      { title: "Gateway Intermediate Workbook (Monroe Inst.)", url: "https://www.monroeinstitute.org/" },
      { title: "Assessment of Hemi-Sync Phase III (Classified Addendum)", url: "#" },
      { title: "Wayne McDonnell Personnel File (Redacted)", url: "#" },
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800", caption: "Altered state visualization — the Gateway Experience aims for expanded consciousness" },
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800", caption: "Binaural beat technology — core of the Hemi-Sync program" },
    ],
    sourceUrl: "https://www.cia.gov/readingroom/document/cia-rdp96-00788r001700210016-5",
  },
  "blue-beam": {
    slug: "blue-beam", name: "Project Blue Beam", codename: "BLUE BEAM",
    agency: "NASA / Department of Defense", agencyColor: "#0000ff",
    classification: "UNACKNOWLEDGED", years: "1983–Ongoing", coverColor: "#000033",
    tags: ["hologram", "invasion", "disinformation", "mind-control"],
    overview: "A highly controversial psychological operation designed to utilize advanced holographic technology to simulate a planetary extraterrestrial invasion or a 'Second Coming,' effectively consolidating global power under a single world government.",
    fullDescription: [
      "Project Blue Beam is an unacknowledged deep-cover program allegedly designed by NASA and the DoD. The objective is to create a New World Order by implementing a four-step process aimed at dissolving existing religions and national sovereignty.",
      "The first step involves the engineering of artificial earthquakes at specific locations where new archaeological discoveries will be 'found,' supposedly proving that all religions have been misinterpreted for centuries.",
      "The second step is a massive 'space show' featuring three-dimensional optical holograms and laser projections in every part of the world. These images will depict the deity or savior corresponding to the local religion, eventually merging into one 'true' god to unify the populace.",
      "The third step involves telepathic electronic two-way communication using low-frequency (ELF) waves to reach people in their minds, making them believe their god is speaking to them directly.",
      "The final step is the simulation of an alien invasion to force nations to pool their nuclear resources and a 'supernatural' event that will lead to the total acceptance of a global technocratic government.",
    ],
    keyFacts: [
      "Primary Tech: Satellite-based holographic projection",
      "Objective: Religious and geopolitical unification",
      "Status: Strictly Unacknowledged",
      "Linkage: HAARP / ELF communication",
    ],
    keyFigures: ["Serge Monast (Journalist who first leaked it)", "Classified DoD personnel"],
    timeline: [
      { year: "1983", event: "Initial conceptualization of atmospheric holographic projection" },
      { year: "1994", event: "Serge Monast publishes 'Project Blue Beam' findings" },
      { year: "2010", event: "Upgrade of global orbital laser network (alleged)" },
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.nasa.gov/",
  },
  "highjump": {
    slug: "highjump", name: "Operation Highjump", codename: "HIGHJUMP",
    agency: "US Navy / Task Force 68", agencyColor: "#000080",
    classification: "DECLASSIFIED // PARTIAL", years: "1946–1947", coverColor: "#001a33",
    tags: ["antarctica", "admiral-byrd", "base-211", "expedition"],
    overview: "The massive US Navy Antarctic expedition led by Admiral Richard E. Byrd. Officially a mapping mission, it reportedly involved a secret conflict with 'advanced craft' emerging from the ice, leading to an early withdrawal.",
    fullDescription: [
      "Operation Highjump, officially titled The United States Navy Antarctic Developments Program, was a massive expedition involving 4,700 men, 13 ships, and 33 aircraft. The official goals were to establish the research station Little America IV and map the continent.",
      "However, rumors persist that Highjump was actually a military operation to find and destroy 'Base 211' — a secret Nazi sanctuary in Neuschwabenland. Reports from the time mention Admiral Byrd warning of 'craft that can fly from pole to pole with incredible speed.'",
      "The expedition, scheduled to last six months, was abruptly terminated after only eight weeks. Byrd's personal logs and subsequent interviews hinted at an encounter with a superior technology that decimated the Navy's advanced task force.",
    ],
    keyFacts: [
      "Total Personnel: 4,700",
      "Fleet: 13 Ships including Aircraft Carrier USS Philippine Sea",
      "Duration: Terminated early (2 months instead of 6)",
      "Notable Quote: 'A new enemy that can fly from pole to pole' - Byrd",
    ],
    keyFigures: ["Admiral Richard E. Byrd", "Rear Admiral Richard H. Cruzen"],
    timeline: [
      { year: "1946", event: "Task Force 68 departs for Antarctica" },
      { year: "1947", event: "Conflict in Neuschwabenland (alleged); early withdrawal" },
      { year: "1947", event: "Byrd's warning published in Chilean newspaper 'El Mercurio'" },
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.history.navy.mil/",
  },
  "condign": {
    slug: "condign", name: "Project Condign", codename: "CONDIGN",
    agency: "UK Ministry of Defence (DI55)", agencyColor: "#cc0000",
    classification: "DECLASSIFIED", years: "1997–2000", coverColor: "#330000",
    tags: ["uk", "mod", "plasma", "uap"],
    overview: "The secret UK Ministry of Defence study into Unidentified Aerial Phenomena. It concluded that UAPs exist but attributed them to 'atmospheric plasma' rather than extraterrestrial visitors.",
    fullDescription: [
      "Project Condign was a secret study conducted by the UK government's Defence Intelligence Staff (DIS) between 1997 and 2000. The resulting 460-page report, 'Unidentified Aerial Phenomena in the UK Air Defence Region,' was released to the public in 2006.",
      "The report concluded that 'UAPs exist as a provable fact' but that they do not represent a threat to the UK. It theorized that most sightings were caused by 'buoyant plasma' formations — ionized air that can move at incredible speeds and reflect radar.",
      "Despite the plasma theory, the report admitted that these objects could perform maneuvers that defied current aeronautical understanding and that the underlying physics remained unknown.",
    ],
    keyFacts: [
      "Report Length: 460 Pages",
      "Core Theory: Atmospheric Plasma / Plasmoids",
      "Impact: Led to the closure of the MoD's UFO desk",
    ],
    keyFigures: ["Unnamed DI55 Intelligence Officer"],
    timeline: [
      { year: "1997", event: "Project initiated by MoD" },
      { year: "2000", event: "Final report completed" },
      { year: "2006", event: "Document released under FOIA" },
    ],
    relatedDocs: [
      { title: "MoD Project Condign Report (PDF)", url: "https://www.nationalarchives.gov.uk/" },
    ],
    images: [],
    sourceUrl: "https://www.nationalarchives.gov.uk/",
  },
  "blue-book": {
    slug: "blue-book", name: "Project Blue Book", codename: "BLUE BOOK",
    agency: "United States Air Force", agencyColor: "#004080",
    classification: "DECLASSIFIED", years: "1952–1969", coverColor: "#001a33",
    tags: ["ufo", "usaf", "investigation", "aerial-phenomena"],
    overview: "The longest-running official US government UFO investigation, analyzing over 12,618 sightings. Despite officially closing with mundane conclusions, 701 cases were left 'unexplained' — a figure that continues to fuel debate.",
    fullDescription: [
      "Project Blue Book was the third USAF program to investigate UFO sightings, following Project Sign (1947) and Project Grudge (1949-1951). Headquartered at Wright-Patterson Air Force Base in Dayton, Ohio, it operated for 17 years and examined over 12,618 reports.",
      "The project was run by a series of commanding officers and supported by civilian scientist J. Allen Hynek, who was initially a skeptic but became convinced that the UFO phenomenon deserved serious scientific attention. Hynek later founded the Center for UFO Studies (CUFOS).",
      "Blue Book investigated famous cases including the 1952 Washington D.C. UFO flap, where objects appeared on radar near the Capitol; the 1961 Betty and Barney Hill abduction; and the 1965 Exeter, New Hampshire sightings.",
      "The project's methodology was often criticized as biased toward debunking. Cases were sometimes closed with explanations that didn't match the evidence. Astronomer and UFO researcher Jacques Vallée, who worked with Hynek, argued the data was being manipulated.",
      "In 1966, the USAF commissioned the University of Colorado to conduct an independent study. The resulting Condon Report (1968), led by physicist Edward Condon, concluded that further study was unlikely to advance science — paving the way for Blue Book's termination.",
      "Blue Book officially closed December 17, 1969. All 12,618 case files were transferred to the National Archives and are available to researchers. Of these, 701 cases — 5.5% — were officially listed as 'Unidentified.'",
    ],
    keyFacts: [
      "Duration: 1952–1969 (17 years)",
      "Total sightings analyzed: 12,618",
      "Cases marked 'Unidentified': 701 (5.5%)",
      "Headquartered at Wright-Patterson AFB, Ohio",
      "Civilian scientist J. Allen Hynek served as astronomical consultant",
      "Triggered by the wave of Kenneth Arnold sightings and the Roswell incident",
      "All files declassified and available at the National Archives",
      "Hynek's 'swamp gas' explanation for 1966 Michigan sightings caused public outrage",
    ],
    keyFigures: ["J. Allen Hynek (scientific consultant)", "Edward Ruppelt (first director)", "Jacques Vallée (researcher)", "Edward Condon (Condon Report)"],
    timeline: [
      { year: "1947", event: "Kenneth Arnold sighting triggers national UFO wave; Roswell incident" },
      { year: "1948", event: "Project Sign's 'Estimate of the Situation' suggests interplanetary origin" },
      { year: "1949", event: "Project Grudge replaces Sign with debunking mandate" },
      { year: "1952", event: "Project Blue Book established; massive UFO wave over Washington D.C." },
      { year: "1953", event: "Robertson Panel recommends debunking UFO reports" },
      { year: "1961", event: "Betty and Barney Hill abduction reported" },
      { year: "1966", event: "Hynek's 'swamp gas' explanation triggers Congressional hearings" },
      { year: "1968", event: "Condon Report recommends ending the project" },
      { year: "1969", event: "Project Blue Book officially terminated December 17" },
    ],
    relatedDocs: [
      { title: "Blue Book Files — National Archives", url: "https://www.archives.gov/research/military/air-force/ufos" },
      { title: "Condon Report (Full Text)", url: "https://www.ncas.org/condon/" },
    ],
    images: [
      { url: "/media/foto/UFO UAP/Cigar  Cylindrical Type.webp", caption: "Archival footage analysis of a cylindrical craft — typical of early Blue Book reports" },
      { url: "/media/foto/UFO UAP/Disc Saucer Type.webp", caption: "Recovered saucer-type asset currently in long-term storage at Wright-Patterson" },
    ],
    sourceUrl: "https://www.archives.gov/research/military/air-force/ufos",
  },
  "stargate": {
    slug: "stargate", name: "Project Stargate", codename: "STARGATE",
    agency: "CIA / Defense Intelligence Agency", agencyColor: "#660066",
    classification: "DECLASSIFIED", years: "1972–1995", coverColor: "#220022",
    tags: ["remote-viewing", "psychic", "cia", "dia", "esp"],
    overview: "A $20 million government program studying psychic phenomena for intelligence purposes. Remote viewers were used operationally to find hostages, spy on Soviet facilities, and locate nuclear weapons — with classified results that reportedly exceeded chance.",
    fullDescription: [
      "Project Stargate was the umbrella name for a series of programs investigating psychic phenomena for intelligence applications. Earlier projects included SCANATE, GONDOLA WISH, GRILL FLAME, CENTER LANE, SUN STREAK, and finally STARGATE.",
      "The program was run out of SRI International (Stanford Research Institute) under physicists Russell Targ and Hal Puthoff, who designed rigorous double-blind experiments to test remote viewing ability. Their 1974 paper in Nature journal reported statistically significant results.",
      "Remote viewers used in the program included Ingo Swann — credited with co-developing the 'coordinate remote viewing' protocol — and Pat Price, whose descriptions of Soviet facilities were reportedly confirmed by satellite imagery.",
      "Operationally, remote viewers were tasked with locating hostages in Iran, finding downed Soviet bombers in Africa, identifying the layout of Soviet military installations, and even viewing the surface of Mars in 1984 (a session that produced unexpected detailed descriptions).",
      "A 1995 report by the American Institutes for Research (AIR), commissioned by Congress, evaluated the program's effectiveness. While finding statistically significant results in laboratory settings, it concluded the program had not provided actionable intelligence and recommended termination.",
      "The CIA declassified the Stargate files in 1995. They revealed decades of remote viewing sessions, including startling apparent hits. The program employed physicists, intelligence officers, and civilian psychics in a shadow intelligence operation that defied mainstream science.",
    ],
    keyFacts: [
      "Total budget: approximately $20 million over 23 years",
      "Ran under multiple code names: SCANATE, GONDOLA WISH, GRILL FLAME, CENTER LANE, SUN STREAK, STARGATE",
      "Run primarily at SRI International, Menlo Park, California",
      "Key researchers: Russell Targ, Hal Puthoff (SRI)",
      "Key remote viewers: Ingo Swann, Pat Price, Joe McMoneagle",
      "Declassified by CIA in 1995 — over 80,000 pages",
      "American Institutes for Research evaluated program in 1995 before closure",
      "Results reportedly showed statistical significance above chance",
    ],
    keyFigures: ["Russell Targ (SRI researcher)", "Hal Puthoff (SRI researcher)", "Ingo Swann (remote viewer)", "Pat Price (remote viewer)", "Joe McMoneagle (remote viewer)"],
    timeline: [
      { year: "1972", event: "SCANATE program begins at SRI with CIA funding" },
      { year: "1974", event: "Targ and Puthoff publish remote viewing results in Nature" },
      { year: "1978", event: "Army intelligence joins program; renamed GRILL FLAME" },
      { year: "1984", event: "Remote viewer describes 'Mars pyramids' in 1984 tasking" },
      { year: "1991", event: "Program renamed STARGATE; transfers to DIA" },
      { year: "1995", event: "AIR evaluation recommends termination; CIA declassifies files" },
    ],
    relatedDocs: [
      { title: "Stargate Collection — CIA Reading Room", url: "https://www.cia.gov/readingroom/collection/stargate" },
    ],
    images: [
      { url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800", caption: "SRI International, where remote viewing experiments were conducted" },
      { url: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800", caption: "Remote viewing sessions were conducted in isolated rooms to prevent sensory contamination" },
    ],
    sourceUrl: "https://www.cia.gov/readingroom/collection/stargate",
  },
  "majestic": {
    slug: "majestic", name: "Majestic 12", codename: "MAJESTIC",
    agency: "Inter-Agency Committee (MJ-12)", agencyColor: "#ff3333",
    classification: "ULTRA TOP SECRET // MAJIC", years: "1947–Ongoing", coverColor: "#1a0000",
    tags: ["mj12", "roswell", "truman", "crash-retrieval", "shadow-government"],
    overview: "The most secretive organization in human history. Formed by executive order of President Truman following the Roswell crash, MJ-12 is tasked with the recovery, study, and reverse-engineering of extraterrestrial technology and biological entities.",
    fullDescription: [
      "Majestic 12 (or MJ-12) is the purported code name of a secret committee of scientists, military leaders, and government officials, established in 1947 by an executive order of U.S. President Harry S. Truman to facilitate the recovery and investigation of alien spacecraft.",
      "The existence of MJ-12 was first revealed in 1984 when television producer Jaime Shandera received a roll of undeveloped 35mm film in the mail. When developed, it contained images of what appeared to be a briefing document for President-elect Dwight D. Eisenhower.",
      "The 'Eisenhower Briefing Document' detailed the history of the Roswell crash in July 1947 and the formation of a group called MJ-12 to manage the aftermath. It listed 12 original members, including Dr. Vannevar Bush, Secretary of Defense James Forrestal, and Admiral Roscoe Hillenkoetter.",
      "Since the initial leak, thousands of pages of alleged MJ-12 documents have surfaced. While the FBI and Air Force officially classify these documents as hoaxes, some forensic analysis suggests that several documents use authentic government formatting and procedures from the era.",
      "MJ-12 is said to operate outside the standard chain of command, reporting directly to the President or a small group of handlers. It is reportedly funded through 'black budget' operations and has complete control over all extraterrestrial-related research projects in the United States.",
    ],
    keyFacts: [
      "Formed: September 24, 1947, by President Truman",
      "Original Membership: 12 elite officials (The MJ-12)",
      "Classification: ULTRA TOP SECRET",
      "Primary Mission: ET recovery and reverse-engineering",
      "Operational Hub: Various locations, primarily Groom Lake (Area 51)",
      "Funding: Unaccounted black budget",
      "Authenticity: Officially denied, privately debated",
    ],
    keyFigures: ["Vannevar Bush", "James Forrestal", "Roscoe Hillenkoetter", "Detlev Bronk", "Donald Menzel"],
    timeline: [
      { year: "1947", event: "Roswell crash; MJ-12 established by Truman" },
      { year: "1949", event: "James Forrestal (MJ-3) dies under suspicious circumstances" },
      { year: "1952", event: "Eisenhower briefed on MJ-12 operations" },
      { year: "1984", event: "Briefing documents leaked to Jaime Shandera" },
      { year: "1994", event: "GAO investigation into Roswell fails to find MJ-12 records" },
      { year: "2023", event: "Whistleblower David Grusch mentions secret crash retrieval programs" },
    ],
    relatedDocs: [
      { title: "Eisenhower Briefing Document", url: "https://www.majesticdocuments.com/pdf/eisenhower_briefing.pdf" },
      { title: "Truman Memo to Forrestal (1947)", url: "https://www.majesticdocuments.com/pdf/truman_forrestal.pdf" },
    ],
    images: [
      { url: "/media/foto/EXTRATERRESTRI/Grays (Type III).webp", caption: "Biological specimen recovered from the 1947 Roswell incident site" },
      { url: "/media/foto/UFO UAP/Disc Saucer Type.webp", caption: "The primary focus of MJ-12: the recovery and reverse-engineering of non-human craft" },
    ],
    sourceUrl: "https://www.majesticdocuments.com/",
  },
  "aquarius": {
    slug: "aquarius", name: "Project Aquarius", codename: "AQUARIUS",
    agency: "National Security Agency (NSA)", agencyColor: "#009999",
    classification: "TOP SECRET // MAJIC", years: "1977–Present", coverColor: "#002b2b",
    tags: ["aquarius", "ebe", "nsa", "extraterrestrial", "recovery"],
    overview: "A highly classified NSA project to collect intelligence on extraterrestrial biological entities (EBEs) and their interactions with Earth. Referenced in heavily redacted FOIA documents, it remains one of the most sensitive programs in the archive.",
    fullDescription: [
      "Project Aquarius was reportedly established in 1977 to consolidate all previous intelligence gathering on UFOs and EBEs into a single, centralized program under the National Security Agency. Its primary mission is the analysis of extraterrestrial technology and the study of biological specimens recovered from crash sites.",
      "The program's existence was first brought to public attention in the 1980s through leaked briefing documents. While the government officially denies the project's existence, several FOIA requests have returned documents that mention Aquarius by name, though they are usually redacted to the point of being illegible.",
      "According to unverified leaks, Project Aquarius is divided into several sub-projects, including Project Sigma (communication), Project Snowbird (flight testing of recovered craft), and Project Gleem (historical records).",
      "The project allegedly maintains a library of non-human artifacts and biological samples at several secure locations, including the infamous S4 facility near Area 51. The level of secrecy surrounding Aquarius is said to exceed that of the Manhattan Project.",
      "Intelligence officers assigned to Aquarius are required to undergo extensive psychological screening and sign lifelong non-disclosure agreements that carry the penalty of treason for any leaks.",
    ],
    keyFacts: [
      "Established: 1977 by executive order",
      "Primary Control: National Security Agency (NSA)",
      "Classification: TOP SECRET // MAJIC",
      "Sub-projects: Sigma, Snowbird, Gleem",
      "Focus: Extraterrestrial Biological Entities (EBEs)",
      "Location: Multi-site, including Wright-Patterson and S4",
      "Heavily redacted in FOIA releases",
    ],
    keyFigures: ["Adm. Bobby Ray Inman (alleged)", "Guy Hottel (referenced in context)", "Various unnamed MJ-12 members"],
    timeline: [
      { year: "1953", event: "Project Gleem begins collecting historical ET records" },
      { year: "1966", event: "Project Sigma successfully establishes primitive communication" },
      { year: "1977", event: "Project Aquarius formed to unify all ET intelligence" },
      { year: "1980", event: "Initial leaks of Aquarius codename to civilian researchers" },
      { year: "1988", event: "NASA employee allegedly confirms Aquarius existence off-record" },
      { year: "2014", event: "New redacted documents released under FOIA referencing Aquarius" },
    ],
    relatedDocs: [
      { title: "NSA Technical Journal Vol. XIV (Redacted)", url: "https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/ufo/" },
      { title: "Briefing for President Eisenhower (Alleged)", url: "https://www.majesticdocuments.com/" },
    ],
    images: [
      { url: "/media/foto/EXTRATERRESTRI/Ebens.jpg", caption: "Intelligence analysis of an Extraterrestrial Biological Entity (EBE) associated with Aquarius" },
      { url: "/media/foto/EXTRATERRESTRI/Mantis (Insectoids).webp", caption: "Secondary non-human phenotype detected via signals intelligence" },
    ],
    sourceUrl: "https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/ufo/",
  },
  "sigma": {
    slug: "sigma", name: "Project Sigma", codename: "SIGMA",
    agency: "National Security Agency (NSA)", agencyColor: "#006633",
    classification: "TOP SECRET // SIGMA", years: "1954–Present", coverColor: "#001a0d",
    tags: ["sigma", "communication", "eti", "nsa", "contact"],
    overview: "A specialized NSA program dedicated to establishing and maintaining communication with non-human intelligence. Reportedly achieved the first successful two-way transmission in 1959.",
    fullDescription: [
      "Project Sigma was established in 1954 as a subset of the NSA's signals intelligence mission, specifically focusing on anomalous electromagnetic signals that appeared to originate from within our solar system but were not of human origin.",
      "In 1959, the project allegedly established a communication link with an extraterrestrial civilization. The protocol used involved binary mathematical sequences and geometric patterns transmitted via high-frequency radio waves.",
      "Sigma is said to operate the 'Black Knight' monitoring station, which tracks unidentified satellites in polar orbits. The program is one of the most closely guarded secrets in the signals intelligence community.",
      "Current operations involve the use of advanced AI to decrypt complex non-human data streams that are supposedly being received by deep-space listening posts.",
    ],
    keyFacts: [
      "Objective: Non-human communication",
      "First Contact: 1959 (alleged)",
      "Tech: Multi-spectrum signals analysis",
      "Location: Fort Meade / Secret listening posts",
    ],
    keyFigures: ["Gen. Ralph Canine (Founding)", "Dr. Howard Camp (Chief Scientist)"],
    timeline: [
      { year: "1954", event: "Sigma established by NSA directive" },
      { year: "1959", event: "First successful signal exchange" },
      { year: "2012", event: "Upgrade to quantum encryption processing" },
    ],
    relatedDocs: [
      { title: "NSA Signal Analysis Report 1959", url: "https://www.nsa.gov/" },
    ],
    images: [],
    sourceUrl: "https://www.nsa.gov/",
  },
  "mkultra": {
    slug: "mkultra", name: "Project MKUltra", codename: "MKULTRA",
    agency: "Central Intelligence Agency (CIA)", agencyColor: "#0066cc",
    classification: "DECLASSIFIED // REDACTED", years: "1953–1973", coverColor: "#1a0033",
    tags: ["mind-control", "lsd", "cia", "human-experiments"],
    overview: "The CIA's illegal human experimentation program designed to identify and develop drugs and procedures to be used in interrogations and mind control.",
    fullDescription: [
      "MKUltra was organized through the Scientific Intelligence Division of the CIA and coordinated with the U.S. Army Biological Warfare Laboratories. The program was notorious for administering drugs (especially LSD) and other chemicals without the subjects' knowledge or consent.",
      "Experiments included hypnosis, sensory deprivation, isolation, verbal and sexual abuse, as well as other forms of torture. The goal was to weaken the individual to force confessions through mind control.",
      "In 1973, CIA Director Richard Helms ordered all MKUltra files destroyed, but a cache of documents escaped destruction and were later released under FOIA.",
    ],
    keyFacts: [
      "Project Head: Sidney Gottlieb",
      "Subjects: Often unwitting US/Canadian citizens",
      "Legacy: Exposed by Church Committee in 1975",
    ],
    keyFigures: ["Sidney Gottlieb", "Richard Helms"],
    timeline: [
      { year: "1953", event: "Project authorized by Allen Dulles" },
      { year: "1973", event: "Destruction of records ordered" },
      { year: "1977", event: "Senate hearing on MKUltra" },
    ],
    relatedDocs: [
      { title: "MKUltra Declassified Collection", url: "https://www.cia.gov/readingroom/collection/mkultra" },
    ],
    images: [],
    sourceUrl: "https://www.cia.gov/readingroom/collection/mkultra",
  },
  "paperclip": {
    slug: "paperclip", name: "Operation Paperclip", codename: "PAPERCLIP",
    agency: "OSS / Joint Intelligence Objectives Agency", agencyColor: "#333399",
    classification: "DECLASSIFIED", years: "1945–1959", coverColor: "#00001a",
    tags: ["nazi", "nasa", "rocket-science", "cold-war"],
    overview: "The secret program in which more than 1,600 German scientists, engineers, and technicians were taken from Germany to the United States for government employment.",
    fullDescription: [
      "Operation Paperclip was a secret program of the Joint Intelligence Objectives Agency (JIOA) largely carried out by Special Agents of Army CIC, in which more than 1,600 German scientists, engineers, and technicians, such as Wernher von Braun and his V-2 rocket team, were taken from Germany to the United States.",
      "Many of these scientists were former members, and some were former leaders, of the Nazi Party. The primary purpose for Operation Paperclip was U.S. military advantage in the Russo-American Cold War and the Space Race.",
    ],
    keyFacts: [
      "Scientists Recruited: 1,600+",
      "Key Result: Development of the Saturn V rocket",
      "Ethical Controversy: Integration of Nazi party members into US agencies",
    ],
    keyFigures: ["Wernher von Braun", "Arthur Rudolph", "Hubertus Strughold"],
    timeline: [
      { year: "1945", event: "JIOA established to recruit German talent" },
      { year: "1946", event: "Wernher von Braun arrives in the US" },
      { year: "1958", event: "NASA created; Paperclip scientists form its core" },
    ],
    relatedDocs: [
      { title: "National Archives Paperclip Records", url: "https://www.archives.gov/" },
    ],
    images: [],
    sourceUrl: "https://www.archives.gov/",
  },
  "mogul": {
    slug: "mogul", name: "Project Mogul", codename: "MOGUL",
    agency: "US Air Force", agencyColor: "#004080",
    classification: "DECLASSIFIED", years: "1947–1948", coverColor: "#001a33",
    tags: ["balloon", "roswell", "surveillance", "ussr"],
    overview: "A top-secret project involving microphones flown on high-altitude balloons, whose primary purpose was long-distance detection of sound waves generated by Soviet atomic bomb tests.",
    fullDescription: [
      "Project Mogul was carried out by the US Army Air Forces in the late 1940s. The project used constant-level balloons to carry microphones into the tropopause to detect sound waves from Soviet nuclear tests.",
      "In 1994, the Air Force released a report stating that the debris found at the Roswell crash site in 1947 was actually from a Project Mogul balloon (specifically Flight 4).",
    ],
    keyFacts: [
      "Technology: Constant-level balloons",
      "Purpose: Atomic test detection",
      "Roswell Link: Flight 4 debris",
    ],
    keyFigures: ["Dr. Maurice Ewing", "Dr. James Peoples"],
    timeline: [
      { year: "1947", event: "Project Mogul Flight 4 crashes near Roswell" },
      { year: "1994", event: "USAF officially links Roswell to Mogul" },
    ],
    relatedDocs: [
      { title: "The Roswell Report: Case Closed", url: "https://media.defense.gov/" },
    ],
    images: [],
    sourceUrl: "https://media.defense.gov/",
  },
  "aatip": {
    slug: "aatip", name: "Advanced Aerospace Threat ID Program", codename: "AATIP",
    agency: "Department of Defense (DoD)", agencyColor: "#333399",
    classification: "DECLASSIFIED // PARTIAL", years: "2007–2012", coverColor: "#1a1a4d",
    tags: ["uap", "pentagon", "elizondo", "tic-tac"],
    overview: "A secret investigatory effort funded by the United States Government to study unidentified flying objects or unexplained aerial phenomena.",
    fullDescription: [
      "AATIP was a $22 million program managed by Luis Elizondo. It focused on investigating reports of unidentified aerial phenomena (UAP) encountered by US military personnel.",
      "The program was first made public in 2017 by The New York Times, leading to the eventual release of several Navy cockpit videos showing anomalous objects.",
    ],
    keyFacts: [
      "Funding: $22 Million (Black Budget)",
      "Director: Luis Elizondo",
      "Result: Released Nimitz/Gimbal/GoFast videos",
    ],
    keyFigures: ["Luis Elizondo", "Sen. Harry Reid", "Robert Bigelow"],
    timeline: [
      { year: "2007", event: "Program established at request of Harry Reid" },
      { year: "2017", event: "Program existence revealed by NYT" },
      { year: "2020", event: "DoD officially releases UAP videos" },
    ],
    relatedDocs: [
      { title: "DoD UAP Release Memorandum", url: "https://www.defense.gov/" },
    ],
    images: [
      { url: "/media/foto/UFO UAP/Tic-Tac Type.webp", caption: "Verified FLIR footage from the 2004 Nimitz encounter — core AATIP evidence" },
      { url: "/media/foto/UFO UAP/Large Triangle Type.jpg", caption: "Low-light tactical capture of a large triangular craft over restricted airspace" },
    ],
    sourceUrl: "https://www.defense.gov/",
  },
  "sign": {
    slug: "sign", name: "Project Sign", codename: "SIGN",
    agency: "US Air Force", agencyColor: "#004080",
    classification: "DECLASSIFIED", years: "1947–1949", coverColor: "#001a33",
    tags: ["usaf", "1947", "interplanetary", "estimate"],
    overview: "The first official USAF investigation into UFOs, which famously produced the 'Estimate of the Situation' concluding that UFOs were extraterrestrial.",
    fullDescription: [
      "Project Sign was the first official UFO investigation by the US Air Force. It followed the Kenneth Arnold sighting and the Roswell incident in 1947.",
      "The program's staff was divided between those who believed UFOs were interplanetary and those who believed they were Soviet technology. The 'Estimate of the Situation' was rejected by top brass and ordered destroyed.",
    ],
    keyFacts: [
      "Founded: 1947",
      "Hypothesis: Interplanetary Origin",
      "Outcome: Replaced by Project Grudge",
    ],
    keyFigures: ["Gen. Hoyt Vandenberg", "Capt. Robert Sneider"],
    timeline: [
      { year: "1947", event: "Project Sign established" },
      { year: "1948", event: "Estimate of the Situation drafted" },
    ],
    relatedDocs: [
      { title: "Project Sign Technical Report", url: "https://www.afhra.af.mil/" },
    ],
    images: [],
    sourceUrl: "https://www.afhra.af.mil/",
  },
  "grudge": {
    slug: "grudge", name: "Project Grudge", codename: "GRUDGE",
    agency: "US Air Force", agencyColor: "#004080",
    classification: "DECLASSIFIED", years: "1949–1951", coverColor: "#001a33",
    tags: ["usaf", "debunking", "ufo"],
    overview: "Successor to Project Sign, Grudge was established with a mandate to debunk UFO sightings and reduce public anxiety about the phenomena.",
    fullDescription: [
      "Project Grudge followed the dismissal of the 'interplanetary' conclusions of Project Sign. The staff was instructed to apply standard psychological and astronomical explanations to all reports.",
      "The program's final report concluded that UFOs were a combination of misidentifications, hoaxes, and mass hysteria.",
    ],
    keyFacts: [
      "Goal: Public relations and debunking",
      "Conclusion: No physical threat",
      "Legacy: Led to Project Blue Book",
    ],
    keyFigures: ["Lt. Jerry Cummings", "Capt. Edward Ruppelt"],
    timeline: [
      { year: "1949", event: "Project Grudge replaces Sign" },
      { year: "1951", event: "Project temporarily suspended" },
    ],
    relatedDocs: [
      { title: "Project Grudge Report #10", url: "https://www.archives.gov/" },
    ],
    images: [],
    sourceUrl: "https://www.archives.gov/",
  },
  "moon-dust": {
    slug: "moon-dust", name: "Operation Moon Dust", codename: "MOON DUST",
    agency: "USAF / CIA", agencyColor: "#004080",
    classification: "TOP SECRET", years: "1953–Present", coverColor: "#1a1a1a",
    tags: ["recovery", "debris", "space", "crash"],
    overview: "Specialized recovery teams tasked with retrieving fallen non-US space debris and unidentified objects from anywhere on Earth.",
    fullDescription: [
      "Operation Moon Dust was established to provide a rapid-response capability for the recovery of space debris, satellites, and unidentified objects that returned to Earth outside of controlled environments.",
      "The program operates globally, often coordinating with the CIA and State Department to secure crash sites in foreign territories before other powers can reach them.",
      "While many recoveries are mundane satellite parts, rumors persist of 'non-terrestrial' materials being recovered and transported to Wright-Patterson AFB for analysis."
    ],
    keyFacts: ["Global reach", "Joint USAF/CIA operation", "Active status"],
    keyFigures: ["Classified Recovery Teams"],
    timeline: [
      { year: "1953", event: "Operation established" },
      { year: "1967", event: "Recovery of unidentified debris in Sudan" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.archives.gov/"
  },
  "corona": {
    slug: "corona", name: "Project Corona", codename: "CORONA",
    agency: "CIA / NRO", agencyColor: "#003366",
    classification: "DECLASSIFIED", years: "1959–1972", coverColor: "#001122",
    tags: ["satellite", "surveillance", "spy", "cold-war"],
    overview: "The first US spy satellite program used for photographic surveillance of the Soviet Union and China.",
    fullDescription: [
      "Project Corona was a series of strategic reconnaissance satellites operated by the CIA and the US Air Force. It provided the first high-resolution mapping of the USSR.",
      "The program was so secret that its existence was not acknowledged until 1995. It used film canisters that were ejected from orbit and caught in mid-air by specialized aircraft.",
      "Corona's success paved the way for all modern satellite intelligence and effectively ended the uncertainty about Soviet nuclear capabilities."
    ],
    keyFacts: ["First spy satellite", "Film recovery via mid-air catch", "Mapped 1.6M square miles"],
    keyFigures: ["Richard Bissell", "Herbert Scoville"],
    timeline: [
      { year: "1959", event: "First launch (Discoverer 1)" },
      { year: "1960", event: "First successful film recovery" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.cia.gov/"
  },
  "magnet": {
    slug: "magnet", name: "Project Magnet", codename: "MAGNET",
    agency: "Transport Canada", agencyColor: "#cc0000",
    classification: "DECLASSIFIED", years: "1950–1954", coverColor: "#330000",
    tags: ["canada", "propulsion", "magnetic", "wilbert-smith"],
    overview: "Canadian investigation into UFOs and magnetic theory, led by Wilbert Smith. Focused on the possibility of extraterrestrial craft using magnetic propulsion.",
    fullDescription: [
      "Project Magnet was an official Canadian government study into the possibility that UFOs were real and used advanced magnetic propulsion systems.",
      "Lead scientist Wilbert Smith famously claimed that he had been told by US officials that the subject was 'more classified than the H-bomb.'",
      "The project established an observatory in Shirley's Bay, Ontario, to track anomalous magnetic signatures and gravity waves."
    ],
    keyFacts: ["Official Canadian study", "Focused on propulsion", "Classified 'Top Secret'"],
    keyFigures: ["Wilbert Smith"],
    timeline: [
      { year: "1950", event: "Project authorized" },
      { year: "1952", event: "Shirley's Bay observatory opens" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.bac-lac.gc.ca/"
  },
  "second-storey": {
    slug: "second-storey", name: "Project Second Storey", codename: "SECOND STOREY",
    agency: "DRB Canada", agencyColor: "#800000",
    classification: "DECLASSIFIED", years: "1952–1954", coverColor: "#220000",
    tags: ["canada", "intelligence", "threat-assessment"],
    overview: "Canadian government committee tasked with examining UFO reports and evaluating the potential threat to national security.",
    fullDescription: [
      "Project Second Storey was a parallel effort to Project Magnet, focusing more on the intelligence and threat-assessment aspects of the UFO phenomenon.",
      "The committee included members from the military and intelligence services. They concluded that while most reports were misidentifications, a small percentage defied explanation.",
      "The program recommended a standardized reporting system for military pilots to better track anomalous incursions into Canadian airspace."
    ],
    keyFacts: ["Inter-departmental committee", "Threat assessment focus", "Standardized reporting"],
    keyFigures: ["Dr. Peter Millman"],
    timeline: [
      { year: "1952", event: "Committee formed" },
      { year: "1954", event: "Final report submitted" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.bac-lac.gc.ca/"
  },
  "cometa": {
    slug: "cometa", name: "COMETA Report", codename: "COMETA",
    agency: "French Intelligence / CNES", agencyColor: "#0055a4",
    classification: "PUBLIC", years: "1999", coverColor: "#002244",
    tags: ["france", "official-report", "eth", "military"],
    overview: "The COMETA Report — a high-level study by French generals and aerospace experts concluding that the extraterrestrial hypothesis is the most likely.",
    fullDescription: [
      "The COMETA Report ('UFOs and Defense: What Should We Prepare For?') was a high-level study produced by an independent group of French experts, many of whom were retired generals and scientists from CNES.",
      "The report analyzed numerous military cases and concluded that the physical reality of UFOs was beyond doubt, and that the 'extraterrestrial hypothesis' was the most logical explanation for the observed performance.",
      "It warned that the phenomenon could have profound military and strategic implications and urged for greater international cooperation."
    ],
    keyFacts: ["French military authors", "Supported ETH", "High-level scientific analysis"],
    keyFigures: ["General Denis Letty"],
    timeline: [
      { year: "1999", event: "Report released to the public" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.cnes-geipan.fr/"
  },
  "geipan": {
    slug: "geipan", name: "GEIPAN", codename: "GEIPAN",
    agency: "CNES France", agencyColor: "#0055a4",
    classification: "OPEN", years: "1977–Present", coverColor: "#003366",
    tags: ["france", "ongoing", "scientific", "cnes"],
    overview: "Official French government agency responsible for investigating unidentified aerospace phenomena. One of the only open official agencies in the world.",
    fullDescription: [
      "GEIPAN (Groupe d'Études et d'Informations sur les Phénomènes Aérospatiaux Non identifiés) is a unit of the French Space Agency (CNES).",
      "It is one of the few government programs in the world that openly shares its data and investigation results with the public.",
      "GEIPAN categorizes cases from 'A' (fully explained) to 'D' (unexplained despite high-quality data). Roughly 3% of their cases remain in category D."
    ],
    keyFacts: ["Part of French Space Agency", "Publicly accessible database", "Rigorous scientific method"],
    keyFigures: ["Claude Poher", "Xavier Passot"],
    timeline: [
      { year: "1977", event: "GEIPAN established (formerly GEPAN)" },
      { year: "2007", event: "Full database made available online" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.cnes-geipan.fr/"
  },
  "hessdalen": {
    slug: "hessdalen", name: "Project Hessdalen", codename: "HESSDALEN",
    agency: "Hessdalen Interactive", agencyColor: "#ffcc00",
    classification: "SCIENTIFIC", years: "1983–Present", coverColor: "#443300",
    tags: ["norway", "lights", "automated-monitoring", "plasma"],
    overview: "Scientific monitoring of the Hessdalen lights in Norway. Utilizes automated sensors and radar to track recurring anomalous light phenomena.",
    fullDescription: [
      "Hessdalen is a small valley in Norway famous for recurring, unidentified light phenomena. Project Hessdalen was established to study these lights using scientific instrumentation.",
      "In 1998, an automated monitoring station (Blue Box) was installed, featuring cameras, radar, and magnetometers to capture data in real-time.",
      "Theories for the lights range from extraterrestrial craft to rare atmospheric plasma formations powered by the valley's unique geology."
    ],
    keyFacts: ["Real-time monitoring", "Recurring phenomenon", "International collaboration"],
    keyFigures: ["Erling Strand"],
    timeline: [
      { year: "1983", event: "Initial field study begins" },
      { year: "1998", event: "Automated station becomes operational" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "http://www.hessdalen.org/"
  },
  "serpo": {
    slug: "serpo", name: "Project Serpo", codename: "SERPO",
    agency: "DIA (Alleged)", agencyColor: "#660066",
    classification: "UNVERIFIED", years: "1965–1978", coverColor: "#330033",
    tags: ["exchange", "alien-planet", "zeta-reticuli", "leak"],
    overview: "Alleged secret exchange program between the US government and inhabitants of the Serpo system in the Zeta Reticuli star group.",
    fullDescription: [
      "The Serpo story emerged in 2005 from an anonymous source claiming to be a retired DIA official. It describes an exchange where 12 US personnel traveled to the planet Serpo on an alien craft.",
      "According to the leak, the exchange was part of an agreement made following the Roswell and Kingman crashes. The personnel reportedly stayed on Serpo for 13 years, with 8 returning in 1978.",
      "While dismissed by many as a sophisticated work of fiction or disinformation, the story contains detailed descriptions of planetary science and alien sociology."
    ],
    keyFacts: ["12 personnel exchange", "Planet Serpo (Zeta Reticuli)", "13-year mission duration"],
    keyFigures: ["Anonymous 'Victor'", "Classified DIA personnel"],
    timeline: [
      { year: "1965", event: "Departure from Nevada test site" },
      { year: "1978", event: "Return of surviving personnel" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "http://www.serpo.org/"
  },
  "gleem": {
    slug: "gleem", name: "Project Gleem", codename: "GLEEM",
    agency: "NSA", agencyColor: "#009999",
    classification: "TOP SECRET", years: "1953–1977", coverColor: "#002b2b",
    tags: ["historical-data", "nsa", "centralization"],
    overview: "Precursor to Project Aquarius. Involved the initial collection and centralization of all ET-related intelligence within the intelligence community.",
    fullDescription: [
      "Project Gleem was established in the early 1950s to act as a central clearinghouse for all intelligence regarding unidentified aerospace phenomena collected across various agencies.",
      "The program was later folded into Project Aquarius when the mission expanded from simple data collection to active technological and biological research.",
      "Gleem records are said to contain the most primitive and authentic accounts of early post-WWII encounters."
    ],
    keyFacts: ["Data centralization", "Precursor to Aquarius", "NSA managed"],
    keyFigures: ["Classified NSA Directors"],
    timeline: [
      { year: "1953", event: "Project Gleem authorized" },
      { year: "1977", event: "Program merged into Aquarius" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.nsa.gov/"
  },
  "snowbird": {
    slug: "snowbird", name: "Project Snowbird", codename: "SNOWBIRD",
    agency: "USAF", agencyColor: "#004080",
    classification: "TOP SECRET", years: "1972–Present", coverColor: "#001a33",
    tags: ["test-flight", "reverse-engineering", "s4"],
    overview: "Clandestine program focused on the research, development, and test flights of recovered non-human aerial technology.",
    fullDescription: [
      "Project Snowbird is allegedly the program responsible for the actual flight testing of recovered or reverse-engineered craft. It is often linked to the S4 facility within Area 51.",
      "The program's existence was hinted at in various leaked documents as a way to provide 'cover' for anomalous sightings by claiming they were secret military prototypes.",
      "Snowbird teams are said to work alongside civilian contractors from major aerospace firms like Lockheed and Northrop."
    ],
    keyFacts: ["Active flight testing", "S4 facility association", "Cover for sightings"],
    keyFigures: ["Classified Test Pilots"],
    timeline: [
      { year: "1972", event: "Project Snowbird established" },
      { year: "1989", event: "Bob Lazar claims to have seen Snowbird craft" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.af.mil/"
  },
  "pounce": {
    slug: "pounce", name: "Project Pounce", codename: "POUNCE",
    agency: "MAJESTIC", agencyColor: "#ff0000",
    classification: "ULTRA TOP SECRET", years: "1947–Present", coverColor: "#1a0000",
    tags: ["recovery", "rapid-response", "crash-retrieval"],
    overview: "Rapid response recovery teams tasked with the retrieval of crashed or disabled unidentified aerospace craft.",
    fullDescription: [
      "Project Pounce is the operational arm of MJ-12 responsible for 'securing the perimeter' at any reported crash site involving non-human technology.",
      "The teams are equipped with advanced decontamination gear and are authorized to use any means necessary to prevent civilian or unauthorized military access to the site.",
      "Pounce is reportedly responsible for the successful recovery of the Kecksburg, Shag Harbour, and Aztec crash materials."
    ],
    keyFacts: ["Rapid response", "MJ-12 operational wing", "Total site lockdown"],
    keyFigures: ["Special Operations Recovery Teams"],
    timeline: [
      { year: "1947", event: "Pounce formed after Roswell" },
      { year: "1965", event: "Kecksburg recovery operation" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.majesticdocuments.com/"
  },
  "redlight": {
    slug: "redlight", name: "Project Redlight", codename: "REDLIGHT",
    agency: "USAF / S4", agencyColor: "#cc0000",
    classification: "ULTRA TOP SECRET", years: "1954–Present", coverColor: "#220000",
    tags: ["reverse-engineering", "catastrophic-failure", "s4"],
    overview: "Highly classified attempts to fly recovered alien craft. Reportedly suffered multiple catastrophic failures in the early stages.",
    fullDescription: [
      "While Snowbird focuses on testing, Project Redlight is the 'raw' reverse-engineering program where pilots attempt to fly actual extraterrestrial craft using understood controls.",
      "Early attempts in the 1950s and 60s reportedly resulted in several mid-air explosions and the loss of multiple test pilots due to the unpredictable nature of the propulsion systems.",
      "The project is rumored to have achieved its first stable sustained flight in the mid-1970s using a hybrid 'gravity-drive' system."
    ],
    keyFacts: ["Direct craft testing", "High mortality rate", "Propulsion focus"],
    keyFigures: ["Classified Test Pilots"],
    timeline: [
      { year: "1954", event: "Redlight initiated" },
      { year: "1962", event: "Catastrophic failure at Groom Lake" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.af.mil/"
  },
  "horizon": {
    slug: "horizon", name: "Project Horizon", codename: "HORIZON",
    agency: "US Army", agencyColor: "#006600",
    classification: "DECLASSIFIED", years: "1959", coverColor: "#001a00",
    tags: ["moon-base", "lunar", "cold-war", "defense"],
    overview: "US Army proposal to establish a lunar base by 1965. Included plans for defending the base against potential hostile spacecraft.",
    fullDescription: [
      "Project Horizon was a study to determine the feasibility of establishing a scientific and military outpost on the Moon.",
      "The report envisioned a base manned by 10-20 personnel, powered by nuclear reactors, and used for Earth surveillance and lunar research.",
      "Crucially, it included provisions for 'lunar defense,' suggesting that the Army was preparing for potential conflicts in space—possibly with more than just the Soviets."
    ],
    keyFacts: ["Proposed lunar base", "Nuclear powered", "Military defense focus"],
    keyFigures: ["Wernher von Braun (contributor)"],
    timeline: [
      { year: "1959", event: "Feasibility study completed" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.history.army.mil/"
  },
  "a119": {
    slug: "a119", name: "Project A119", codename: "A119",
    agency: "USAF", agencyColor: "#004080",
    classification: "DECLASSIFIED", years: "1958–1959", coverColor: "#001a33",
    tags: ["moon", "nuclear", "cold-war", "show-of-force"],
    overview: "Top-secret plan to detonate a nuclear weapon on the Moon to demonstrate US power and study the resulting dust cloud.",
    fullDescription: [
      "Project A119, also known as 'A Study of Lunar Research Flights,' was a top-secret plan developed in the late 1950s by the United States Air Force.",
      "The aim was to detonate a nuclear bomb on the Moon, which would be visible from Earth with the naked eye. This was intended as a demonstration of American space capability and a way to boost public morale during the Space Race.",
      "Young Carl Sagan was one of the scientists involved in the project, specifically tasked with modeling the expansion of the dust cloud in the lunar vacuum."
    ],
    keyFacts: ["Nuclear detonation on Moon", "Visible from Earth", "Scientific/Psychological mission"],
    keyFigures: ["Leonard Reiffel", "Carl Sagan"],
    timeline: [
      { year: "1958", event: "Project initiated" },
      { year: "1959", event: "Project cancelled due to risk and public perception" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.history.com/"
  },
  "report-14": {
    slug: "report-14", name: "Blue Book Special Report No. 14", codename: "REPORT 14",
    agency: "Battelle Memorial Institute", agencyColor: "#666666",
    classification: "DECLASSIFIED", years: "1951–1954", coverColor: "#1a1a1a",
    tags: ["statistics", "blue-book", "analysis"],
    overview: "Comprehensive statistical study of UFO reports. Concluded that the 'unknowns' were significantly different from the 'knowns'.",
    fullDescription: [
      "Special Report No. 14 was the most thorough statistical analysis ever conducted on the Project Blue Book data, performed by the Battelle Memorial Institute.",
      "The report categorized over 3,000 cases. Crucially, it found that the better the quality of the report, the more likely it was to be classified as an 'unknown.'",
      "The statistical results directly contradicted the Air Force's public stance that UFOs were merely misidentifications of common objects."
    ],
    keyFacts: ["3,201 cases analyzed", "21.5% remained unknown", "Higher quality = more unknowns"],
    keyFigures: ["Dr. Leon Davidson"],
    timeline: [
      { year: "1951", event: "Analysis begins" },
      { year: "1955", event: "Report published" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.archives.gov/"
  },
  "mainbrace": {
    slug: "mainbrace", name: "Operation Mainbrace (UFO Segment)", codename: "MAINBRACE",
    agency: "NATO", agencyColor: "#003399",
    classification: "DECLASSIFIED", years: "1952", coverColor: "#001122",
    tags: ["navy", "nato", "1952", "north-sea"],
    overview: "Investigation into high-profile sightings by naval personnel during a massive NATO exercise in the North Sea.",
    fullDescription: [
      "Operation Mainbrace was the largest NATO naval exercise to date, involving 80,000 personnel and 200 ships. During the exercise, multiple UFO sightings were reported by high-ranking officers and pilots.",
      "Objects were seen hovering over the fleet and even appearing to track the movements of the carrier USS Franklin D. Roosevelt.",
      "The sightings were so numerous and well-documented by military witnesses that they triggered a major internal investigation by the British and US governments."
    ],
    keyFacts: ["80,000 witnesses", "Multiple carrier sightings", "Triggered high-level concern"],
    keyFigures: ["Admiral Sir Patrick Brind"],
    timeline: [
      { year: "1952", event: "Operation Mainbrace takes place" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.nationalarchives.gov.uk/"
  },
  "ozma": {
    slug: "ozma", name: "Project Ozma", codename: "OZMA",
    agency: "NRAO", agencyColor: "#0066cc",
    classification: "PUBLIC", years: "1960", coverColor: "#001a33",
    tags: ["seti", "radio-astronomy", "frank-drake"],
    overview: "The first experiment in the Search for Extraterrestrial Intelligence (SETI), led by Frank Drake. Targeted Tau Ceti and Epsilon Eridani.",
    fullDescription: [
      "Project Ozma was the first modern attempt to detect radio signals from nearby star systems. It used the 85-foot Tatel Telescope at the National Radio Astronomy Observatory.",
      "The project scanned the stars Tau Ceti and Epsilon Eridani at the 1420 MHz frequency (the 21-cm hydrogen line).",
      "While no extraterrestrial signals were detected, Ozma established the protocols and scientific legitimacy for all subsequent SETI projects."
    ],
    keyFacts: ["First SETI project", "Targeted Tau Ceti", "21-cm hydrogen line focus"],
    keyFigures: ["Frank Drake"],
    timeline: [
      { year: "1960", event: "Project Ozma operational for 4 months" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://public.nrao.edu/"
  },
  "silver-bug": {
    slug: "silver-bug", name: "Project Silver Bug", codename: "SILVER BUG",
    agency: "USAF", agencyColor: "#004080",
    classification: "DECLASSIFIED", years: "1952–1955", coverColor: "#001a33",
    tags: ["vtol", "flying-disc", "avro", "propulsion"],
    overview: "Design project for a vertical take-off and landing (VTOL) flying disc aircraft based on the Coanda effect.",
    fullDescription: [
      "Project Silver Bug was a secret US Air Force project to develop a circular VTOL interceptor capable of extreme speeds and altitudes.",
      "The design utilized a radial-flow gas turbine engine that provided thrust around the entire rim of the disc, theoretically allowing for unprecedented maneuverability.",
      "The project was closely linked to Avro Canada's Project Y, which eventually produced the much less capable Avrocar."
    ],
    keyFacts: ["Radial-flow engine", "Supersonic disc design", "Advanced VTOL concept"],
    keyFigures: ["John Frost (Avro Canada)"],
    timeline: [
      { year: "1952", event: "Silver Bug design initiated" },
      { year: "1955", event: "Project officially terminated" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.archives.gov/"
  },
  "1794": {
    slug: "1794", name: "Project 1794", codename: "1794",
    agency: "USAF / Avro Canada", agencyColor: "#004080",
    classification: "DECLASSIFIED", years: "1956–1960", coverColor: "#001a33",
    tags: ["supersonic", "flying-saucer", "avro"],
    overview: "Classified project to build a supersonic flying saucer capable of Mach 4. Prototypes were built but failed to achieve stability.",
    fullDescription: [
      "Project 1794 was the most ambitious of the disc-wing aircraft projects. It aimed to create a craft capable of Mach 3 to Mach 4 at altitudes up to 100,000 feet.",
      "Declassified documents from 2012 revealed the incredible scope of the project, including detailed diagrams of the internal 'turborotor' system.",
      "Despite the advanced theory, the prototypes suffered from extreme instability and the project was eventually abandoned as unworkable with the control systems of the era."
    ],
    keyFacts: ["Mach 4 target speed", "100,000 ft ceiling", "Turborotor propulsion"],
    keyFigures: ["Avro Canada Engineers"],
    timeline: [
      { year: "1956", event: "Contract awarded to Avro Canada" },
      { year: "1960", event: "Final testing results lead to cancellation" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.archives.gov/"
  },
  "manhigh": {
    slug: "manhigh", name: "Project Manhigh", codename: "MANHIGH",
    agency: "USAF", agencyColor: "#004080",
    classification: "DECLASSIFIED", years: "1955–1958", coverColor: "#001a33",
    tags: ["balloon", "near-space", "human-physiology"],
    overview: "High-altitude balloon flights designed to investigate the effects of cosmic rays and thin atmosphere on human pilots.",
    fullDescription: [
      "Project Manhigh used pressurized capsules suspended from massive polyethylene balloons to take pilots to the edge of space.",
      "The program provided critical data on life support systems and the psychological effects of isolation that would later be essential for the Mercury and Apollo programs.",
      "Pilot David Simons spent over 32 hours at 100,000 feet, witnessing the curvature of the Earth and the blackness of space long before the first astronauts."
    ],
    keyFacts: ["Pre-NASA space flight", "100,000+ ft altitude", "Pressurized capsule tests"],
    keyFigures: ["David Simons", "Joseph Kittinger"],
    timeline: [
      { year: "1957", event: "Manhigh II reaches 101,516 feet" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.af.mil/"
  },
  "excelsior": {
    slug: "excelsior", name: "Project Excelsior", codename: "EXCELSIOR",
    agency: "USAF", agencyColor: "#004080",
    classification: "DECLASSIFIED", years: "1959–1960", coverColor: "#001a33",
    tags: ["parachute", "high-altitude", "kittinger"],
    overview: "Series of high-altitude parachute jumps by Joseph Kittinger, testing survival in the near-space environment.",
    fullDescription: [
      "Project Excelsior was designed to test a new parachute system for pilots who had to eject at high altitudes.",
      "On August 16, 1960, Joseph Kittinger jumped from Excelsior III at an altitude of 102,800 feet. He fell for 4 minutes and 36 seconds, reaching a speed of 614 mph before opening his parachute.",
      "The jump proved that humans could survive the harsh conditions of the upper atmosphere and that a stabilized freefall was possible even in near-vacuum."
    ],
    keyFacts: ["102,800 ft freefall", "Near-supersonic speed", "Survival testing"],
    keyFigures: ["Joseph Kittinger"],
    timeline: [
      { year: "1960", event: "Excelsior III record-breaking jump" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.af.mil/"
  },
  "aurora": {
    slug: "aurora", name: "Project Aurora", codename: "AURORA",
    agency: "USAF / CIA", agencyColor: "#1a1a1a",
    classification: "UNACKNOWLEDGED", years: "1989–Present", coverColor: "#000000",
    tags: ["hypersonic", "stealth", "black-project", "triangle"],
    overview: "Alleged secret hypersonic surveillance aircraft, often mistaken for UAPs due to its unconventional triangular shape and sonic booms.",
    fullDescription: [
      "Project Aurora is the code name for an unacknowledged hypersonic reconnaissance aircraft that reportedly replaced the SR-71 Blackbird.",
      "Sighting reports of triangular 'TR-3B' craft and 'donuts-on-a-rope' contrails are often attributed to this program.",
      "While the Pentagon denies its existence, budget leaks in the late 80s showed multi-billion dollar funding for 'Aurora' under the black budget."
    ],
    keyFacts: ["Mach 5+ capability", "Pulse Detonation Engine", "Unacknowledged status"],
    keyFigures: ["Classified Skunk Works Designers"],
    timeline: [
      { year: "1989", event: "First reported 'donuts-on-a-rope' contrails" },
      { year: "1991", event: "Sonic booms over Los Angeles attributed to Aurora" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.lockheedmartin.com/"
  },
  "blue-fly": {
    slug: "blue-fly", name: "Project Blue Fly", codename: "BLUE FLY",
    agency: "USAF", agencyColor: "#004080",
    classification: "TOP SECRET", years: "1957–Present", coverColor: "#001a33",
    tags: ["recovery", "debris", "rapid-response"],
    overview: "Rapid response teams specialized in the recovery and transport of unidentified objects and technological debris to secure facilities.",
    fullDescription: [
      "Project Blue Fly was established as a subset of Operation Moon Dust, specifically tasked with the physical transport of recovered artifacts.",
      "The project maintains a fleet of unmarked transport aircraft and heavy-lift helicopters ready to deploy within hours of a sighting or crash.",
      "Records suggest that Blue Fly teams have been active in several high-profile incidents involving fallen 'objects of unknown origin' in remote areas of the US and abroad."
    ],
    keyFacts: ["Transport focus", "Rapid deployment", "Global operational capability"],
    keyFigures: ["Classified Logistics Teams"],
    timeline: [
      { year: "1957", event: "Project Blue Fly established" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.archives.gov/"
  },
  "white-out": {
    slug: "white-out", name: "Project White-out", codename: "WHITE-OUT",
    agency: "NSA", agencyColor: "#009999",
    classification: "TOP SECRET", years: "1961–1965", coverColor: "#002b2b",
    tags: ["radar", "soviet", "anomaly", "tracking"],
    overview: "Monitoring program for Soviet radar anomalies that appeared to track high-speed objects moving at impossible velocities.",
    fullDescription: [
      "Project White-out was a specialized SIGINT mission to intercept and analyze Soviet radar data from their 'Tall King' and 'Hen House' arrays.",
      "Intelligence analysts noticed that Soviet radar systems were frequently locking onto targets performing maneuvers that defied conventional aerodynamics.",
      "The program aimed to determine if these objects were Soviet secret weapons or something else entirely."
    ],
    keyFacts: ["SIGINT focus", "Radar anomaly analysis", "Soviet monitoring"],
    keyFigures: ["Classified NSA Analysts"],
    timeline: [
      { year: "1961", event: "Project White-out initiated" },
      { year: "1965", event: "Program results classified indefinitely" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.nsa.gov/"
  },
  "looking-glass": {
    slug: "looking-glass", name: "Project Looking Glass", codename: "LOOKING GLASS",
    agency: "Strategic Air Command", agencyColor: "#333333",
    classification: "DECLASSIFIED", years: "1961–1990", coverColor: "#1a1a1a",
    tags: ["command-post", "nuclear", "airborne", "sac"],
    overview: "Continuous airborne command post designed to ensure control of US nuclear forces. Often associated with 'remote viewing' rumors in fringe circles.",
    fullDescription: [
      "Project Looking Glass was a mission of the Strategic Air Command (SAC) that kept a command-and-control aircraft in the air 24 hours a day for 29 years.",
      "Its purpose was to provide a survivable platform for the President and military leaders to command nuclear strikes in the event of a ground-based attack.",
      "While the official mission was nuclear C3, conspiracy theories have long linked the project's name to alleged experiments with 'future-viewing' technology."
    ],
    keyFacts: ["24/7 airborne status", "Nuclear command platform", "29 years continuous flight"],
    keyFigures: ["General Curtis LeMay"],
    timeline: [
      { year: "1961", event: "First Looking Glass flight" },
      { year: "1990", event: "Continuous airborne mission ended" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.stratcom.mil/"
  },
  "solar-warden": {
    slug: "solar-warden", name: "Project Solar Warden", codename: "SOLAR WARDEN",
    agency: "US Space Command (Alleged)", agencyColor: "#000033",
    classification: "ULTRA TOP SECRET", years: "1980–Present", coverColor: "#00001a",
    tags: ["space-fleet", "secret-space-program", "carrier"],
    overview: "Alleged secret space fleet consisting of massive cigar-shaped carriers and smaller scout craft patrolling the solar system.",
    fullDescription: [
      "Solar Warden is the name given by whistleblowers like Gary McKinnon and Corey Goode to a secret space program allegedly run by the US Navy and Space Command.",
      "The program reportedly utilizes 'torsion field' or 'anti-gravity' propulsion to maintain a presence throughout the solar system.",
      "According to McKinnon, who hacked into NASA and Pentagon computers in 2001, he found spreadsheets listing 'non-terrestrial officers' and 'ship-to-ship transfers' for vessels not on any official register."
    ],
    keyFacts: ["Secret space fleet", "Interplanetary capability", "Non-terrestrial officers"],
    keyFigures: ["Gary McKinnon (whistleblower)"],
    timeline: [
      { year: "1980", event: "Program allegedly becomes operational" },
      { year: "2001", event: "Gary McKinnon discovers Solar Warden files" }
    ],
    relatedDocs: [],
    images: [],
    sourceUrl: "https://www.spaceforce.mil/"
  }
};

// Fallback for slugs not fully detailed
function getProjectBySlug(slug: string, dbProject?: any) {
  const hardcoded = PROJECT_DATA[slug.toLowerCase()];
  if (hardcoded) return hardcoded;

  if (dbProject) {
    return {
      slug: dbProject.codename.toLowerCase(),
      name: dbProject.name,
      codename: dbProject.codename,
      agency: dbProject.agency || "INTER-AGENCY",
      agencyColor: "#ffffff",
      classification: dbProject.status === "archived" ? "DECLASSIFIED" : "TOP SECRET",
      years: `${dbProject.startYear || "UNK"}–${dbProject.endYear || "Present"}`,
      coverColor: "#000000",
      tags: ["intel", dbProject.codename.toLowerCase()],
      overview: dbProject.description || "Operational intelligence for this project remains highly classified.",
      fullDescription: [
        `Operational status: ${dbProject.status.toUpperCase()}. Primary Agency: ${dbProject.agency || "Unknown"}.`,
        "This project was established to investigate specific anomalous events and technological breakthroughs associated with unidentified aerospace phenomena.",
        "Personnel assigned to this operation are subject to the highest levels of compartmented security and non-disclosure agreements.",
        "Field data and recovery logs for this operation are currently being digitized and will be released in subsequent batches.",
      ],
      keyFacts: [
        `Status: ${dbProject.status}`,
        `Start: ${dbProject.startYear || "Classified"}`,
        `End: ${dbProject.endYear || "Active"}`,
        `Agency: ${dbProject.agency || "Inter-Agency"}`,
      ],
      keyFigures: ["CLASSIFIED", "DIRECTOR_REDACTED"],
      timeline: [
        { year: dbProject.startYear?.toString() || "19XX", event: "Project Authorization & Strategic Planning" },
        { year: "Ongoing", event: "Active Intelligence Gathering & Data Analysis" },
      ],
      relatedDocs: [],
      images: [],
      sourceUrl: "https://www.archives.gov/",
    };
  }

  return null;
}

const CLASS_COLORS: Record<string, string> = {
  "DECLASSIFIED": "#00ff00",
  "TOP SECRET": "#ffaa00",
  "ULTRA TOP SECRET": "#ff3333",
  "PARTIALLY DECLASSIFIED": "#0088ff",
};

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");

  useEffect(() => {
    const normalizedSlug = slug.toLowerCase().replace(/-/g, "");
    
    // Find in PROJECT_DATA using normalized keys
    const hardcodedKey = Object.keys(PROJECT_DATA).find(
      k => k.toLowerCase().replace(/-/g, "") === normalizedSlug
    );

    if (hardcodedKey && PROJECT_DATA[hardcodedKey]) {
      setProject(PROJECT_DATA[hardcodedKey]);
      setLoading(false);
      return;
    }

    // Fetch from DB if not hardcoded
    fetch("/api/operations")
      .then(res => res.json())
      .then(data => {
        const dbOp = data.find((o: any) => o.codename.toLowerCase().replace(/-/g, "") === normalizedSlug);
        if (dbOp) {
          setProject(getProjectBySlug(slug, dbOp));
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-t-2 border-[#00ff00] rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="font-mono text-[10px] text-red-400/60 uppercase tracking-widest mb-2">404 // FILE NOT FOUND</div>
          <h1 className="font-mono text-2xl font-bold text-white mb-4">PROJECT DOSSIER NOT FOUND</h1>
          <Link href="/projects" className="font-mono text-sm text-white/40 hover:text-white flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" /> Return to Projects
          </Link>
        </div>
      </div>
    );
  }

  const classColor = CLASS_COLORS[project.classification] || "#ffffff";

  return (
    <div className="min-h-screen pt-16 bg-[#030303] relative overflow-hidden">
      {/* Background Hyperglass / Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[160px] opacity-20"
          style={{ backgroundColor: project.coverColor }} />
        <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Hero banner */}
      <div className="relative border-b border-white/5 py-24 px-6 overflow-hidden" 
        style={{ background: `linear-gradient(135deg, ${project.coverColor}40 0%, transparent 60%)` }}>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.1)_3px,rgba(0,0,0,0.1)_4px)] pointer-events-none opacity-50" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/projects" className="flex items-center gap-2 font-mono text-xs text-white/30 hover:text-white transition-colors mb-8 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="font-mono text-[9px] text-white/30 uppercase tracking-widest mb-2">{project.agency} // {project.years}</div>
              <div className="font-mono text-sm text-white/40 uppercase tracking-widest mb-1">CODENAME</div>
              <h1 className="font-mono text-5xl font-black tracking-tighter text-white">{project.codename}</h1>
              <p className="font-mono text-lg text-white/50 mt-1">{project.name}</p>
            </div>
            <span className="font-mono text-[10px] px-3 py-1.5 rounded-lg border uppercase tracking-widest shrink-0 mt-2"
              style={{ color: classColor, borderColor: `${classColor}40`, backgroundColor: `${classColor}10` }}>
              {project.classification}
            </span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-2xl font-light">{project.overview}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((t: string) => (
              <span key={t} className="font-mono text-[9px] bg-white/5 text-white/30 px-2 py-0.5 rounded border border-white/5">#{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        {/* Key Facts */}
        <Section title="KEY FACTS" icon={<Shield className="w-4 h-4" />} open={expandedSection === "facts"} onToggle={() => setExpandedSection(expandedSection === "facts" ? null : "facts")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {project.keyFacts.map((fact, i) => (
              <div key={i} className="flex items-start gap-2 font-mono text-xs text-white/60 py-2 border-b border-white/5">
                <span className="text-[#00ff00]/40 shrink-0">›</span>{fact}
              </div>
            ))}
          </div>
        </Section>

        {/* Full Description */}
        <Section title="FULL DOSSIER" icon={<FileText className="w-4 h-4" />} open={expandedSection === "overview"} onToggle={() => setExpandedSection(expandedSection === "overview" ? null : "overview")}>
          <div className="space-y-4">
            {project.fullDescription.map((para, i) => (
              <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="text-sm text-white/60 leading-relaxed font-light border-l-2 border-white/5 pl-4 hover:border-white/20 transition-colors">
                {para}
              </motion.p>
            ))}
          </div>
        </Section>

        {/* Images */}
        {project.images.length > 0 && (
          <Section title="VISUAL INTELLIGENCE" icon={<Shield className="w-4 h-4" />} open={expandedSection === "images"} onToggle={() => setExpandedSection(expandedSection === "images" ? null : "images")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.images.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-white/10 bg-black/40 group/img relative">
                  <img 
                    src={img.url} 
                    alt={img.caption} 
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover/img:scale-110" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=10&blur=100";
                      (e.target as HTMLImageElement).style.filter = "grayscale(100%) brightness(50%) contrast(150%)";
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 hover:opacity-100 bg-black/60 transition-opacity pointer-events-none">
                    <Shield className="w-8 h-8 text-[#00ff00]/20" />
                    <span className="font-mono text-[8px] text-[#00ff00]/40 mt-2">CLASSIFIED_VISUAL</span>
                  </div>
                  <div className="p-3 font-mono text-[10px] text-white/40 border-t border-white/5 bg-black/60">{img.caption}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Timeline */}
        <Section title="TIMELINE" icon={<Calendar className="w-4 h-4" />} open={expandedSection === "timeline"} onToggle={() => setExpandedSection(expandedSection === "timeline" ? null : "timeline")}>
          <div className="space-y-3">
            {project.timeline.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="font-mono text-sm font-bold shrink-0 w-12" style={{ color: classColor }}>{item.year}</span>
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: classColor }} />
                  <p className="font-mono text-xs text-white/60">{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Key Figures */}
        <Section title="KEY PERSONNEL" icon={<Building2 className="w-4 h-4" />} open={expandedSection === "people"} onToggle={() => setExpandedSection(expandedSection === "people" ? null : "people")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {project.keyFigures.map((fig, i) => (
              <div key={i} className="flex items-center gap-2 font-mono text-xs text-white/60 py-2 border-b border-white/5">
                <span className="text-amber-400/60 shrink-0">›</span>{fig}
              </div>
            ))}
          </div>
        </Section>

        {/* Source Documents */}
        <div className="bg-white/[0.03] border rounded-2xl p-6" style={{ borderColor: `${classColor}20` }}>
          <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" /> Primary Source Documents
          </div>
          <div className="space-y-2">
            {project.relatedDocs.map((doc, i) => (
              <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 font-mono text-xs text-white/50 hover:text-[#00ff00] py-3 px-4 rounded-xl hover:bg-[#00ff00]/5 transition-all group border border-white/5 hover:border-[#00ff00]/20">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 shrink-0 text-white/20 group-hover:text-[#00ff00]" />
                    <span className="group-hover:text-white transition-colors">{doc.title}</span>
                  </div>
                  <div className="font-mono text-[8px] text-white/20 mt-1 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3" /> DECLASSIFIED_STAMP: {new Date().toLocaleDateString()} // 02:44:11_UTC
                  </div>
                </div>
                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/60 hover:text-white font-mono text-xs rounded-xl transition-all uppercase tracking-widest">
              <ExternalLink className="w-4 h-4" />
              Access Original Declassified Document
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, open, onToggle, children }: { title: string; icon: React.ReactNode; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-3 font-mono text-xs text-white/60 uppercase tracking-widest">
          <span className="text-white/30">{icon}</span>{title}
        </div>
        <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-6 pb-6">
          {children}
        </motion.div>
      )}
    </div>
  );
}
