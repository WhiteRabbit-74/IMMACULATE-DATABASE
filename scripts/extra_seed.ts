import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📂 Injecting Extra Classified Intel...");

  const agencies = await prisma.agency.findMany();
  const getAgency = (slug: string) => agencies.find(a => a.slug === slug) || agencies[0];

  const extraDocs = [
    {
      title: "Malmstrom AFB UFO Incident — Minuteman Missile Shutdown",
      description: "March 1967 incident where Captain Robert Salas reported a glowing red disc over the Oscar Flight Launch Control Facility. Simultaneously, ten Minuteman missiles went into 'No-Go' status (disabled).",
      year: 1967,
      agencyId: getAgency("usaf").id,
      status: "declassified",
      tags: ["malmstrom", "missile", "disabling", "nuclear"],
      filePath: "https://www.cbsnews.com/news/ufo-military-nuclear-weapons-shutdown-robert-salas/",
      latitude: 47.507,
      longitude: -111.183,
      country: "USA"
    },
    {
      title: "Socorro UFO Landing — Officer Lonnie Zamora Report",
      description: "April 1964. Police officer Lonnie Zamora witnessed a white craft land in the desert. Two small beings in white coveralls were seen. The craft left scorched ground and landing gear impressions.",
      year: 1964,
      agencyId: getAgency("fbi").id,
      status: "declassified",
      tags: ["socorro", "zamora", "landing", "1964"],
      filePath: "https://www.archives.gov/research/military/air-force/ufos",
      latitude: 34.058,
      longitude: -106.892,
      country: "USA"
    },
    {
      title: "Minot AFB B-52 UFO Encounter — Radar-Visual Confirmation",
      description: "October 1968. A B-52 crew and ground radar tracked a massive UFO that pace the aircraft. Multiple security teams on the ground also witnessed the object near missile silos.",
      year: 1968,
      agencyId: getAgency("usaf").id,
      status: "declassified",
      tags: ["minot", "b52", "radar", "nuclear"],
      filePath: "https://www.minotb52ufo.com/",
      latitude: 48.415,
      longitude: -101.323,
      country: "USA"
    },
    {
      title: "Valensole UFO Encounter — Maurice Masse Testimony",
      description: "July 1965, France. A farmer witnessed a lavender-shaped craft land in his field. He was paralyzed by a small being. The soil at the landing site remained sterile for years.",
      year: 1965,
      agencyId: getAgency("mi6").id, // Using MI6 as proxy for European intel here
      status: "declassified",
      tags: ["valensole", "france", "paralysis", "landing"],
      filePath: "https://www.cnes-geipan.fr/",
      latitude: 43.833,
      longitude: 5.983,
      country: "France"
    },
    {
      title: "Shag Harbour UFO Incident — Underwater Recovery Attempt",
      description: "October 1967, Canada. A large object crashed into the waters of Shag Harbour. Witnesses saw lights on the water. RCAF and Navy divers found no debris, but radar tracked the object leaving the area underwater.",
      year: 1967,
      agencyId: getAgency("dod").id,
      status: "declassified",
      tags: ["shag-harbour", "canada", "crash", "underwater"],
      filePath: "https://www.bac-lac.gc.ca/eng/discover/unusual/ufo/Pages/default.aspx",
      latitude: 43.493,
      longitude: -65.711,
      country: "Canada"
    },
    {
      title: "Cash-Landrum Radiation Incident",
      description: "December 1980. Three witnesses encountered a diamond-shaped craft emitting intense heat. All suffered severe radiation poisoning symptoms. Military helicopters were seen escorting the object.",
      year: 1980,
      agencyId: getAgency("dia").id,
      status: "classified",
      tags: ["cash-landrum", "radiation", "injury", "helicopters"],
      filePath: "https://www.history.com/news/ufo-health-effects-radiation",
      latitude: 30.133,
      longitude: -95.033,
      country: "USA"
    },
    {
      title: "Colares UFO Wave — Operation Prato",
      description: "1977, Brazil. Citizens were attacked by light beams from 'chupas' (suckers). The Brazilian Air Force launched Operation Prato to investigate. Thousands of pages and photos were declassified in 2004.",
      year: 1977,
      agencyId: getAgency("dod").id,
      status: "declassified",
      tags: ["colares", "brazil", "operation-prato", "attacks"],
      filePath: "https://www.gov.br/en/government-of-brazil/",
      latitude: -0.933,
      longitude: -48.283,
      country: "Brazil"
    },
    {
      title: "Westall High School UFO Encounter",
      description: "April 1966, Australia. Over 200 students and teachers saw three metallic discs land in a nearby field. The craft then sped away. Witnesses claim military personnel arrived soon after and silenced the school.",
      year: 1966,
      agencyId: getAgency("mi6").id,
      status: "declassified",
      tags: ["westall", "australia", "school", "mass-sighting"],
      filePath: "https://www.naa.gov.au/learn/learning-resources/learning-resource-themes/society-and-culture/unexplained-phenomena/ufo-sightings-australia",
      latitude: -37.933,
      longitude: 145.133,
      country: "Australia"
    },
    {
      title: "Yukon Mothership Sighting — RCMP Report",
      description: "December 1996. Dozens of people reported a massive, city-sized craft with rows of lights moving silently over the Yukon Territory. Investigated by the RCMP.",
      year: 1996,
      agencyId: getAgency("dod").id,
      status: "declassified",
      tags: ["yukon", "canada", "mothership", "1996"],
      filePath: "https://www.cbc.ca/news/canada/north/yukon-ufo-1996-1.3916323",
      latitude: 63.633,
      longitude: -135.75,
      country: "Canada"
    },
    {
      title: "Varginha UFO Incident — 'The Brazilian Roswell'",
      description: "January 1996. Alleged crash of a UFO and capture of extraterrestrial entities by the Brazilian military. Witnesses described brown, oily-skinned beings with red eyes.",
      year: 1996,
      agencyId: getAgency("dia").id,
      status: "classified",
      tags: ["varginha", "brazil", "crash", "entities"],
      filePath: "https://www.gov.br/en/",
      latitude: -21.55,
      longitude: -45.433,
      country: "Brazil"
    }
  ];

  for (const doc of extraDocs) {
    const { tags, ...rest } = doc;
    await prisma.document.create({
      data: {
        ...rest,
        tags: {
          connectOrCreate: tags.map(name => ({
            where: { name },
            create: { name }
          }))
        }
      }
    });
  }

  console.log(`✅ Successfully added ${extraDocs.length} extra documents.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
