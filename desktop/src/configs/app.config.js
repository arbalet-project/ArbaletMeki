module.exports = {
    platform: process.platform,
    port: process.env.PORT ? process.env.PORT : 3000,
    languages: ['el', 'en'],
    fallbackLng: 'en',
    namespace: 'translation'
  };