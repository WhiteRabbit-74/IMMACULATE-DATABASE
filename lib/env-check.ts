/**
 * VALIDAZIONE VARIABILI D'AMBIENTE
 * Questo modulo verifica la presenza delle chiavi necessarie per il deployment su Vercel.
 * Se una variabile critica manca, il sistema emetterà un warning nel log di produzione.
 */

const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "NEXTAUTH_URL",
];

export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.warn(
      `[CRITICAL_WARNING] Missing Environment Variables: ${missing.join(", ")}`
    );
    console.warn(
      "The archive may operate in a degraded state or fail to authorize agents."
    );
  } else {
    console.log("[SYSTEM_READY] All production environment variables verified.");
  }
}
