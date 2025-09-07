// app.config.ts
import 'dotenv/config';
import { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: any) => ({
  ...config,
  icon: "./assets/GravitusIcon.png", // path to your 1024x1024 icon
  ios: {
    ...(config.ios || {}),
    googleServicesFile: './GoogleService-Info.plist',
  },
  extra: {
    ...(config.extra || {}),
    // This will be embedded into the app at build time
    EMAIL_ALLOWLIST: process.env.EMAIL_ALLOWLIST ?? '',
  },
});
