import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'PYMESGPS',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    Camera: {
      language: 'es', // Configura el idioma de la cámara
    },
    GoogleMaps: {
      apiKey: 'AIzaSyDXQGn9x4xaJ3ih4N3LGIVUq7OUVIiP4ug'
    }
  },
};

export default config;
