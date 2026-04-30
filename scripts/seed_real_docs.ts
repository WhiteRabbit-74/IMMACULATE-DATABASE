import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REAL_DOCS = [
  {
    title: "CIA-RDP96-00788R001700210016-5: Mars Exploration",
    description: "Remote viewing session (1984) focused on anomalous structures and environmental conditions on Mars approximately 1 million years B.C.",
    year: 1984,
    agencySlug: "cia",
    status: "declassified",
    tags: ["stargate", "remote-viewing", "mars", "psy-ops"],
    lat: 41.8719, lng: 12.5674 
  },
  {
    title: "Majestic-12 (MJ-12) Annual Report: 1952",
    description: "Restricted briefing on recovered technology from New Mexico crashes. Details isotopic analysis of 'memory-metal' fragments.",
    year: 1952,
    agencySlug: "dod",
    status: "classified",
    tags: ["mj12", "top-secret", "roswell", "reverse-engineering"],
    lat: 33.3943, lng: -104.5230 
  },
  {
    title: "AATIP Tic-Tac Briefing: Nimitz Incident",
    description: "Official summary of the 2004 Nimitz Carrier Strike Group encounters with anomalous aerial vehicles exhibiting transmedium capabilities.",
    year: 2004,
    agencySlug: "aatip",
    status: "declassified",
    tags: ["aatip", "tic-tac", "uap", "navy"],
    lat: 31.7584, lng: -117.8181 
  },
  {
    title: "Project Blue Book Special Report No. 14",
    description: "The most comprehensive statistical study of UFO sightings conducted by the USAF, covering data from 1947 to 1952.",
    year: 1955,
    agencySlug: "usaf",
    status: "declassified",
    tags: ["bluebook", "ufo", "statistical-analysis"],
    lat: 39.7589, lng: -84.1916 
  },
  {
    title: "Wilson-Davis Memo Transcript",
    description: "Leaked notes of Admiral Thomas Wilson's briefing on the existence of unacknowledged special access programs (USAPs) involving non-human technology.",
    year: 2002,
    agencySlug: "dia",
    status: "classified",
    tags: ["mj12", "leak", "reverse-engineering", "usap"],
    lat: 38.8719, lng: -77.0563 
  },
  {
    title: "Operation Moon Dust: Recovery Log #12",
    description: "Field recovery records of an anomalous spherical object retrieved in North Africa. Exhibit high thermal resistance.",
    year: 1967,
    agencySlug: "dia",
    status: "classified",
    tags: ["moondust", "recovery", "africa"],
    lat: 26.3351, lng: 12.8526 
  },
  {
    title: "Gateway Process Analysis: CIA-RDP96-00788R001700210016-5",
    description: "Evaluation of the Hemi-Sync technique for altering consciousness and interacting with non-physical dimensions.",
    year: 1983,
    agencySlug: "cia",
    status: "declassified",
    tags: ["gateway", "consciousness", "classified-research"],
    lat: 37.9515, lng: -78.4358 
  },
  {
    title: "Project Aquarius Executive Briefing",
    description: "The primary project overseeing EBE research and the 16 recovered entities since 1947.",
    year: 1977,
    agencySlug: "nsa",
    status: "classified",
    tags: ["aquarius", "ebe", "contact"],
    lat: 39.1158, lng: -76.7728 
  },
  {
    title: "Project Sign: Estimate of the Situation",
    description: "The initial 1948 conclusion that UFOs were of interplanetary origin, subsequently rejected by Gen. Vandenberg.",
    year: 1948,
    agencySlug: "usaf",
    status: "declassified",
    tags: ["sign", "ufo", "interplanetary"],
    lat: 38.8977, lng: -77.0365 
  },
  {
    title: "Rendlesham Forest Binary Code Transmission",
    description: "Transcription of the binary sequence recorded by Jim Penniston during the 1980 encounter at RAF Bentwaters.",
    year: 1980,
    agencySlug: "usaf", 
    status: "declassified",
    tags: ["pounce", "binary-code", "bentwaters"],
    lat: 52.1384, lng: 1.4116 
  },
  {
    title: "FBI Vault: Guy Hottel Memo (1950)",
    description: "A 1950 memo from an FBI agent reporting that three 'flying saucers' had been recovered in New Mexico. Each occupied by three bodies of human shape but only 3 feet tall.",
    year: 1950,
    agencySlug: "fbi",
    status: "declassified",
    tags: ["fbi", "vault", "roswell", "aliens"],
    lat: 33.3943, lng: -104.5230
  },
  {
    title: "Project Grudge: Technical Report No. 102-AC-49/15-100",
    description: "Successor to Project Sign, focusing on debunking sightings. This report concludes that UFOs do not threaten national security.",
    year: 1949,
    agencySlug: "usaf",
    status: "declassified",
    tags: ["grudge", "ufo", "debunking"],
    lat: 39.7589, lng: -84.1916
  },
  {
    title: "The Cometa Report (France 1999)",
    description: "A high-level report by retired French military and aerospace experts concluding that the 'extraterrestrial hypothesis' is the most logical for UAP.",
    year: 1999,
    agencySlug: "dia",
    status: "declassified",
    tags: ["cometa", "france", "military-analysis"],
    lat: 48.8566, lng: 2.3522
  },
  {
    title: "The Brookings Report (1960)",
    description: "NASA-commissioned study discussing the potential impact on society if evidence of extraterrestrial intelligence was discovered.",
    year: 1960,
    agencySlug: "dod",
    status: "declassified",
    tags: ["brookings", "nasa", "societal-impact"],
    lat: 38.8833, lng: -77.0167
  },
  {
    title: "Socorro Landing Report (Zamora 1964)",
    description: "Verified physical landing of a craft with two small occupants witnessed by officer Lonnie Zamora. Physical evidence included soil vitrification.",
    year: 1964,
    agencySlug: "fbi",
    status: "declassified",
    tags: ["socorro", "landing", "physical-evidence"],
    lat: 34.0584, lng: -106.8914
  },
  {
    title: "Washington D.C. Flyover Records (July 1952)",
    description: "Radar and visual confirmation of multiple objects over the White House and restricted airspace. Jets were unable to intercept.",
    year: 1952,
    agencySlug: "usaf",
    status: "declassified",
    tags: ["washington", "radar", "flyover"],
    lat: 38.8977, lng: -77.0365
  },
  {
    title: "Malmstrom AFB Missile Shutdown (1967)",
    description: "Report on the simultaneous shutdown of 10 Minuteman missiles while a glowing red object hovered over the launch site.",
    year: 1967,
    agencySlug: "dod",
    status: "classified",
    tags: ["malmstrom", "nuclear", "missile-shutdown"],
    lat: 47.5074, lng: -111.1822
  },
  {
    title: "Tehran 1976 F-4 Phantom Incident",
    description: "Iranian Air Force encounter where electronic systems failed during an attempt to fire on a UAP. Joint US-Iranian analysis follows.",
    year: 1976,
    agencySlug: "dia",
    status: "declassified",
    tags: ["tehran", "intercept", "electronic-warfare"],
    lat: 35.6892, lng: 51.3890
  },
  {
    title: "Belgium UFO Wave Radar Records (1990)",
    description: "Data from Belgian F-16 radar lock-ons on triangular objects exhibiting impossible acceleration (0 to 1800 km/h in seconds).",
    year: 1990,
    agencySlug: "dod",
    status: "declassified",
    tags: ["belgium", "triangle", "radar-lock"],
    lat: 50.8503, lng: 4.3517
  },
  {
    title: "Project Serpo: Logistics Briefing",
    description: "Alleged exchange program where 12 US personnel visited the planet Serpo in the Zeta Reticuli system. Status: HIGHLY SPECULATIVE.",
    year: 1965,
    agencySlug: "nsa",
    status: "classified",
    tags: ["serpo", "exchange", "zeta-reticuli"],
    lat: 32.3123, lng: -106.7783 // White Sands
  },
  {
    title: "Shag Harbour Incident Underwater Search",
    description: "Divers' reports of a 60-foot object that crashed into the harbor and was tracked moving underwater before disappearing.",
    year: 1967,
    agencySlug: "dod",
    status: "declassified",
    tags: ["shag-harbour", "underwater", "canada"],
    lat: 43.4833, lng: -65.7167
  },
  {
    title: "KGB Blue Folder: Anomalous Events",
    description: "A collection of declassified Soviet KGB files on UFO sightings and encounters by pilots and military personnel.",
    year: 1991,
    agencySlug: "dia",
    status: "declassified",
    tags: ["kgb", "soviet", "blue-folder"],
    lat: 55.7558, lng: 37.6173 // Moscow
  },
  {
    title: "Battle of Los Angeles (1942) Ordnance Report",
    description: "Post-action analysis of the over 1,400 anti-aircraft rounds fired at an unidentified object that hovered over LA for hours.",
    year: 1942,
    agencySlug: "dod",
    status: "declassified",
    tags: ["la-battle", "historical", "ordnance"],
    lat: 34.0522, lng: -118.2437
  },
  {
    title: "McMinnville Photo Analysis (Ruppelt 1950)",
    description: "Detailed analysis of the Trent family photos, considered by many to be among the most credible UFO photographs ever taken.",
    year: 1950,
    agencySlug: "usaf",
    status: "declassified",
    tags: ["mcminnville", "photo-analysis", "trent"],
    lat: 45.2101, lng: -123.1947
  },
  {
    title: "Skinwalker Ranch Telemetry: Gamma Bursts",
    description: "Monitoring data showing localized gamma ray spikes corresponding with 'hitchhiker' effect reports in Uintah Basin.",
    year: 2018,
    agencySlug: "dia",
    status: "classified",
    tags: ["skinwalker", "telemetry", "gamma-rays"],
    lat: 40.2589, lng: -110.0125
  },
  {
    title: "Admiral Byrd Highjump Diary Fragments",
    description: "Transcriptions of allegedly suppressed logs describing an entrance to an 'inner world' and encounters with advanced technology in Antarctica.",
    year: 1947,
    agencySlug: "dod",
    status: "classified",
    tags: ["highjump", "antarctica", "inner-world"],
    lat: -82.8628, lng: 135.0000
  },
  {
    title: "Project Pounce: Rapid Response Protocol",
    description: "Operational guidelines for the immediate containment and transport of crashed non-terrestrial assets.",
    year: 1953,
    agencySlug: "dod",
    status: "classified",
    tags: ["pounce", "crash-retrieval", "transport"],
    lat: 35.1107, lng: -106.6100 // Kirtland AFB
  },
  {
    title: "Project Monarch: Behavioral Modification",
    description: "Sensitive records of trauma-based conditioning protocols used in unacknowledged behavioral research programs.",
    year: 1962,
    agencySlug: "cia",
    status: "classified",
    tags: ["monarch", "behavioral", "trauma"],
    lat: 39.1158, lng: -76.7728
  },
  {
    title: "Project Stargate: Remote Viewing Protocol 14-B",
    description: "The finalized methodological guide for psychic reconnaissance of denied areas using double-blind coordinate systems.",
    year: 1978,
    agencySlug: "cia",
    status: "declassified",
    tags: ["stargate", "remote-viewing", "espionage"],
    lat: 39.1158, lng: -76.7728
  },
  {
    title: "The Condon Report: Final Evaluation",
    description: "The 1968 study which concluded that 'nothing has come from the study of UFOs that has added to scientific knowledge'. Controversial internals suggest bias.",
    year: 1968,
    agencySlug: "usaf",
    status: "declassified",
    tags: ["condon", "ufo", "university-study"],
    lat: 40.0150, lng: -105.2705
  }
];

async function main() {
  const agencies = await prisma.agency.findMany();
  const agencyMap = new Map(agencies.map(a => [a.slug, a.id]));

  console.log("--- NORMALIZING TAGS ---");
  // Normalize "blue-book" to "bluebook"
  await prisma.$executeRaw`UPDATE "Tag" SET name = 'bluebook' WHERE name = 'blue-book'`;
  await prisma.$executeRaw`UPDATE "Tag" SET name = 'sign' WHERE name = 'project-sign'`;

  console.log("--- SEEDING REAL DOCUMENTS ---");
  for (const doc of REAL_DOCS) {
    let agencyId = agencyMap.get(doc.agencySlug);
    if (!agencyId) agencyId = agencyMap.get("dod"); // Fallback

    const exists = await prisma.document.findFirst({ where: { title: doc.title } });
    if (exists) {
      console.log(`SKIP: ${doc.title} already exists`);
      continue;
    }

    await prisma.document.create({
      data: {
        title: doc.title,
        description: doc.description,
        year: doc.year,
        agencyId: agencyId!,
        status: doc.status,
        filePath: `/docs/${doc.title.replace(/\s+/g, '_').toLowerCase()}.pdf`,
        latitude: doc.lat,
        longitude: doc.lng,
        tags: {
          connectOrCreate: doc.tags.map(t => ({
            where: { name: t },
            create: { name: t }
          }))
        }
      }
    });
    console.log(`ADDED: ${doc.title}`);
  }

  console.log("--- SYNCING ANOMALIES (MAP ENRICHMENT) ---");
  // Add some specific anomalies for the map if not exists
  const anomalies = [
    { title: "Tic-Tac UAP Sighting", lat: 31.7, lng: -117.8, type: "Transmedium Craft" },
    { title: "Dulce Base Anomaly", lat: 36.9, lng: -106.9, type: "Subterranean Activity" },
    { title: "Skinwalker Ranch Portal", lat: 40.2, lng: -110.0, type: "Multi-dimensional" }
  ];

  for (const a of anomalies) {
    const exists = await prisma.anomaly.findFirst({ where: { title: a.title } });
    if (!exists) {
      await prisma.anomaly.create({
        data: {
          title: a.title,
          description: `Strategic monitoring of ${a.title}. Severity Level 5.`,
          date: "2024-04-30",
          latitude: a.lat,
          longitude: a.lng,
          status: "verified",
          objectType: a.type,
          severity: 5
        }
      });
      console.log(`ADDED ANOMALY: ${a.title}`);
    }
  }
}

main().finally(() => prisma.$disconnect());
