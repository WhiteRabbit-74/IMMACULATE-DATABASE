const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixOperations() {
  console.log('🏛️ Correcting project (Operation) data...');

  const projects = [
    {
      name: 'MONARCH',
      codename: 'Project Monarch',
      description: 'A highly classified sub-project of MKUltra focused on trauma-based mind control and behavioral modification. Utilizes psychological compartmentalization to create triggered personality states.',
      agency: 'CIA'
    },
    {
      name: 'GATEWAY',
      codename: 'Project Gateway',
      description: 'CIA assessment of the Monroe Institute\'s training for altered states of consciousness. Explores Hemi-Sync technology to achieve out-of-body experiences and non-linear temporal perception.',
      agency: 'CIA'
    },
    {
      name: 'BLUEBOOK',
      codename: 'Project Blue Book',
      description: 'The United States Air Force\'s systematic study of unidentified flying objects (UFOs) from 1947 to 1969. Documented over 12,000 sightings, leaving 701 as "unexplained."',
      agency: 'US Air Force'
    },
    {
      name: 'AQUARIUS',
      codename: 'Project Aquarius',
      description: 'A Top Secret program established to collect and coordinate all scientific, technological, and medical intelligence regarding Extraterrestrial Biological Entities (EBEs) and their craft.',
      agency: 'NSA / CIA'
    },
    {
      name: 'STARGATE',
      codename: 'Project Stargate',
      description: 'The umbrella term for the US Army/CIA unit established to investigate the potential for psychic phenomena in military and domestic intelligence applications, specifically Remote Viewing.',
      agency: 'DIA / CIA'
    }
  ];

  for (const p of projects) {
    await prisma.operation.upsert({
      where: { name: p.name },
      update: {
        codename: p.codename,
        description: p.description,
        agency: p.agency
      },
      create: {
        name: p.name,
        codename: p.codename,
        description: p.description,
        agency: p.agency
      }
    });
    console.log(`- Updated: ${p.name}`);
  }

  console.log('✅ Operations corrected.');
}

fixOperations();
