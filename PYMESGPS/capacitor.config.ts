import type { CapacitorConfig } from '@capacitor/cli';
import { environment } from './src/environments/environment'; // Asegúrate de la ruta correcta

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
      androidApiKey: environment.androidApiKey,
    },
    HttpApi: {
      apiKey: environment.httpApiKey,
    },
  },
};

export default config;
