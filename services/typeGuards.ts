// Type guards for social media API configurations

export const isInstagramConfig = (
  config: any
): config is { clientId: string; clientSecret: string; redirectUri: string } => {
  return config && 'clientId' in config && 'clientSecret' in config && 'redirectUri' in config;
};

export const isTwitterConfig = (
  config: any
): config is { apiKey: string; apiSecret: string; bearerToken: string } => {
  return config && 'apiKey' in config && 'apiSecret' in config && 'bearerToken' in config;
};

export const isTikTokConfig = (
  config: any
): config is { clientKey: string; clientSecret: string } => {
  return config && 'clientKey' in config && 'clientSecret' in config;
};
