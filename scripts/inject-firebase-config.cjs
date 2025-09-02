// scripts/inject-firebase-config.cjs
const fs = require('fs');
const path = require('path');

function writeIfEnv(envName, outPath) {
  const b64 = process.env[envName];
  if (!b64) return false;
  const buf = Buffer.from(b64, 'base64');
  fs.writeFileSync(path.join(process.cwd(), outPath), buf);
  console.log(`Wrote ${outPath} from ${envName}`);
  return true;
}

// iOS
writeIfEnv('GOOGLE_SERVICE_INFO_PLIST_BASE64', 'GoogleService-Info.plist');

// Android (optional)
// writeIfEnv('GOOGLE_SERVICES_JSON_BASE64', 'google-services.json');
