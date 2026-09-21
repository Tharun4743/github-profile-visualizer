/**
 * Predefined Color Themes for 3D Contribution City
 * Each theme defines colors for background, text, borders, and levels 0-4.
 * Each level defines top (roof), left (shadow wall), and right (midtone wall).
 */
const THEMES = {
  cyberpunk: {
    name: 'Cyberpunk Neon',
    bgStart: '#090d16',
    bgEnd: '#141a29',
    border: '#243048',
    titleColor: '#00f0ff',
    subtitleColor: '#ff79c6',
    statColor: '#8be9fd',
    levels: [
      { top: '#181f2f', left: '#101522', right: '#0a0d16' }, // 0
      { top: '#00d26a', left: '#009c4f', right: '#006c37' }, // 1
      { top: '#00f0ff', left: '#00b4c0', right: '#007c85' }, // 2
      { top: '#bd93f9', left: '#926fd1', right: '#684aa3' }, // 3
      { top: '#ff79c6', left: '#cf549d', right: '#9b3572' }  // 4
    ]
  },
  tokyonight: {
    name: 'Tokyo Night',
    bgStart: '#1a1b26',
    bgEnd: '#24283b',
    border: '#414868',
    titleColor: '#7aa2f7',
    subtitleColor: '#9aa5ce',
    statColor: '#bb9af7',
    levels: [
      { top: '#282e44', left: '#1f2334', right: '#181b28' }, // 0
      { top: '#449dab', left: '#347984', right: '#26575f' }, // 1
      { top: '#7aa2f7', left: '#5a78b8', right: '#3f5482' }, // 2
      { top: '#bb9af7', left: '#9076bf', right: '#6c588f' }, // 3
      { top: '#f7768e', left: '#c55e71', right: '#914553' }  // 4
    ]
  },
  emerald: {
    name: 'GitHub Emerald',
    bgStart: '#0d1117',
    bgEnd: '#161b22',
    border: '#30363d',
    titleColor: '#39d353',
    subtitleColor: '#8b949e',
    statColor: '#2ea043',
    levels: [
      { top: '#1f242c', left: '#161b22', right: '#0d1117' }, // 0
      { top: '#0e4429', left: '#0a321e', right: '#072415' }, // 1
      { top: '#006d32', left: '#005226', right: '#003a1b' }, // 2
      { top: '#26a641', left: '#1c7d31', right: '#145923' }, // 3
      { top: '#39d353', left: '#2ba440', right: '#1e752d' }  // 4
    ]
  },
  sunset: {
    name: 'Neon Sunset',
    bgStart: '#150d1a',
    bgEnd: '#261224',
    border: '#4a2444',
    titleColor: '#ff9e64',
    subtitleColor: '#f7768e',
    statColor: '#e0af68',
    levels: [
      { top: '#2a1a2b', left: '#1f1320', right: '#150c16' }, // 0
      { top: '#ff9e64', left: '#c77848', right: '#915632' }, // 1
      { top: '#ff757f', left: '#c7565e', right: '#913b41' }, // 2
      { top: '#c0caf5', left: '#949cbe', right: '#696f87' }, // 3
      { top: '#bb9af7', left: '#9076bf', right: '#6c588f' }  // 4
    ]
  }
};

module.exports = { THEMES };
