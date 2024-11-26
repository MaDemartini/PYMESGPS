import type { CapacitorConfig } from '@capacitor/cli';

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
      androidApiKey: 'AIzaSyDXQGn9x4xaJ3ih4N3LGIVUq7OUVIiP4ug', 
    },
  },
};

export default config;
