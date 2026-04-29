const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateDocs() {
  console.log('📝 Updating document synopses and titles...');

  const updates = [
    {
      filePath: '/media/PDF LIBRI/GATEWAY/CIA_Gateway_Analysis.pdf',
      title: 'Analysis and Assessment of Gateway Process (Main)',
      description: 'Official CIA assessment of the Monroe Institute\'s Gateway Experience — an altered states program using binaural beats. Studies consciousness as an energy system outside time-space.'
    },
    {
      filePath: '/media/PDF LIBRI/GATEWAY/Gateway_Analysis.pdf',
      title: 'Gateway Analysis — Technical Supplement',
      description: 'Detailed technical analysis of the Gateway Process, including brainwave synchronization and astral projection mechanics.'
    },
    {
      filePath: '/media/PDF LIBRI/MONARCH/Project_Monarch_Summary.pdf',
      title: 'Project Monarch — Executive Summary',
      description: 'Classified summary of Project Monarch, a sub-project of MKUltra focused on mind control through trauma-based dissociation and compartmentalization.'
    },
    {
      filePath: '/media/PDF LIBRI/MONARCH/Project_Monarch.pdf',
      title: 'Project Monarch — Operational Files v1',
      description: 'Operational records and methodology regarding behavioral modification and triggered personality states.'
    },
    {
      filePath: '/media/PDF LIBRI/BLUEBOOK/Bluebook_Final_Report.pdf',
      title: 'Project Blue Book — Final Report 1969',
      description: 'The Air Force\'s official investigation of UFO sightings from 1947 to 1969. Concluded that UFOs posed no national security threat, though 701 cases remained unexplained.'
    },
    {
      filePath: '/media/PDF LIBRI/SENZA PROGETTI/Roswell_Report.pdf',
      title: 'The Roswell Report: Fact vs. Fiction',
      description: 'Official USAF investigation into the 1947 Roswell incident, concluding the debris was from Project Mogul surveillance balloon. Released in 1994.'
    }
  ];

  for (const update of updates) {
    const doc = await prisma.document.findFirst({ where: { filePath: update.filePath } });
    if (doc) {
      await prisma.document.update({
        where: { id: doc.id },
        data: {
          title: update.title,
          description: update.description
        }
      });
      console.log(`- Updated: ${update.title}`);
    }
  }

  console.log('✅ Update complete.');
}

updateDocs();
