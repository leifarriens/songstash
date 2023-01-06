import 'dotenv/config';

import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): Partial<ExpoConfig> => {
  return {
    ...config,
    extra: {
      API_URL: process.env.API_URL,
    },
  };
};
