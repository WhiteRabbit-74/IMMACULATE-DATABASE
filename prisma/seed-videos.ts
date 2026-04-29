import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const videos = [
    {
      title: "GIMBAL Incident",
      category: "video",
      type: "video",
      description: "Video of a U.S. Navy F/A-18 jet crew’s encounter with an unexplained anomalous phenomena (UAP). Captured by Raytheon AN/ASQ-228 ATFLIR pod. Shows a disc-shaped craft rotating against the wind.",
      filePath: "/media/video/VIDEO PENTAGONO/2 - GIMBAL.mp4.mp4",
      sensor: "ATFLIR (Infrared)",
      source: "USS Theodore Roosevelt (CVN-71)",
      year: 2015,
      tags: "navy, gimbal, infrared, aaro",
      country: "International Waters"
    },
    {
      title: "GOFAST Incident",
      category: "video",
      type: "video",
      description: "Forward-Looking Infrared video footage of an unidentified object recorded by the aircrew of a U.S. Navy F/A-18F in 2015. AARO assesses with high confidence that the objects did not demonstrate anomalous speeds or flight behaviors.",
      filePath: "/media/video/VIDEO PENTAGONO/3 - GOFAST.mp4",
      sensor: "ATFLIR (Infrared)",
      source: "USS Theodore Roosevelt (CVN-71)",
      year: 2015,
      tags: "navy, gofast, infrared, aaro",
      country: "International Waters"
    },
    {
      title: "Al Taqaddum Object",
      category: "video",
      type: "video",
      description: "In October 2017, an infrared sensor onboard a force protection aerostat near Al Taqaddum Air Base, Iraq, captured 17 minutes of video of an unidentified object. AARO assesses that the object was a cluster of partially and fully inflated balloons. AARO assesses that the object did not demonstrate anomalous performance characteristics.",
      filePath: "/media/video/VIDEO PENTAGONO/Al Taqaddum Object.mp4",
      sensor: "Aerostat IR Sensor",
      source: "US Air Force",
      year: 2017,
      tags: "iraq, aerostat, balloons, aaro",
      country: "Iraq"
    },
    {
      title: "FLIR1 (Tic Tac)",
      category: "video",
      type: "video",
      description: "Forward Looking Infrared - Video of a U.S. Navy F/A-18 jet crew’s encounter with an unexplained anomalous phenomena (UAP). The original 2004 Nimitz encounter video.",
      filePath: "/media/video/VIDEO PENTAGONO/flir1.mp4",
      sensor: "ATFLIR",
      source: "USS Nimitz (CVN-68)",
      year: 2004,
      tags: "nimitz, tictac, fravor, navy",
      country: "Pacific Ocean"
    },
    {
      title: "Middle East Object (Metallic Sphere)",
      category: "video",
      type: "video",
      description: "This clip was taken by an MQ-9 in the Middle East, and while AARO assesses the object in the clip is not exhibiting anomalous behavior, the object remains unidentified.",
      filePath: "/media/video/VIDEO PENTAGONO/Middle East Object.mp4",
      sensor: "MQ-9 Reaper",
      source: "AARO / DoD",
      year: 2022,
      tags: "middle east, sphere, drone",
      country: "Middle East"
    },
    {
      title: "Middle East Red Balloon 2024",
      category: "video",
      type: "video",
      description: "The recording likely depicts a slow-moving spheroidal object. AARO assesses, with high confidence, that the object depicted in the video is almost certainly (≥95% likelihood) a consumer-grade reflective foil balloon. Based on behavioral correlation with recorded wind speed and direction.",
      filePath: "/media/video/VIDEO PENTAGONO/Middle East Red Balloon 2024.mp4",
      sensor: "U.S. military platform camera",
      source: "US Military",
      year: 2024,
      tags: "2024, balloon, middle east",
      country: "Middle East"
    },
    {
      title: "Mt. Etna Object",
      category: "video",
      type: "video",
      description: "In December 2018, a forward-looking infrared video sensor aboard an uncrewed U.S. Air Force platform captured this footage. AARO assesses with moderate confidence that the footage depicts a balloon approximately 170 kilometers from the caldera traveling at wind speed and direction. Optical effects from intense atmospheric conditions near the volcano distorted the video.",
      filePath: "/media/video/VIDEO PENTAGONO/Mt. Etna Object.mp4",
      sensor: "MQ-9 Reaper (FLIR)",
      source: "USAF",
      year: 2018,
      tags: "italy, volcano, etna, balloon",
      country: "Italy"
    },
    {
      title: "Navy 2021 Flyby",
      category: "video",
      type: "video",
      description: "This video, captured by the pilot in the cockpit of a Navy fighter jet, demonstrates the typical speed at which military aircraft may approach an unknown object.",
      filePath: "/media/video/VIDEO PENTAGONO/Navy 2021 Flyby video.mp4",
      sensor: "Cockpit Camera",
      source: "US Navy",
      year: 2021,
      tags: "flyby, navy, cockpit",
      country: "USA"
    },
    {
      title: "Aguadilla Incident (Puerto Rico)",
      category: "video",
      type: "video",
      description: "On April 26, 2013, an infrared sensor onboard a U.S. Customs and Border Protection aircraft captured footage of a UAP event over Aguadilla, Puerto Rico. AARO assesses with high confidence that the video depicts two objects traveling near each other rather than a single object splitting into two. Reconstruction demonstrates the objects traveled in a straight line at wind speed and did not enter the water.",
      filePath: "/media/video/VIDEO PENTAGONO/Puerto Rico Objects.mp4",
      sensor: "Wescam MX-15 (Infrared)",
      source: "DHS / CBP",
      year: 2013,
      tags: "aguadilla, puerto rico, aaro",
      country: "Puerto Rico"
    },
    {
      title: "Atmospheric Wake - South Asian Object (Sensor #1)",
      category: "video",
      type: "video",
      description: "An MQ-9 forward-looking infrared video sensor captured this footage in South Asia. AARO assesses that the object likely is a commercial aircraft and that the trailing cavitation is a sensor artifact resultant of video compression.",
      filePath: "/media/video/VIDEO PENTAGONO/South Asian Object 1.mp4",
      sensor: "MQ-9 Reaper (FLIR)",
      source: "USAF",
      year: 2023,
      tags: "south asia, wake, artifact",
      country: "South Asia"
    },
    {
      title: "Atmospheric Wake - South Asian Object (Sensor #2)",
      category: "video",
      type: "video",
      description: "An MQ-9 forward-looking infrared video sensor captured this footage in South Asia. AARO assesses that the object likely is a commercial aircraft and that the trailing cavitation is a sensor artifact resultant of video compression.",
      filePath: "/media/video/VIDEO PENTAGONO/South Asian Object 2.mp4",
      sensor: "MQ-9 Reaper (FLIR)",
      source: "USAF",
      year: 2023,
      tags: "south asia, wake, artifact",
      country: "South Asia"
    },
    {
      title: "Unresolved UAP Report: Middle East 2023",
      category: "video",
      type: "video",
      description: "Footage from an infrared sensor aboard a U.S. military platform. Depicts an apparent thermal contrast within the sensor’s field of view. AARO cannot determine whether the observed signature represents a sensor artifact or a thermal emission or reflection from a physical source. The available data does not support a conclusive analytic evaluation.",
      filePath: "/media/video/VIDEO PENTAGONO/Unresolved UAP Report Middle East 2023.mp4",
      sensor: "Military IR Sensor",
      source: "US Military",
      year: 2023,
      tags: "middle east, unresolved, 2023",
      country: "Middle East"
    },
    {
      title: "Unresolved UAP Report: Middle East 2024",
      category: "video",
      type: "video",
      description: "Footage from an infrared sensor aboard a U.S. military platform. Depicts an apparent thermal contrast. Due to the absence of corroborating telemetry or multi-modal sensor data, AARO cannot determine whether the observed signature represents a sensor artifact or a thermal emission. The available data does not support a conclusive analytic evaluation.",
      filePath: "/media/video/VIDEO PENTAGONO/Unresolved UAP Report Middle East 2024.mp4",
      sensor: "Military IR Sensor",
      source: "US Military",
      year: 2024,
      tags: "middle east, unresolved, 2024",
      country: "Middle East"
    },
    {
      title: "Western U.S. Objects",
      category: "video",
      type: "video",
      description: "Analysis of the full motion video, combined with commercial flight data, led AARO to assess that the objects were three separate commercial aircraft flying at a great distance from the infrared sensor. Seen as small dots due to their significant distance.",
      filePath: "/media/video/VIDEO PENTAGONO/Western U.S. Objects.mp4",
      sensor: "Long-range IR",
      source: "NORAD / AARO",
      year: 2023,
      tags: "usa, west, commercial aircraft",
      country: "USA"
    },
    {
      title: "Africa 2022 - PR-001",
      category: "video",
      type: "video",
      description: "Unresolved UAP report from Africa region. Object exhibits inconsistent flight characteristics.",
      filePath: "/media/video/VIDEO PENTAGONO/PR-001 Unresolved UAP Report, Africa 2022.mp4",
      sensor: "Military Grade EO",
      source: "AFRICOM",
      year: 2022,
      tags: "africa, unresolved, pr001",
      country: "Africa"
    },
    {
      title: "Europe 2022 - PR-012",
      category: "video",
      type: "video",
      description: "Unresolved UAP report from Europe region. High-altitude object tracking.",
      filePath: "/media/video/VIDEO PENTAGONO/PR-012, Unresolved UAP Report, Europe 2022.mp4",
      sensor: "Aviation Sensor Suite",
      source: "EUCOM",
      year: 2022,
      tags: "europe, unresolved, pr012",
      country: "Europe"
    },
  ]

  console.log('Upserting AARO videos...')
  for (const v of videos) {
    // Delete existing by filePath first to avoid duplicates since we don't have a unique constraint on filePath in the schema
    // But we can just use filePath as the "match"
    const existing = await prisma.media.findFirst({
      where: { filePath: v.filePath }
    })
    
    if (existing) {
      await prisma.media.update({
        where: { id: existing.id },
        data: v
      })
    } else {
      await prisma.media.create({
        data: v
      })
    }
  }
  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
