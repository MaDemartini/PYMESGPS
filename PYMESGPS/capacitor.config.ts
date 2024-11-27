import type { CapacitorConfig } from '@capacitor/cli';
import * as dotenv from 'dotenv';

dotenv.config();

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'PYMESGPS',
  webDir: 'www',
  plugins: {
    Camera: {
      language: 'es',
      presentationStyle: 'popover',
      saveToGallery: true,
    },
    CapacitorGoogleMaps: {
      androidApiKey: process.env['ANDROID_API_KEY'] || '',
    },
    HttpApi: {
      apiKey: process.env['HTTP_API_KEY'] || '', // Clave de HTTP si la necesitas en un plugin
    },
  },
};

export default config;
