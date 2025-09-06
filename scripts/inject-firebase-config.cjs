// scripts/inject-firebase-config.cjs
const fs = require('fs');
const path = require('path');

function writeFromEnv(envName, outPath) {
  const b64 = process.env[envName];
  if (!b64) {
    console.error(`[inject-firebase-config] Missing env var: ${envName}`);
    process.exit(1);
  }
  const buf = Buffer.from(b64, 'base64');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
  console.log(`[inject-firebase-config] Wrote ${outPath} (${buf.length} bytes)`);
}

function iosAppDir() {
  const iosDir = path.join(process.cwd(), 'ios');
  if (!fs.existsSync(iosDir)) return null;
  const xproj = fs.readdirSync(iosDir).find(f => f.endsWith('.xcodeproj'));
  if (!xproj) return null;
  const appName = path.basename(xproj, '.xcodeproj'); // e.g. Gravitus.xcodeproj -> Gravitus
  return path.join(iosDir, appName);
}

const rootPlist = path.join(process.cwd(), 'GoogleService-Info.plist');
writeFromEnv('GOOGLE_SERVICE_INFO_PLIST_BASE64', rootPlist);

// Also write into ios/<AppName>/GoogleService-Info.plist if iOS project exists
const appDir = iosAppDir();
if (appDir) {
  const iosPlist = path.join(appDir, 'GoogleService-Info.plist');
  writeFromEnv('GOOGLE_SERVICE_INFO_PLIST_BASE64', iosPlist);
}

// Optional Android support:
// const androidJson = path.join(process.cwd(), 'android', 'app', 'google-services.json');
// if (fs.existsSync(path.dirname(androidJson))) {
//   writeFromEnv('GOOGLE_SERVICES_JSON_BASE64', androidJson);
// }
