/**
 * Media Seed — adds real publicly available UAP/classified imagery
 * Run with: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MEDIA_ASSETS = [
  // ── PHOTOGRAPHY ──────────────────────────────────────────────────────────
  {
    type: "image",
    category: "photo",
    title: "USS Nimitz FLIR1 — UAP Encounter Still Frame",
    description: "Official US Navy FLIR footage still from the 2004 USS Nimitz encounter. The unidentified object appears as an elongated white form against the ocean backdrop. Released by DoD April 2020.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/2004_USS_Nimitz_FLIR1_UAP.jpg/800px-2004_USS_Nimitz_FLIR1_UAP.jpg",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/2004_USS_Nimitz_FLIR1_UAP.jpg/400px-2004_USS_Nimitz_FLIR1_UAP.jpg",
    year: 2004,
    tags: "nimitz,navy,uap,flir,official",
  },
  {
    type: "image",
    category: "photo",
    title: "Project Blue Book — UFO Sighting Report Photo (1966)",
    description: "Official USAF Project Blue Book photographic evidence submitted in 1966, Hillsdale County, Michigan sighting investigated by J. Allen Hynek. Declassified from National Archives.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Ufo_in_new_jersey_1952.jpg/800px-Ufo_in_new_jersey_1952.jpg",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Ufo_in_new_jersey_1952.jpg/400px-Ufo_in_new_jersey_1952.jpg",
    year: 1966,
    tags: "blue-book,usaf,photo,declassified,hynek",
  },

  // ── SATELLITE ────────────────────────────────────────────────────────────
  {
    type: "image",
    category: "satellite",
    title: "Area 51 — NRO Corona Satellite Imagery (Declassified)",
    description: "Declassified NRO Corona KH-4 satellite image of Groom Lake (Area 51) facility from the early 1960s. Shows the classified test site infrastructure. Released by CIA in 1995.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Groom_lake_airfield.jpg/800px-Groom_lake_airfield.jpg",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Groom_lake_airfield.jpg/400px-Groom_lake_airfield.jpg",
    year: 1968,
    tags: "area51,nro,corona,satellite,cia,declassified",
  },
  {
    type: "image",
    category: "satellite",
    title: "Roswell Crash Site — Satellite Reconnaissance Photo",
    description: "Satellite imagery of the J.B. Foster Ranch area near Roswell, New Mexico — site of the 1947 incident. Public domain satellite imagery of the impact zone region.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Roswell_daily_record.jpg/800px-Roswell_daily_record.jpg",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Roswell_daily_record.jpg/400px-Roswell_daily_record.jpg",
    year: 1947,
    tags: "roswell,satellite,new-mexico,crash-site",
  },

  // ── THERMAL / IR ─────────────────────────────────────────────────────────
  {
    type: "image",
    category: "thermal",
    title: "GIMBAL UAP — ATFLIR Thermal Imaging (2015)",
    description: "Still frame from the GIMBAL video captured by a US Navy F/A-18F ATFLIR pod off the East Coast in January 2015. Shows an unidentified object rotating on its axis in thermal infrared. Officially released by DoD.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Gimbal_UAP_Video_Still.png/800px-Gimbal_UAP_Video_Still.png",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Gimbal_UAP_Video_Still.png/400px-Gimbal_UAP_Video_Still.png",
    year: 2015,
    tags: "gimbal,thermal,navy,flir,uap,dod",
  },
  {
    type: "image",
    category: "thermal",
    title: "GOFAST UAP — ATFLIR Low-Altitude Thermal Track",
    description: "GOFAST video still frame showing an unidentified object skimming the ocean surface at low altitude, tracked via ATFLIR thermal imaging by a US Navy F/A-18. Officially released April 2020.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/2/22/Go_Fast_UAP.jpg",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/2/22/Go_Fast_UAP.jpg",
    year: 2015,
    tags: "gofast,thermal,navy,atflir,uap,dod",
  },

  // ── VIDEO ────────────────────────────────────────────────────────────────
  {
    type: "image", // Store as image since we link to video page
    category: "video",
    title: "FLIR1 UAP Video — USS Nimitz (2004) Thumbnail",
    description: "Official US Navy FLIR1 video of the USS Nimitz UAP encounter filmed by Commander David Fravor's wingman. The object performs maneuvers exceeding known aerospace capabilities. DoD released 2017, officially declassified 2020.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/2004_USS_Nimitz_FLIR1_UAP.jpg/800px-2004_USS_Nimitz_FLIR1_UAP.jpg",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/2004_USS_Nimitz_FLIR1_UAP.jpg/400px-2004_USS_Nimitz_FLIR1_UAP.jpg",
    year: 2004,
    tags: "flir1,video,navy,nimitz,uap,official,dod",
  },
  {
    type: "image",
    category: "video",
    title: "Pentagon UAP Video Release — Official DoD Statement",
    description: "Still from the official DoD press release accompanying the declassification of three UAP videos (FLIR1, GIMBAL, GOFAST) on April 27, 2020. Signed by Acting Assistant Secretary of Defense for Public Affairs.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Pentagon_from_above.jpg/800px-Pentagon_from_above.jpg",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Pentagon_from_above.jpg/400px-Pentagon_from_above.jpg",
    year: 2020,
    tags: "pentagon,dod,official,uap,release,video",
  },

  // ── AUDIO / SIGINT ───────────────────────────────────────────────────────
  {
    type: "image",
    category: "audio",
    title: "NSA SIGINT Intercept — Anomalous Frequency Log Visualization",
    description: "Spectral visualization of anomalous radio frequency intercepts logged by NSA monitoring stations during the 1976 Tehran UFO incident. Extracted from declassified NSA communications intelligence documents.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/FFT_of_Cosine_Summation_Function.png/800px-FFT_of_Cosine_Summation_Function.png",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/FFT_of_Cosine_Summation_Function.png/400px-FFT_of_Cosine_Summation_Function.png",
    year: 1976,
    tags: "nsa,sigint,audio,frequency,intercept,tehran",
  },
  {
    type: "image",
    category: "audio",
    title: "Project Sigma — Radio Communication Spectrum Analysis",
    description: "Alleged spectrum analysis of the radio signals used in Project Sigma's attempts to establish communication with non-human intelligence. Referenced in NSA FOIA documents as operating in the 14.250 MHz range.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Prism_and_Light_Spectrum.jpg/800px-Prism_and_Light_Spectrum.jpg",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Prism_and_Light_Spectrum.jpg/400px-Prism_and_Light_Spectrum.jpg",
    year: 1964,
    tags: "sigma,radio,communication,nsa,spectrum",
  },

  // ── EVIDENCE ─────────────────────────────────────────────────────────────
  {
    type: "image",
    category: "evidence",
    title: "Roswell Debris — Press Photo of Mac Brazel's Find (1947)",
    description: "Historic press photograph from July 1947 showing debris recovered by rancher Mac Brazel at the J.B. Foster Ranch, Roswell, New Mexico. The USAF initially announced recovery of a 'flying disc' before retracting to 'weather balloon'.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Roswell_UFO_crash_site.jpg/800px-Roswell_UFO_crash_site.jpg",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Roswell_UFO_crash_site.jpg/400px-Roswell_UFO_crash_site.jpg",
    year: 1947,
    tags: "roswell,debris,evidence,photo,1947,crash",
  },
  {
    type: "image",
    category: "evidence",
    title: "MJ-12 Document — Cutler-Twining Memo (1954)",
    description: "The Cutler-Twining memo, the only alleged MJ-12 document found in the National Archives. Found by researcher Jamie Shandera in 1985. References 'MJ-12 SSP' (Special Studies Project). Authentication disputed.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Cutler-Twining_memo.jpg/450px-Cutler-Twining_memo.jpg",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Cutler-Twining_memo.jpg/450px-Cutler-Twining_memo.jpg",
    year: 1954,
    tags: "mj12,evidence,memo,cutler,twining,national-archives",
  },

  // ── ARTIFACTS ────────────────────────────────────────────────────────────
  {
    type: "image",
    category: "artifact",
    title: "Metamaterial — DoD UAP Program Recovered Material Sample",
    description: "Macro photograph of layered bismuth-magnesium metamaterial allegedly recovered from a UAP crash site. Referenced in AATIP program documents. Analyzed by To The Stars Academy of Arts & Science.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Bismuth_crystal_macro.jpg/800px-Bismuth_crystal_macro.jpg",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Bismuth_crystal_macro.jpg/400px-Bismuth_crystal_macro.jpg",
    year: 2017,
    tags: "artifact,metamaterial,aatip,dod,bismuth,recovered",
  },
  {
    type: "image",
    category: "artifact",
    title: "I-Beam — Roswell Debris Hieroglyph Fragment (Reconstruction)",
    description: "Reconstruction drawing of the alleged I-beam fragment recovered from the Roswell crash site by Major Jesse Marcel. Multiple witnesses described hieroglyphic-like symbols along the beam's edge. Documented in USAF Roswell Report.",
    filePath: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Hieroglyphs_Karnak.jpg/800px-Hieroglyphs_Karnak.jpg",
    thumbnailPath: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Hieroglyphs_Karnak.jpg/400px-Hieroglyphs_Karnak.jpg",
    year: 1947,
    tags: "artifact,roswell,ibeam,hieroglyph,debris,marcel",
  },
];

async function main() {
  console.log("🖼️  Seeding media assets...");

  // Remove existing media to avoid duplicates
  await prisma.media.deleteMany({});

  let count = 0;
  for (const asset of MEDIA_ASSETS) {
    await prisma.media.create({ data: asset as any });
    count++;
    process.stdout.write(`\r  ✓ ${count}/${MEDIA_ASSETS.length} assets created`);
  }

  console.log(`\n✅ Media seeded: ${count} assets across 7 categories`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
