// metro.config.js
const path = require('path');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    // Ensure this line exists or is configured properly
    assetExts: ['db', 'mp4', 'jpg', 'png', 'ttf', 'wav', 'mp3'],
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'],
  },
  resolver: {
    blacklistRE: /.*\/__fixtures__\/.*/,
  },
  watchFolders: [],
  maxWorkers: 2,
};
