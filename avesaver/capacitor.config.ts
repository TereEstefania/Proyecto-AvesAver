import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'avesaver',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '847890763137-6lb61mm42ssvet9hcsuocunrtbnti4up.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
