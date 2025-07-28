// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Fixes static asset resolution issues (e.g., logotype.png in expo-router)
config.resolver.assetExts.push("png");

module.exports = config;
