// metro.config.js
const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    ...defaultConfig.resolver,
    assetExts: ['db', 'mp4', 'jpg', 'png', 'ttf', 'wav', 'mp3'],
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
  },
  resolver: {
    blacklistRE: /.*\/__fixtures__\/.*/,
  },
  watchFolders: [],
  maxWorkers: 2,
};
