// app.config.ts
import 'dotenv/config';

export default ({ config }: any) => ({
  ...config,
  extra: {
    ...(config.extra || {}),
    // This will be embedded into the app at build time
    EMAIL_ALLOWLIST: process.env.EMAIL_ALLOWLIST ?? '',
  },
});
