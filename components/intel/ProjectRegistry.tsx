"use client";

export type BlackProject = {
  id: string;
  name: string;
  codename: string;
  type: "UFO" | "BIO" | "TIME" | "MIND" | "PSYOP" | "SPACE";
  status: "ACTIVE" | "DECOMMISSIONED" | "UNKNOWN";
  clearance: "TOP SECRET" | "ULTRA TOP SECRET" | "COSMIC" | "UMBRA" | "MAJESTIC" | "READ AND DESTROY" | "BEYOND BLACK";
  history: { year: string; event: string; name: string }[];
  description: string;
  objective: string;
  lineage?: string; // e.g., "USAF_EVOLUTION"
  predecessor?: string; // id of previous project
  successor?: string; // id of next project
};

export const BLACK_PROJECTS: BlackProject[] = [
  // 30 HIGH-THEORY / UFO / SPACE-TIME (NO DUPLICATES FROM ARCHIVE)
  {
    id: "rainbow",
    name: "Project Rainbow",
    codename: "PHILADELPHIA EXPERIMENT",
    type: "TIME",
    status: "DECOMMISSIONED",
    clearance: "BEYOND BLACK",
    objective: "Optical and radar invisibility for naval assets.",
    description: "Alleged 1943 US Navy experiment using unified field theory to render the USS Eldridge invisible. Resulted in accidental teleportation and biological trauma to crew.",
    history: [
      { year: "1943", event: "Initial field tests at Philadelphia Naval Shipyard.", name: "ELD-1" },
      { year: "1943", event: "Second test results in 10-minute teleportation to Norfolk.", name: "RAINBOW_SYNC" }
    ]
  },
  {
    id: "montauk",
    name: "Project Montauk",
    codename: "PHOENIX III",
    type: "TIME",
    status: "UNKNOWN",
    clearance: "ULTRA TOP SECRET",
    objective: "Spacetime manipulation and psychological warfare.",
    description: "Series of secret projects conducted at Camp Hero, Long Island. Focused on time travel, remote viewing, and the creation of 'thought-form' entities.",
    history: [
      { year: "1970", event: "Establishment of the Montauk Chair interface.", name: "SENSORY_MAP" },
      { year: "1983", event: "Timeline fracture incident; Program allegedly terminated.", name: "AUGUST_GATE" }
    ]
  },
  {
    id: "highjump",
    name: "Operation Highjump",
    codename: "PROGRAM 68",
    type: "UFO",
    status: "DECOMMISSIONED",
    clearance: "TOP SECRET",
    objective: "Antarctic territorial establishment and threat assessment.",
    description: "Naval expedition led by Adm. Byrd. Officially for mapping; unofficially reported encounters with advanced disc-shaped craft in 'New Swabia'.",
    history: [
      { year: "1946", event: "Departure of 4,700 personnel to Antarctica.", name: "TF-68" },
      { year: "1947", event: "Early termination after heavy aircraft losses.", name: "RETREAT_ALPHA" }
    ]
  },
  {
    id: "looking-glass",
    name: "Project Looking Glass",
    codename: "LENS-V",
    type: "TIME",
    status: "ACTIVE",
    clearance: "BEYOND BLACK",
    objective: "Predictive intelligence via spacetime focal points.",
    description: "Technology utilizing gravity-distorting rings to 'see' through the veil of time. Used to identify convergence points in global timelines.",
    history: [
      { year: "1960", event: "Initial recovery of gravitational lens device at S4.", name: "LENS_INIT" },
      { year: "2012", event: "Identification of 'Resonance Gap' in future probabilities.", name: "TIMELINE_X" }
    ]
  },
  { id: "winterhaven", name: "Project Winterhaven", codename: "GRAVITY_NULL", type: "UFO", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Townsend Brown electrogravitics.", objective: "Fuel-less flight development.", history: [] },
  { id: "fishbowl", name: "Operation Fishbowl", codename: "ATMOS_TEST", type: "UFO", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "High-altitude nuclear UAP tests.", objective: "Reaction signature mapping.", history: [] },
  { id: "dark-star", name: "Operation Dark Star", codename: "STEALTH_UAV", type: "UFO", status: "ACTIVE", clearance: "ULTRA TOP SECRET", description: "Unacknowledged black UAVs.", objective: "Denial-based reconnaissance.", history: [] },
  { id: "orbital-shield", name: "Operation Orbital Shield", codename: "RODS_FROM_GOD", type: "SPACE", status: "ACTIVE", clearance: "ULTRA TOP SECRET", description: "Space-based weaponization.", objective: "Global kinetic strike capability.", history: [] },
  { id: "scanate", name: "Project Scanate", codename: "DEEP_EYE", type: "MIND", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Early psychic penetration.", objective: "Remote target mapping.", history: [] },
  { id: "artichoke", name: "Project Artichoke", codename: "HYPNO_KILL", type: "MIND", status: "DECOMMISSIONED", clearance: "ULTRA TOP SECRET", description: "Hypnotic behavioral control.", objective: "Asset automation.", history: [] },
  { id: "paperclip", name: "Operation Paperclip", codename: "OVERCAST", type: "PSYOP", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Nazi scientist integration.", objective: "Advanced tech acquisition.", history: [] },
  { id: "horizon", name: "Project Horizon", codename: "LUNAR_BASE", type: "SPACE", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Moon base plan (1959).", objective: "Lunar military presence.", history: [] },
  { id: "lunex", name: "Project Lunex", codename: "DEEP_CRATER", type: "SPACE", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "AF moon base alternative.", objective: "Lunar reconnaissance.", history: [] },
  { id: "orion", name: "Project Orion", codename: "NUCLEAR_PULSE", type: "SPACE", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Nuclear propulsion research.", objective: "Interstellar travel.", history: [] },
  { id: "mainbrace", name: "Operation Mainbrace", codename: "NATO_WAVE", type: "UFO", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "NATO fleet UFO sightings.", objective: "Readiness testing.", history: [] },
  { id: "magnet", name: "Project Magnet", codename: "GEO_FIELD", type: "UFO", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Canadian magnetic study.", objective: "UAP propulsion analysis.", history: [] },
  { id: "blue-beam", name: "Project Blue Beam", codename: "HOLOGRAM_X", type: "PSYOP", status: "ACTIVE", clearance: "READ AND DESTROY", description: "Holographic deception.", objective: "Global population control.", history: [] },
  { id: "aurora", name: "Project Aurora", codename: "SR-91", type: "UFO", status: "ACTIVE", clearance: "ULTRA TOP SECRET", description: "Hypersonic triangle tests.", objective: "Stealth reconnaissance.", history: [] },
  { id: "crossroads", name: "Operation Crossroads", codename: "BIKINI_LOG", type: "UFO", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "UAP at nuclear tests.", objective: "Signature collection.", history: [] },
  { id: "gaslight", name: "Project Gaslight", codename: "DISCREDIT", type: "PSYOP", status: "ACTIVE", clearance: "TOP SECRET", description: "Witness suppression.", objective: "Public denial maintenance.", history: [] },
  { id: "pluto", name: "Project Pluto", codename: "SLAM", type: "SPACE", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Nuclear ramjet research.", objective: "Mach 3 low-altitude flight.", history: [] },
  { id: "windmill", name: "Operation Windmill", codename: "ANTARCTIC_II", type: "SPACE", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Antarctic follow-up.", objective: "Resource mapping.", history: [] },
  { id: "excalibur", name: "Project Excalibur", codename: "DUMB_BUSTER", type: "SPACE", status: "ACTIVE", clearance: "ULTRA TOP SECRET", description: "Deep bunker penetration.", objective: "Underground facility neutralization.", history: [] },
  { id: "argus", name: "Operation Argus", codename: "EM_PULSE", type: "SPACE", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Upper atmosphere tests.", objective: "Van Allen belt mapping.", history: [] },
  { id: "gleem-v2", name: "Project Gleem V2", codename: "EYE_IN_SKY", type: "UFO", status: "ACTIVE", clearance: "BEYOND BLACK", description: "Next-gen orbital UAP tracking.", objective: "Interstellar gate monitoring.", history: [] },

  // 10 COVERT / BIO
  { id: "sea-spray", name: "Operation Sea Spray", codename: "SF_BIO", type: "BIO", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "San Francisco bio-dispersal.", objective: "Population vulnerability test.", history: [] },
  { id: "mk-ultra-v2", name: "Project MK-Ultra-X", codename: "MIND_HACK", type: "MIND", status: "ACTIVE", clearance: "BEYOND BLACK", description: "Evolved behavioral control.", objective: "Human automation.", history: [] },
  { id: "lac", name: "Operation LAC", codename: "LARGE_AREA", type: "BIO", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Regional bio-simulant dispersal.", objective: "Dispersion mapping.", history: [] },
  { id: "shad", name: "Project SHAD", codename: "SHIP_HAZARD", type: "BIO", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Naval chemical tests.", objective: "Crew defense analysis.", history: [] },
  { id: "big-itch", name: "Operation Big Itch", codename: "FLEA_WAR", type: "BIO", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Insect vector tests.", objective: "Biological delivery methods.", history: [] },
  { id: "dew", name: "Operation Dew", codename: "TRACE_DUST", type: "BIO", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Dust dispersal tests.", objective: "Atmospheric tracking.", history: [] },
  { id: "bluebird", name: "Project Bluebird", codename: "TRUTH_SERUM", type: "MIND", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Early interrogation research.", objective: "Forced confession tech.", history: [] },
  { id: "midnight-climax", name: "Operation Midnight Climax", codename: "LSD_VAULT", type: "MIND", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Field testing psychotropics.", objective: "Social engineering.", history: [] },
  { id: "whitecoat", name: "Operation Whitecoat", codename: "BIO_DEFENSE", type: "BIO", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Human bio-testing.", objective: "Treatment development.", history: [] },
  { id: "popeye", name: "Operation Popeye", codename: "RAIN_MAKER", type: "PSYOP", status: "DECOMMISSIONED", clearance: "TOP SECRET", description: "Weather warfare.", objective: "Extended monsoon season.", history: [] },

  // THE NEW 5 DEEP-BLACK OPERATIONS
  { 
    id: "trident", 
    name: "Project TRIDENT", 
    codename: "USO_RECOVERY", 
    type: "UFO", 
    status: "ACTIVE", 
    clearance: "BEYOND BLACK", 
    description: "Naval operations for the recovery and tracking of Unidentified Submerged Objects (USOs) exhibiting trans-medium travel capabilities.", 
    objective: "Capture and reverse-engineer trans-medium propulsion systems.", 
    history: [
      { year: "1968", event: "USS Scorpion incident correlated with deep-sea anomalies.", name: "VANGUARD_1" },
      { year: "1974", event: "Deployment of specialized deep-ocean acoustic arrays.", name: "SOUND_BARRIER" }
    ] 
  },
  { 
    id: "chronos", 
    name: "Project CHRONOS", 
    codename: "TIME_SLIP", 
    type: "TIME", 
    status: "ACTIVE", 
    clearance: "READ AND DESTROY", 
    description: "Advanced quantum physics program focused on temporal manipulation and reverse-engineering of distortion drives found in crash debris.", 
    objective: "Mastery of closed timelike curves and localized time dilation.", 
    history: [
      { year: "1982", event: "Initial quantum entanglement synchronization anomaly.", name: "PHASE_SHIFT" },
      { year: "1991", event: "Unexplained micro-second discontinuity observed in particle accelerator.", name: "VOID_TICK" }
    ] 
  },
  { 
    id: "silver-bug", 
    name: "Project SILVER BUG", 
    codename: "FLAT_TIE", 
    type: "UFO", 
    status: "DECOMMISSIONED", 
    clearance: "TOP SECRET", 
    description: "USAF declassified program (originally classified) dedicated to the development of VTOL disc-shaped aircraft based on captured schematics.", 
    objective: "Create a terrestrial disc craft capable of hypersonic flight.", 
    history: [
      { year: "1955", event: "Avro Canada secret contract initiation.", name: "AVRO_ALPHA" },
      { year: "1961", event: "Program officially cancelled due to instability, moved black.", name: "WINTER_CHILL" }
    ] 
  },
  { 
    id: "sleeping-beauty", 
    name: "Project SLEEPING BEAUTY", 
    codename: "MIND_LINK", 
    type: "MIND", 
    status: "UNKNOWN", 
    clearance: "ULTRA TOP SECRET", 
    description: "Classified DoD study on electromagnetic manipulation of the central nervous system to alter behavior and facilitate telepathic bridging.", 
    objective: "Weaponization of targeted electromagnetic fields on human subjects.", 
    history: [
      { year: "1981", event: "Testing microwave auditory effects on non-consenting subjects.", name: "VOICE_TO_SKULL" },
      { year: "1988", event: "Integration with NHI telepathic interface hardware.", name: "SYNAPSE_BRIDGE" }
    ] 
  },
  { 
    id: "gossamer", 
    name: "Project GOSSAMER", 
    codename: "OPTICAL_STEALTH", 
    type: "UFO", 
    status: "ACTIVE", 
    clearance: "MAJESTIC", 
    description: "Development and testing of metamaterial skins for optical invisibility and total radar cross-section elimination.", 
    objective: "Achieve 100% multispectral cloaking for next-generation aerospace craft.", 
    history: [
      { year: "1994", event: "First successful deployment of adaptive meta-skin on drone testbed.", name: "SHADOW_FLIGHT" },
      { year: "2004", event: "Tic-Tac incident demonstrates superior NHI optical camouflage.", name: "NIMITZ_ECHO" }
    ] 
  },
  { 
    id: "sign", 
    name: "Project SIGN", 
    codename: "PROJECT_SIGN", 
    type: "UFO", 
    status: "DECOMMISSIONED", 
    clearance: "TOP SECRET", 
    description: "The first official USAF study of UFOs. Originally recommended an extraterrestrial origin for the objects (Estimate of the Situation), which was rejected by higher command.", 
    objective: "Determine if UFOs were a threat to national security.", 
    lineage: "USAF_EVOLUTION",
    successor: "grudge",
    history: [
      { year: "1947", event: "Establishment of the program at Wright-Patterson AFB.", name: "SIGN_START" },
      { year: "1948", event: "The controversial 'Estimate of the Situation' document is produced.", name: "ESTIMATE_SIT" }
    ] 
  },
  { 
    id: "grudge", 
    name: "Project GRUDGE", 
    codename: "PROJECT_GRUDGE", 
    type: "PSYOP", 
    status: "DECOMMISSIONED", 
    clearance: "TOP SECRET", 
    description: "Successor to Project Sign. Notorious for its dismissive attitude towards UFO sightings, often reducing complex cases to weather balloons or mass hysteria.", 
    objective: "Alleviate public anxiety and debunk UFO sightings.", 
    lineage: "USAF_EVOLUTION",
    predecessor: "sign",
    successor: "bluebook",
    history: [
      { year: "1949", event: "Transition from Sign to Grudge; implementation of debunking protocols.", name: "GRUDGE_INIT" },
      { year: "1951", event: "Captain Edward J. Ruppelt takes over, leading to the Blue Book transition.", name: "RUPPELT_REFORM" }
    ] 
  },
  { 
    id: "bluebook", 
    name: "Project BLUE BOOK", 
    codename: "BLUE_BOOK", 
    type: "UFO", 
    status: "DECOMMISSIONED", 
    clearance: "TOP SECRET", 
    description: "The most famous and longest-running USAF UFO study. Analyzed 12,618 sightings, leaving 701 as 'unidentified'.", 
    objective: "Scientific analysis of UFO data and identification of potential threats.", 
    lineage: "USAF_EVOLUTION",
    predecessor: "grudge",
    history: [
      { year: "1952", event: "Project Blue Book officially succeeds Project Grudge.", name: "BLUEBOOK_START" },
      { year: "1969", event: "Termination of the program following the Condon Report findings.", name: "CONDON_END" }
    ] 
  },
  { 
    id: "aquarius", 
    name: "Project AQUARIUS", 
    codename: "PROGRAM_P4", 
    type: "UFO", 
    status: "ACTIVE", 
    clearance: "MAJESTIC", 
    description: "Umbrella project for the MJ-12 group focusing on EBE communication and biological research.", 
    objective: "Establish diplomatic and scientific communication with non-human entities.", 
    lineage: "MJ12_NEXUS",
    predecessor: "gleem",
    successor: "pounce",
    history: [
      { year: "1953", event: "Program initiated as a follow-up to Project Gleem.", name: "AQUARIUS_INIT" },
      { year: "1966", event: "Establishment of the first communication protocols with EBE-2.", name: "CONTACT_SYNC" }
    ] 
  },
  { 
    id: "stargate", 
    name: "Project STARGATE", 
    codename: "GRILL_FLAME", 
    type: "MIND", 
    status: "DECOMMISSIONED", 
    clearance: "ULTRA TOP SECRET", 
    description: "Army and CIA program investigating remote viewing and psychic phenomena for military intelligence.", 
    objective: "Utilize anomalous mental phenomena for reconnaissance of high-value targets.", 
    history: [
      { year: "1978", event: "Project initiated at Fort Meade by SRI International.", name: "REMOTE_ALPHA" },
      { year: "1995", event: "Program transferred to CIA and officially terminated.", name: "STG_END" }
    ] 
  },
  { 
    id: "moon-dust", 
    name: "Operation MOON DUST", 
    codename: "FIELD_RECOVERY", 
    type: "UFO", 
    status: "ACTIVE", 
    clearance: "TOP SECRET", 
    description: "Specialized unit tasked with the rapid recovery of foreign and non-human aerospace debris globally.", 
    objective: "Locate and secure crash material before third-party detection.", 
    history: [
      { year: "1953", event: "Creation of the specialized recovery teams under USAF.", name: "DUST_START" },
      { year: "1965", event: "Significant recovery incident in the Kecksburg region.", name: "KECKS_FALL" }
    ] 
  },
  { 
    id: "pounce", 
    name: "Project POUNCE", 
    codename: "TECH_STRIP", 
    type: "UFO", 
    status: "ACTIVE", 
    clearance: "MAJESTIC", 
    description: "Parallel program to Aquarius focusing specifically on the reverse-engineering of propulsion and energy systems.", 
    objective: "Replicate anti-gravitational drive systems for terrestrial use.", 
    lineage: "MJ12_NEXUS",
    predecessor: "aquarius",
    history: [
      { year: "1947", event: "Initiated immediately following the Roswell recovery.", name: "POUNCE_INIT" },
      { year: "1959", event: "Breakthrough in electro-gravitic field stabilization.", name: "GRAV_LENS" }
    ] 
  },
  { 
    id: "gleem", 
    name: "Project GLEEM", 
    codename: "ORBITAL_EYE", 
    type: "SPACE", 
    status: "ACTIVE", 
    clearance: "BEYOND BLACK", 
    description: "Deep space and orbital surveillance system designed to detect incoming NHI craft signatures.", 
    objective: "Provide early warning and spectral tracking of non-terrestrial assets.", 
    lineage: "MJ12_NEXUS",
    successor: "aquarius",
    history: [
      { year: "1953", event: "Initial satellite deployment for infrared anomaly detection.", name: "GLEEM_SYNC" },
      { year: "2010", event: "Upgrade to quantum sensor arrays in LEO.", name: "EYE_V3" }
    ] 
  },
  { 
    id: "condign", 
    name: "Project CONDIGN", 
    codename: "UK_UAP_STUDY", 
    type: "UFO", 
    status: "DECOMMISSIONED", 
    clearance: "TOP SECRET", 
    description: "UK Ministry of Defence study on Unidentified Aerial Phenomena (UAP) in the UK Air Defence Region.", 
    objective: "Assess the potential threat of UAP to UK military operations.", 
    history: [
      { year: "1997", event: "Study commissioned by DI55 of the MoD.", name: "CONDIGN_INIT" },
      { year: "2000", event: "Final report concludes UAP are 'plasma-like' phenomena.", name: "PLASMA_FIND" }
    ] 
  },
  { 
    id: "magnet", 
    name: "Project MAGNET", 
    codename: "GEO_ANOMALY", 
    type: "UFO", 
    status: "DECOMMISSIONED", 
    clearance: "TOP SECRET", 
    description: "Canadian Department of Transport program to study UFOs and magnetic anomalies.", 
    objective: "Verify if UFOs utilize magnetic fields for propulsion.", 
    history: [
      { year: "1950", event: "Project established by Wilbert B. Smith.", name: "MAGNET_START" },
      { year: "1954", event: "Closure of the official project, continued as 'Second Story'.", name: "MAGNET_END" }
    ] 
  },
  { 
    id: "second-story", 
    name: "Project SECOND STORY", 
    codename: "RADAR_GHOST", 
    type: "UFO", 
    status: "DECOMMISSIONED", 
    clearance: "TOP SECRET", 
    description: "Canadian follow-up to Project Magnet, focusing on radar and visual correlation of UFO sightings.", 
    objective: "Collect and analyze multi-sensor UFO data.", 
    history: [
      { year: "1952", event: "Transition from Project Magnet to Second Story.", name: "2ND_STORY_INIT" }
    ] 
  },
  { 
    id: "horizon", 
    name: "Project HORIZON", 
    codename: "LUNAR_OUTPOST", 
    type: "SPACE", 
    status: "DECOMMISSIONED", 
    clearance: "TOP SECRET", 
    description: "US Army plan to establish a manned, fortified lunar outpost by 1967.", 
    objective: "Establish military lunar supremacy and monitor orbital traffic.", 
    history: [
      { year: "1959", event: "Initial proposal submitted to the Department of the Army.", name: "HORIZON_PROP" }
    ] 
  },
  { 
    id: "aatip", 
    name: "AATIP", 
    codename: "AAWSAP", 
    type: "UFO", 
    status: "ACTIVE", 
    clearance: "TOP SECRET", 
    description: "Advanced Aerospace Threat Identification Program. Modern Pentagon study of UAPs (The Elizondo era).", 
    objective: "Investigate unusual aerial phenomena and their technological implications.", 
    history: [
      { year: "2007", event: "Program initiated with Senate funding (Harry Reid).", name: "AATIP_INIT" },
      { year: "2017", event: "Public disclosure of the program via NYT.", name: "NYT_REVEAL" }
    ] 
  }
];
