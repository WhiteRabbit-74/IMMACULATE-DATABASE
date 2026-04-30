import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Seeding Intel Archive Database...");

  // AGENCIES
  const agencies = await Promise.all([
    prisma.agency.upsert({ where: { slug: "cia" }, update: {}, create: { name: "Central Intelligence Agency", slug: "cia", colorPrimary: "#0066cc", colorSecondary: "#003366", country: "USA", description: "Primary US foreign intelligence service" } }),
    prisma.agency.upsert({ where: { slug: "fbi" }, update: {}, create: { name: "Federal Bureau of Investigation", slug: "fbi", colorPrimary: "#cc3300", colorSecondary: "#660000", country: "USA", description: "US domestic intelligence and security" } }),
    prisma.agency.upsert({ where: { slug: "nsa" }, update: {}, create: { name: "National Security Agency", slug: "nsa", colorPrimary: "#006633", colorSecondary: "#003319", country: "USA", description: "Signals intelligence and cybersecurity" } }),
    prisma.agency.upsert({ where: { slug: "dod" }, update: {}, create: { name: "Department of Defense", slug: "dod", colorPrimary: "#333399", colorSecondary: "#1a1a66", country: "USA", description: "US military intelligence" } }),
    prisma.agency.upsert({ where: { slug: "aaro" }, update: {}, create: { name: "All-domain Anomaly Resolution Office", slug: "aaro", colorPrimary: "#009999", colorSecondary: "#004d4d", country: "USA", description: "UAP detection and analysis" } }),
    prisma.agency.upsert({ where: { slug: "usaf" }, update: {}, create: { name: "US Air Force", slug: "usaf", colorPrimary: "#004080", colorSecondary: "#002040", country: "USA", description: "US Air Force Intelligence" } }),
    prisma.agency.upsert({ where: { slug: "dia" }, update: {}, create: { name: "Defense Intelligence Agency", slug: "dia", colorPrimary: "#660066", colorSecondary: "#330033", country: "USA", description: "Military intelligence for DoD" } }),
    prisma.agency.upsert({ where: { slug: "mi6" }, update: {}, create: { name: "Secret Intelligence Service", slug: "mi6", colorPrimary: "#006600", colorSecondary: "#003300", country: "UK", description: "UK foreign intelligence service" } }),
  ]);

  const [cia, fbi, nsa, dod, aaro, usaf, dia, mi6] = agencies;

  // DEFAULT ADMIN USER
  await prisma.user.upsert({
    where: { email: "admin@intel.gov" },
    update: {},
    create: { email: "admin@intel.gov", name: "Principal Agent", role: "ADMIN", password: "admin123!" },
  });

  // HELPER to create docs
  const createDoc = async (data: {
    title: string; description: string; year: number; agencyId: string;
    status: string; tags: string[]; filePath: string; isFoia?: boolean;
    foiaNumber?: string; latitude?: number; longitude?: number; country?: string;
    operationId?: string;
  }) => {
    const tagOps = data.tags.map((name) => ({ where: { name }, create: { name } }));
    return prisma.document.create({
      data: {
        title: data.title, description: data.description, year: data.year,
        agencyId: data.agencyId, status: data.status,
        filePath: data.filePath, isFoia: data.isFoia ?? false,
        foiaNumber: data.foiaNumber,
        latitude: data.latitude, longitude: data.longitude, country: data.country,
        operationId: data.operationId,
        tags: { connectOrCreate: tagOps },
      },
    });
  };

  // ═══════════════════════════════════════
  // REAL DECLASSIFIED UAP/UFO DOCUMENTS
  // ═══════════════════════════════════════

  const docs = [
    // PROJECT BLUE BOOK
    { title: "Project Blue Book — Final Report 1969", description: "The Air Force's official investigation of UFO sightings from 1952 to 1969. Concluded that UFOs posed no national security threat, though 701 cases remained unexplained. Commissioned by the USAF and conducted by the University of Colorado.", year: 1969, agencyId: usaf.id, status: "declassified", tags: ["blue-book", "ufo", "usaf", "investigation"], filePath: "https://www.archives.gov/research/military/air-force/ufos", latitude: 38.8977, longitude: -77.0365, country: "USA" },

    // PROJECT GRUDGE
    { title: "Project Grudge Report — Technical Report No.102-AC-49/15-100", description: "Project Grudge was a short-lived project by the USAF to study UFOs from 1949-1951. The report analyzed 244 UFO reports, dismissing most as hoaxes or misidentifications. Predecessor to Project Blue Book.", year: 1949, agencyId: usaf.id, status: "declassified", tags: ["grudge", "ufo", "usaf", "1949"], filePath: "https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/ufo/", latitude: 38.8977, longitude: -77.0365, country: "USA" },

    // PROJECT SIGN
    { title: "Project Sign — Estimate of the Situation (1948)", description: "The original classified assessment by Project Sign that concluded UFOs might be interplanetary in origin. The report was ordered destroyed by General Hoyt Vandenberg but portions survived.", year: 1948, agencyId: usaf.id, status: "declassified", tags: ["project-sign", "ufo", "interplanetary", "1948"], filePath: "https://www.afhra.af.mil/", latitude: 38.8977, longitude: -77.0365, country: "USA" },

    // ROBERTSON PANEL
    { title: "Robertson Panel Report — CIA Scientific Advisory Panel on UFOs", description: "January 1953 CIA-convened scientific panel chaired by Howard P. Robertson. Concluded UFOs did not pose a direct threat but recommended debunking UFO reports to reduce public concern and clog intelligence channels.", year: 1953, agencyId: cia.id, status: "declassified", tags: ["robertson", "cia", "panel", "scientific"], filePath: "https://www.cia.gov/readingroom/collection/ufos-fact-or-fiction", latitude: 38.951, longitude: -77.148, country: "USA" },

    // MAJESTIC 12
    { title: "Majestic 12 — Briefing Document for President-Elect Eisenhower", description: "Alleged top-secret briefing document dated November 18, 1952, outlining Operation Majestic-12, a secret committee of scientists, military, and government officials formed after the Roswell crash. Authenticity disputed.", year: 1952, agencyId: cia.id, status: "classified", tags: ["mj12", "majestic", "roswell", "eisenhower", "top-secret"], filePath: "https://www.majesticdocuments.com/", latitude: 33.394, longitude: -104.523, country: "USA" },

    // ROSWELL REPORT
    { title: "The Roswell Report: Fact vs. Fiction in the New Mexico Desert", description: "Official USAF investigation into the 1947 Roswell incident, concluding the debris was from Project Mogul surveillance balloon. Released in 1994 following FOIA requests.", year: 1994, agencyId: usaf.id, status: "declassified", tags: ["roswell", "1947", "new-mexico", "balloon", "foia"], filePath: "https://media.defense.gov/2010/Oct/27/2001329162/-1/-1/0/AFD-101027-030.pdf", latitude: 33.394, longitude: -104.523, country: "USA", isFoia: true },

    // PROJECT AQUARIUS
    { title: "Project Aquarius — NSA Technical Journal Vol. XIV No. 2", description: "NSA internal document referencing Project Aquarius, described as a government project to collect intelligence on extraterrestrial biological entities (EBEs). Heavily redacted FOIA release.", year: 1977, agencyId: nsa.id, status: "classified", tags: ["aquarius", "nsa", "ebe", "extraterrestrial"], filePath: "https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/ufo/", latitude: 39.108, longitude: -76.772, country: "USA", isFoia: true, foiaNumber: "NSA-77-0412" },

    // PROJECT SIGMA
    { title: "Project Sigma — Communication with Extraterrestrial Intelligence", description: "Alleged classified project attempting to establish communication with non-human intelligence. Referenced in various FOIA-released documents. Details remain largely classified. Associated with Project Aquarius.", year: 1954, agencyId: nsa.id, status: "classified", tags: ["sigma", "communication", "eti", "extraterrestrial"], filePath: "https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/ufo/", latitude: 39.108, longitude: -76.772, country: "USA" },

    // AARO HISTORICAL RECORD REPORT
    { title: "AARO Historical Record Report — Vol. 1 (2024)", description: "The All-domain Anomaly Resolution Office's first official historical record of the US government's investigations of UAPs since 1945. Reviewed thousands of classified programs, finding no evidence of hidden ET technology.", year: 2024, agencyId: aaro.id, status: "declassified", tags: ["aaro", "uap", "2024", "historical", "official"], filePath: "https://www.aaro.mil/Portals/136/PDFs/AARO_Historical_Record_Report_Vol1_2024.pdf", latitude: 38.8977, longitude: -77.0365, country: "USA" },

    // NIMITZ INCIDENT
    { title: "USS Nimitz UAP Encounter — FLIR1 Video Analysis Report", description: "Official Navy analysis of the 2004 USS Nimitz UAP encounter. The FLIR1 video shows an unidentified object performing impossible maneuvers off the coast of California. Declassified by DoD in 2020.", year: 2004, agencyId: dod.id, status: "declassified", tags: ["nimitz", "uap", "navy", "flir", "2004", "california"], filePath: "https://www.navair.navy.mil/", latitude: 32.0, longitude: -120.0, country: "USA" },

    // GIMBAL VIDEO
    { title: "GIMBAL UAP Video — USS Roosevelt Encounter Analysis", description: "Analysis of the GIMBAL video captured by a Navy F/A-18 pilot in 2015 off the East Coast. Shows an unidentified aerial object rotating while in motion with no visible propulsion. Released by DoD in 2017.", year: 2015, agencyId: dod.id, status: "declassified", tags: ["gimbal", "uap", "navy", "f18", "2015"], filePath: "https://www.defense.gov/", latitude: 33.0, longitude: -75.0, country: "USA" },

    // GOFAST VIDEO
    { title: "GOFAST UAP Video — Navy Pilot Encounter Report", description: "Navy pilot encounter from 2015 showing an unidentified object moving at incredible speed at very low altitude over the ocean. Part of the three videos released by the DoD in April 2020.", year: 2015, agencyId: dod.id, status: "declassified", tags: ["gofast", "uap", "navy", "2015", "speed"], filePath: "https://www.defense.gov/", latitude: 32.0, longitude: -76.0, country: "USA" },

    // UAP TASK FORCE REPORT
    { title: "Preliminary Assessment: Unidentified Aerial Phenomena (2021)", description: "The Office of the Director of National Intelligence's preliminary assessment on UAPs. Examined 144 reports from military pilots, confirming 18 cases exhibited unusual movement. One case identified as a balloon.", year: 2021, agencyId: dod.id, status: "declassified", tags: ["uap", "odni", "2021", "military", "assessment"], filePath: "https://www.dni.gov/files/ODNI/documents/assessments/Prelimary-Assessment-UAP-20210625.pdf", latitude: 38.8977, longitude: -77.0365, country: "USA" },

    // PROJECT GATEWAY
    { title: "Analysis and Assessment of Gateway Process — CIA (1983)", description: "Colonel Wayne McDonnell's classified assessment of the Monroe Institute's Gateway Experience — an altered states program using binaural beats. Studies consciousness as an energy system outside time-space. Declassified 2003.", year: 1983, agencyId: cia.id, status: "declassified", tags: ["gateway", "consciousness", "monroe", "cia", "hemi-sync"], filePath: "https://www.cia.gov/readingroom/document/cia-rdp96-00788r001700210016-5", latitude: 38.951, longitude: -77.148, country: "USA", isFoia: true, foiaNumber: "CIA-RDP96-00788R001700210016-5" },

    // STARGATE PROJECT
    { title: "Project STARGATE — Remote Viewing Operations Final Report", description: "DIA/CIA sponsored program from 1972-1995 investigating psychic phenomena including remote viewing. Involved major research institutions. $20 million program declassified by CIA in 1995.", year: 1995, agencyId: cia.id, status: "declassified", tags: ["stargate", "remote-viewing", "psychic", "cia", "dia"], filePath: "https://www.cia.gov/readingroom/collection/stargate", latitude: 37.254, longitude: -121.965, country: "USA", isFoia: true },

    // MK ULTRA
    { title: "Project MKUltra — CIA Mind Control Program Documents", description: "Declassified CIA documents on the illegal program of mind control experiments from 1953-1973. Involved administration of LSD and other drugs to unwitting subjects. Exposed by Church Committee 1975.", year: 1953, agencyId: cia.id, status: "declassified", tags: ["mkultra", "mind-control", "cia", "illegal", "church-committee"], filePath: "https://www.cia.gov/readingroom/collection/mkultra", latitude: 38.951, longitude: -77.148, country: "USA", isFoia: true },

    // FLYING SAUCER WORKING PARTY
    { title: "Flying Saucer Working Party Report — UK Ministry of Defence", description: "1951 British intelligence assessment of flying saucer reports, concluding they were misidentifications of natural phenomena or conventional aircraft. One of the earliest official non-US UFO investigations.", year: 1951, agencyId: mi6.id, status: "declassified", tags: ["uk", "flying-saucer", "mod", "british", "1951"], filePath: "https://www.nationalarchives.gov.uk/ufos/", latitude: 51.5074, longitude: -0.1278, country: "UK" },

    // FBI VAULT — THE MEMORANDUM
    { title: "FBI Vault — Guy Hottel Memorandum (Flying Discs)", description: "Famous 1950 FBI memo from Guy Hottel reporting that three flying saucers had been recovered in New Mexico, each 50 feet in diameter, containing three small humanoid bodies. Most viewed document in FBI Vault history.", year: 1950, agencyId: fbi.id, status: "declassified", tags: ["fbi", "hottel", "memorandum", "new-mexico", "flying-disc"], filePath: "https://vault.fbi.gov/UFO/UFO%20Part%201%20of%2016/view", latitude: 33.394, longitude: -104.523, country: "USA", isFoia: true, foiaNumber: "FBI-62-83894" },

    // WILSON DAVIS MEMO
    { title: "Wilson-Davis Memo — UAP Crash Retrieval Program", description: "Alleged 2002 conversation notes between Admiral Thomas Wilson and astrophysicist Eric Davis, describing Wilson's attempts to access a private contractor's UAP reverse-engineering program. Authenticity disputed.", year: 2002, agencyId: dia.id, status: "classified", tags: ["wilson", "davis", "crash-retrieval", "dia", "contractor"], filePath: "https://www.aaro.mil/", latitude: 38.8977, longitude: -77.0365, country: "USA" },

    // PENTAGON UAP PROGRAM
    { title: "AATIP — Advanced Aerospace Threat Identification Program Files", description: "Declassified summary of the secret Pentagon program run from 2007-2012 by Luis Elizondo. Investigated UAP encounters and contracted Bigelow Aerospace for related studies. Budget: $22 million.", year: 2007, agencyId: dod.id, status: "declassified", tags: ["aatip", "pentagon", "elizondo", "bigelow", "uap"], filePath: "https://www.defense.gov/", latitude: 38.8719, longitude: -77.0563, country: "USA" },

    // IRANIAN ENCOUNTER 1976
    { title: "Iran UFO Incident 1976 — DIA Report", description: "Declassified DIA report on the September 19, 1976 Tehran UFO incident where Iranian Air Force jets intercepted a UFO over Tehran. Multiple weapon system failures reported. Considered one of the best documented military UFO cases.", year: 1976, agencyId: dia.id, status: "declassified", tags: ["iran", "tehran", "1976", "military", "weapons-failure"], filePath: "https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/ufo/", latitude: 35.6892, longitude: 51.389, country: "Iran" },

    // SOM 1-01
    { title: "SOM 1-01 — Majestic 12 Special Operations Manual", description: "Alleged 1954 military manual detailing procedures for recovering crashed extraterrestrial craft and biological entities. Outlines security protocols, transportation, and quarantine procedures. Authenticity heavily debated.", year: 1954, agencyId: dod.id, status: "classified", tags: ["som-1-01", "mj12", "crash-retrieval", "manual", "ebe"], filePath: "https://www.majesticdocuments.com/", latitude: 38.8977, longitude: -77.0365, country: "USA" },

    // BLACK VAULT — PENTAGON UAP PROGRAM
    { title: "Pentagon UAP Videos — Official Release Memorandum (2020)", description: "Official memorandum authorizing public release of the three UAP videos (FLIR1, GIMBAL, GOFAST) by Acting Assistant Secretary of Defense for Public Affairs. Confirms the videos are authentic Navy footage.", year: 2020, agencyId: dod.id, status: "declassified", tags: ["pentagon", "2020", "release", "videos", "uap", "official"], filePath: "https://media.defense.gov/2020/Apr/27/2002285946/-1/-1/0/", latitude: 38.8719, longitude: -77.0563, country: "USA" },

    // CONDON REPORT
    { title: "Scientific Study of UFOs — Condon Report (1968)", description: "University of Colorado UFO study commissioned by the USAF, directed by Edward Condon. Examined 59 cases over 2 years. Concluded further scientific study was not warranted, though 30% of cases were unexplained.", year: 1968, agencyId: usaf.id, status: "declassified", tags: ["condon", "scientific", "colorado", "usaf", "study"], filePath: "https://www.ncas.org/condon/", latitude: 40.0150, longitude: -105.2705, country: "USA" },

    // KECKSBURG INCIDENT
    { title: "Kecksburg UFO Incident — NASA Internal Documents", description: "NASA documents obtained via FOIA related to the December 1965 Kecksburg, Pennsylvania incident where a fireball was reported and a metallic acorn-shaped object allegedly recovered by military. NASA claimed no records existed until 2003.", year: 1965, agencyId: nsa.id, status: "declassified", tags: ["kecksburg", "pennsylvania", "1965", "fireball", "nasa"], filePath: "https://www.archives.gov/", latitude: 40.182, longitude: -79.457, country: "USA", isFoia: true },

    // RENDLESHAM FOREST
    { title: "Rendlesham Forest Incident — UK MoD Investigation Files", description: "UK Ministry of Defence files on the December 1980 UFO incident near RAF Bentwaters/Woodbridge, Suffolk. Multiple US Air Force personnel reported witnessing an unidentified craft land in the forest.", year: 1980, agencyId: mi6.id, status: "declassified", tags: ["rendlesham", "uk", "mod", "1980", "raf", "bentwaters"], filePath: "https://www.nationalarchives.gov.uk/", latitude: 52.0936, longitude: 1.4403, country: "UK" },

    // NSA UFO DOCUMENTS
    { title: "NSA — UFO-Related Communications Intelligence Documents", description: "Collection of NSA signals intelligence documents related to UFO incidents, released under FOIA. Includes intercepts referencing unidentified aerial objects from multiple countries. Many pages still heavily redacted.", year: 1979, agencyId: nsa.id, status: "declassified", tags: ["nsa", "sigint", "foia", "comint", "ufo"], filePath: "https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/ufo/communications_intelligence.pdf", latitude: 39.108, longitude: -76.772, country: "USA", isFoia: true, foiaNumber: "NSA-79-UFO-001" },

    // CONGRESSIONAL UAP HEARING 2023
    { title: "Congressional UAP Hearing — Whistleblower Testimonies (2023)", description: "Transcripts and documents from the July 2023 House Oversight Subcommittee hearing on UAPs. Former intelligence officer David Grusch testified under oath about a secret multi-decade crash retrieval and reverse-engineering program.", year: 2023, agencyId: dod.id, status: "declassified", tags: ["congress", "grusch", "2023", "whistleblower", "hearing", "crash-retrieval"], filePath: "https://oversight.house.gov/hearing/unidentified-anomalous-phenomena-implications-on-national-security-public-safety-and-government-transparency/", latitude: 38.89, longitude: -77.009, country: "USA" },

    // AARO UAP REPORT VOL 2
    { title: "AARO Historical Record Report — Vol. 2 (2024)", description: "Second volume of AARO's historical record covering UAP-related programs from 1945 to present. Addresses claims of non-human intelligence, crash retrieval programs, and Congressional whistleblower allegations.", year: 2024, agencyId: aaro.id, status: "declassified", tags: ["aaro", "uap", "2024", "vol2", "crash-retrieval"], filePath: "https://www.aaro.mil/", latitude: 38.8977, longitude: -77.0365, country: "USA" },

    // BELGIAN UFO WAVE
    { title: "Belgian UFO Wave — NATO/Belgian Air Force Investigation", description: "Official Belgian Air Force investigation into the 1989-1990 UFO wave over Belgium, including triangular objects tracked on radar. Over 13,500 reported sightings. F-16 jets scrambled but failed to intercept.", year: 1990, agencyId: dod.id, status: "declassified", tags: ["belgium", "nato", "f16", "triangle", "1990", "radar"], filePath: "https://www.cobeps.org/", latitude: 50.8503, longitude: 4.3517, country: "Belgium" },

    // PHOENIX LIGHTS
    { title: "Phoenix Lights Investigation — FAA & Military Reports", description: "Official FAA and military reports on the March 13, 1997 Phoenix Lights event witnessed by thousands across Arizona and Nevada. Massive V-shaped craft reported. Military claimed flares from exercise.", year: 1997, agencyId: usaf.id, status: "declassified", tags: ["phoenix", "lights", "1997", "arizona", "faa", "flares"], filePath: "https://www.archives.gov/", latitude: 33.4484, longitude: -112.074, country: "USA" },
    { title: "Tehran UFO Incident 1976 — DIA Report", description: "DIA intelligence report on the F-4 Phantom intercept of a UFO over Tehran. Multiple electronic equipment failures reported as the jet approached the object.", year: 1976, agencyId: dia.id, status: "declassified", tags: ["tehran", "iran", "1976", "dia", "intercept"], filePath: "https://www.nsa.gov/portals/75/documents/news-features/declassified-documents/ufo/", latitude: 35.6892, longitude: 51.389, country: "Iran" },
    { title: "Project Moon Dust — Recovery of Unidentified Space Objects", description: "Air Force collection program for the recovery of space debris and unidentified objects. Includes procedures for field teams and decontamination protocols.", year: 1953, agencyId: usaf.id, status: "classified", tags: ["moon-dust", "recovery", "space-debris", "usaf"], filePath: "https://www.archives.gov/", latitude: 38.8977, longitude: -77.0365, country: "USA" },
    { title: "CIA Remote Viewing Session — Mars 1 Million B.C.", description: "Transcript of a 1984 remote viewing session where a psychic was tasked with coordinates on Mars. The viewer described massive structures and tall, thin beings.", year: 1984, agencyId: cia.id, status: "declassified", tags: ["stargate", "mars", "remote-viewing", "cia"], filePath: "https://www.cia.gov/readingroom/document/cia-rdp96-00788r001900760001-1", latitude: -14.6, longitude: -175.4, country: "Mars" },
    { title: "Operation Mainbrace — NATO Naval Exercise Sightings", description: "Official reports from NATO personnel regarding several unidentified objects sighted during large-scale naval maneuvers in the North Sea in 1952.", year: 1952, agencyId: mi6.id, status: "declassified", tags: ["mainbrace", "nato", "navy", "1952"], filePath: "https://www.nationalarchives.gov.uk/", latitude: 58.0, longitude: 0.0, country: "North Sea" },
    { title: "Mantis Encounter — RAF Bentwaters/Rendlesham Forest", description: "Detailed testimony from USAF security police regarding the landing of a triangular craft in Suffolk, UK. High radiation levels recorded at the landing site.", year: 1980, agencyId: mi6.id, status: "declassified", tags: ["rendlesham", "uk", "1980", "triangular", "radiation"], filePath: "https://www.nationalarchives.gov.uk/", latitude: 52.09, longitude: 1.44, country: "UK" },
    { title: "The Lakenheath-Bentwaters Incident 1956 — USAF/RAF Report", description: "Radar-visual sighting of multiple UFOs performing impossible maneuvers over East Anglia. Objects were tracked on three different radar systems simultaneously.", year: 1956, agencyId: usaf.id, status: "declassified", tags: ["lakenheath", "radar", "1956", "uk"], filePath: "https://www.archives.gov/", latitude: 52.41, longitude: 0.56, country: "UK" },
    { title: "FBI Memo — Guy Hottel 'Three Flying Saucers' (1950)", description: "One of the most famous documents in the FBI Vault. Reports that an investigator for the Air Force stated three so-called flying saucers had been recovered in New Mexico.", year: 1950, agencyId: fbi.id, status: "declassified", tags: ["fbi", "hottel", "saucers", "new-mexico"], filePath: "https://vault.fbi.gov/UFO/UFO%20Part%201%20of%2016/view", latitude: 33.39, longitude: -104.52, country: "USA" },
  ];

  // ═══════════════════════════════════════
  // OPERATIONS / PROJECTS
  // ═══════════════════════════════════════
  console.log("\n📁 Seeding Intelligence Operations...");
  
  const operations = [
    { name: "Project Aquarius", codename: "AQUARIUS", agency: "NSA", startYear: 1977, endYear: null, status: "active", description: "High-level clandestine project to collect intelligence on extraterrestrial biological entities and their interaction with humanity." },
    { name: "Majestic 12", codename: "MAJESTIC", agency: "Inter-Agency", startYear: 1947, endYear: null, status: "ongoing", description: "Secret committee of scientists, military officials, and government figures formed by executive order of President Truman to manage ET recovery." },
    { name: "Project Blue Book", codename: "BLUE BOOK", agency: "US Air Force", startYear: 1952, endYear: 1969, status: "archived", description: "The most famous public investigation into UFO sightings. Officially closed in 1969 but reportedly continued in shadow programs." },
    { name: "Project Stargate", codename: "STARGATE", agency: "CIA/DIA", startYear: 1972, endYear: 1995, status: "archived", description: "Investigation into psychic phenomena, specifically remote viewing, for intelligence gathering and espionage purposes." },
    { name: "Project Gateway", codename: "GATEWAY", agency: "CIA", startYear: 1983, endYear: 1984, status: "completed", description: "Scientific assessment of the Gateway Experience — achieving altered states of consciousness to access non-physical dimensions." },
    { name: "Operation Moon Dust", codename: "MOON DUST", agency: "USAF/CIA", startYear: 1953, endYear: null, status: "active", description: "Specialized recovery teams tasked with retrieving fallen non-US space debris and unidentified objects from anywhere on Earth." },
    { name: "Project Sigma", codename: "SIGMA", agency: "NSA", startYear: 1954, endYear: null, status: "active", description: "NSA program dedicated to establishing and maintaining communication with non-human intelligence through radio and signals." },
    { name: "Project MKUltra", codename: "MKULTRA", agency: "CIA", startYear: 1953, endYear: 1973, status: "archived", description: "Classified CIA mind control program involving experiments on human subjects, often using drugs like LSD." },
    { name: "Operation Paperclip", codename: "PAPERCLIP", agency: "OSS/DoD", startYear: 1945, endYear: 1959, status: "completed", description: "Secret program to bring Nazi scientists to the US to work on military and aerospace technology." },
    { name: "Project Mogul", codename: "MOGUL", agency: "USAF", startYear: 1947, endYear: 1948, status: "completed", description: "Top-secret balloon surveillance project used to monitor Soviet nuclear tests — often cited as the real cause of the Roswell debris." },
    { name: "Project Corona", codename: "CORONA", agency: "CIA/NRO", startYear: 1959, endYear: 1972, status: "archived", description: "The first US spy satellite program used for photographic surveillance of the Soviet Union and China." },
    { name: "Project Magnet", codename: "MAGNET", agency: "Transport Canada", startYear: 1950, endYear: 1954, status: "archived", description: "Canadian investigation into UFOs and magnetic theory, led by Wilbert Smith. Focused on the possibility of extraterrestrial craft using magnetic propulsion." },
    { name: "Project Second Storey", codename: "SECOND STOREY", agency: "DRB Canada", startYear: 1952, endYear: 1954, status: "archived", description: "Canadian government committee tasked with examining UFO reports and evaluating the potential threat to national security." },
    { name: "Project Condign", codename: "CONDIGN", agency: "UK Ministry of Defence", startYear: 1997, endYear: 2000, status: "archived", description: "Secret UK MoD study on Unidentified Aerial Phenomena. Concluded that many sightings were 'Unidentified Plasma Phenomena' but remained highly controversial." },
    { name: "COMETA", codename: "COMETA", agency: "French Intelligence/CNES", startYear: 1999, endYear: 1999, status: "completed", description: "The COMETA Report — a high-level study by French generals and aerospace experts concluding that the extraterrestrial hypothesis is the most likely." },
    { name: "GEIPAN", codename: "GEIPAN", agency: "CNES France", startYear: 1977, endYear: null, status: "ongoing", description: "Official French government agency responsible for investigating unidentified aerospace phenomena. One of the only open official agencies in the world." },
    { name: "Project Hessdalen", codename: "HESSDALEN", agency: "Hessdalen Interactive", startYear: 1983, endYear: null, status: "ongoing", description: "Scientific monitoring of the Hessdalen lights in Norway. Utilizes automated sensors and radar to track recurring anomalous light phenomena." },
    { name: "Operation Highjump", codename: "HIGHJUMP", agency: "US Navy", startYear: 1946, endYear: 1947, status: "completed", description: "Massive US Navy expedition to Antarctica led by Admiral Byrd. Rumors persist of encounters with anomalous craft and secret bases under the ice." },
    { name: "Project Serpo", codename: "SERPO", agency: "DIA", startYear: 1965, endYear: 1978, status: "archived", description: "Alleged secret exchange program between the US government and inhabitants of the Serpo system in the Zeta Reticuli star group." },
    { name: "Project Gleem", codename: "GLEEM", agency: "NSA", startYear: 1953, endYear: 1977, status: "completed", description: "Precursor to Project Aquarius. Involved the initial collection and centralization of all ET-related intelligence within the intelligence community." },
    { name: "Project Snowbird", codename: "SNOWBIRD", agency: "USAF", startYear: 1972, endYear: null, status: "active", description: "Clandestine program focused on the research, development, and test flights of recovered non-human aerial technology." },
    { name: "Project Pounce", codename: "POUNCE", agency: "MAJESTIC", startYear: 1947, endYear: null, status: "active", description: "Rapid response recovery teams tasked with the retrieval of crashed or disabled unidentified aerospace craft." },
    { name: "Project Redlight", codename: "REDLIGHT", agency: "USAF/S4", startYear: 1954, endYear: null, status: "active", description: "Highly classified attempts to fly recovered alien craft. Reportedly suffered multiple catastrophic failures in the early stages." },
    { name: "Project Horizon", codename: "HORIZON", agency: "US Army", startYear: 1959, endYear: 1959, status: "completed", description: "US Army proposal to establish a lunar base by 1965. Included plans for defending the base against potential hostile spacecraft." },
    { name: "Project A119", codename: "A119", agency: "USAF", startYear: 1958, endYear: 1959, status: "completed", description: "Top-secret plan to detonate a nuclear weapon on the Moon to demonstrate US power and study the resulting dust cloud." },
    { name: "Project Blue Book Special Report No. 14", codename: "REPORT 14", agency: "Battelle Memorial Institute", startYear: 1951, endYear: 1954, status: "completed", description: "Comprehensive statistical study of UFO reports. Concluded that the 'unknowns' were significantly different from the 'knowns'." },
    { name: "Operation Mainbrace (UFO Segment)", codename: "MAINBRACE", agency: "NATO", startYear: 1952, endYear: 1952, status: "archived", description: "Investigation into high-profile sightings by naval personnel during a massive NATO exercise in the North Sea." },
    { name: "Project Ozma", codename: "OZMA", agency: "NRAO", startYear: 1960, endYear: 1960, status: "completed", description: "The first experiment in the Search for Extraterrestrial Intelligence (SETI), led by Frank Drake. Targeted Tau Ceti and Epsilon Eridani." },
    { name: "Project Silver Bug", codename: "SILVER BUG", agency: "USAF", startYear: 1952, endYear: 1955, status: "archived", description: "Design project for a vertical take-off and landing (VTOL) flying disc aircraft based on the Coanda effect." },
    { name: "Project 1794", codename: "1794", agency: "USAF/Avro Canada", startYear: 1956, endYear: 1960, status: "archived", description: "Classified project to build a supersonic flying saucer capable of Mach 4. Prototypes were built but failed to achieve stability." },
    { name: "Project Manhigh", codename: "MANHIGH", agency: "USAF", startYear: 1955, endYear: 1958, status: "completed", description: "High-altitude balloon flights designed to investigate the effects of cosmic rays and thin atmosphere on human pilots." },
    { name: "Project Excelsior", codename: "EXCELSIOR", agency: "USAF", startYear: 1959, endYear: 1960, status: "completed", description: "Series of high-altitude parachute jumps by Joseph Kittinger, testing survival in the near-space environment." },
    { name: "Project Aurora", codename: "AURORA", agency: "USAF/CIA", startYear: 1989, endYear: null, status: "active", description: "Alleged secret hypersonic surveillance aircraft, often mistaken for UAPs due to its unconventional triangular shape and sonic booms." },
    { name: "Project Blue Fly", codename: "BLUE FLY", agency: "USAF", startYear: 1957, endYear: null, status: "active", description: "Rapid response teams specialized in the recovery and transport of unidentified objects and technological debris to secure facilities." },
    { name: "Project White-out", codename: "WHITE-OUT", agency: "NSA", startYear: 1961, endYear: 1965, status: "completed", description: "Monitoring program for Soviet radar anomalies that appeared to track high-speed objects moving at impossible velocities." },
    { name: "Project Looking Glass", codename: "LOOKING GLASS", agency: "Strategic Air Command", startYear: 1961, endYear: 1990, status: "archived", description: "Continuous airborne command post designed to ensure control of US nuclear forces. Often associated with 'remote viewing' rumors in fringe circles." },
    { name: "Project Blue Beam", codename: "BLUE BEAM", agency: "NASA (Alleged)", startYear: 1994, endYear: null, status: "ongoing", description: "A conspiracy theory involving the use of holographic technology to simulate an alien invasion for global control purposes." },
    { name: "Project Solar Warden", codename: "SOLAR WARDEN", agency: "US Space Command (Alleged)", startYear: 1980, endYear: null, status: "active", description: "Alleged secret space fleet consisting of massive cigar-shaped carriers and smaller scout craft patrolling the solar system." },
  ];

  for (const op of operations) {
    await prisma.operation.upsert({
      where: { name: op.name },
      update: op,
      create: op,
    });
  }

  let created = 0;
  for (const doc of docs) {
    // Find matching operation if tag exists
    let opId = undefined;
    const projectMatch = operations.find(o => doc.tags.includes(o.codename.toLowerCase().replace(" ", "-")) || doc.tags.includes(o.codename.toLowerCase()));
    if (projectMatch) {
      const op = await prisma.operation.findUnique({ where: { name: projectMatch.name } });
      opId = op?.id;
    }

    await createDoc({ ...doc, operationId: opId });
    created++;
    process.stdout.write(`\r  ✓ ${created}/${docs.length} documents created`);
  }

  // 📁 SEED MEDIA ASSETS
  console.log("\n📁 Seeding Media Archive...");
  const mediaAssets = [
    { type: "image", category: "photo", title: "McMinville Sighting 1950", description: "Trent family farmhouse photograph of a metallic disc over Oregon.", filePath: "https://upload.wikimedia.org/wikipedia/commons/b/b3/McMinville_UFO_1.jpg", year: 1950, tags: "trent,oregon,1950,classic" },
    { type: "image", category: "satellite", title: "Black Knight Satellite — STS-88", description: "Photograph from the Space Shuttle Endeavour showing an unidentified orbital object.", filePath: "https://upload.wikimedia.org/wikipedia/commons/d/df/STS088-724-66.jpg", year: 1998, tags: "nasa,satellite,orbit,black-knight" },
    { type: "image", category: "thermal", title: "Gimbal Incident — ATFLIR Frame", description: "Thermal infrared frame from F/A-18 Super Hornet targeting pod showing an anomalous aerial object.", filePath: "https://upload.wikimedia.org/wikipedia/commons/e/e9/F-18_SH_ATFLIR_UFO.jpg", year: 2015, tags: "navy,thermal,ir,gimbal" },
    { type: "video", category: "video", title: "Nimitz 'Tic-Tac' HUD Footage", description: "Declassified HUD video from the 2004 Nimitz encounter.", filePath: "https://archive.org/download/GimbalGoFastNimitz/Gimbal.mp4", year: 2004, tags: "tic-tac,nimitz,navy,video" },
    { type: "audio", category: "audio", title: "WOW! Signal — Raw Data Transcription", description: "Audio representation of the narrowband radio signal detected by Jerry Ehman in 1977.", filePath: "https://archive.org/download/wow-signal-audio/wow.mp3", year: 1977, tags: "seti,radio,wow,signal" },
    { type: "image", category: "evidence", title: "Rendlesham Forest Trace Evidence", description: "Physical landing site analysis from the 1980 UK incident.", filePath: "https://upload.wikimedia.org/wikipedia/commons/0/07/UFO_Rendlesham_Forest_Depiction.jpg", year: 1980, tags: "uk,radiation,landing,trace" },
    { type: "image", category: "artifact", title: "Roswell Debris — Official Photo", description: "Intelligence officers examining wreckage found at the Brazel ranch in 1947.", filePath: "https://upload.wikimedia.org/wikipedia/commons/2/23/Roswell_Debris.jpg", year: 1947, tags: "roswell,debris,1947,crash" },
  ];

  for (const asset of mediaAssets) {
    await prisma.media.create({ data: asset });
  }

  console.log(`\n✅ Database seeded successfully!`);
  console.log(`   Agencies: ${agencies.length}`);
  console.log(`   Documents: ${created}`);
  console.log(`   Media Assets: ${mediaAssets.length}`);
  console.log(`\n🔑 Admin Login: admin@intel.gov / admin123!`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
