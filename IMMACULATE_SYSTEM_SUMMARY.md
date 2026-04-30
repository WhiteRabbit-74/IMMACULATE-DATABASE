# 🛸 IMMACULATE DATABASE - Handover Summary
**Target Audience**: Coding AI (Claude/GPT) starting a fresh context.

## 1. Original Goal & Problem
Finalize the open-source launch of the **Intelligence Forensic Hub**.
- **Problems**: Git push lag/failure due to 800MB+ of video assets; Vercel build failures due to TypeScript errors and serverless function size limits (>300MB); inconsistencies in the SQLite database record count (38 vs 81).
- **Aesthetic**: Hyperglass, Monospace, Tactical Green/Orange.

## 2. Key Decisions & Rationale
- **Media Exclusion**: Strictly excluded only 4 videos >100MB (GitHub limit). All other media and photos are included.
- **Vercel Optimization**: Added `outputFileTracingExcludes` to `next.config.mjs` to prevent Vercel from bundling `public/media` into serverless functions, keeping them lightweight.
- **DB Integrity**: Consolidated multiple `dev.db` files into `prisma/dev.db` and force-tracked it to ensure all 81 records are live on Vercel.
- **UI Stabilizer**: Removed the buggy "Neural Cryptanalysis" module and simplified the rating system to a binary 1-star toggle per IP.

## 3. Core Configs (Settled)

### `next.config.mjs` (Tracing Fix)
```javascript
experimental: {
  serverComponentsExternalPackages: ["pdfjs-dist", "@prisma/client"],
  outputFileTracingIncludes: { "/*": ["./prisma/**/*"] },
  outputFileTracingExcludes: {
    "*": ["./public/media/**/*", "./scripts/**/*", "./scratch/**/*", "./artifacts/**/*"],
  },
},
```

### `types/three-stl.d.ts` (Build Fix)
```typescript
declare module 'three/examples/jsm/loaders/STLLoader' {
  import { Loader, LoadingManager, BufferGeometry } from 'three';
  export class STLLoader extends Loader {
    load(url: string, onLoad: (geometry: BufferGeometry) => void): void;
    parse(data: ArrayBuffer | string): BufferGeometry;
  }
}
```

### `.gitignore` (Selective Media)
```text
public/media/video/VIDEO PENTAGONO/Al Taqaddum Object.mp4
public/media/video/VIDEO PENTAGONO/Middle East Red Balloon 2024.mp4
public/media/video/VIDEO PENTAGONO/Puerto Rico Objects.mp4
public/media/video/VIDEO PENTAGONO/Unresolved UAP Report Middle East 2023.mp4
```

## 4. Open Questions & Next Steps
- **Progressive PDF Rollout**: Uploading the actual physical PDF files in smaller batches to avoid hosting bandwidth spikes.
- **Community Launch**: Shared the GitHub link on `r/UFOs` and messaged "Omega Click".
- **Admin Batch Ingest**: The logic is stable but may need refinement for larger volumes of metadata.
- **Database Scaling**: Currently on SQLite (tracked). If the community grows, migration to PostgreSQL may be required.

---
**Current State**: STABLE ALPHA. Build 550306e is live on GitHub/Vercel.
🛸🛡️🛰️
