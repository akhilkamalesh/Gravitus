// scripts/inject-firebase-config.cjs
const fs = require('fs');
const path = require('path');

function writeFromEnv(envName, outPath) {
  const b64 = process.env[envName];
  if (!b64) {
    console.error(`[inject-firebase-config] Missing env var: ${envName}`);
    process.exit(1); // Fail the build early if not provided
  }
  const buf = Buffer.from(b64, 'base64');
  fs.writeFileSync(path.join(process.cwd(), outPath), buf);
  console.log(`[inject-firebase-config] Wrote ${outPath} (${buf.length} bytes)`);
}

// iOS Firebase config
writeFromEnv('GOOGLE_SERVICE_INFO_PLIST_BASE64', 'GoogleService-Info.plist');

// Android Firebase config (optional — only if you set this secret too)
// writeFromEnv('GOOGLE_SERVICES_JSON_BASE64', 'google-services.json');
