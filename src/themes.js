/**
 * Predefined Color Themes for 3D Contribution City
 * Each theme defines colors for background, border, title, stats, and 5 levels (0-4).
 * Each level has top (roof), left (shadow wall), and right (midtone wall).
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
  dracula: {
    name: 'Dracula',
    bgStart: '#282a36',
    bgEnd: '#21222c',
    border: '#6272a4',
    titleColor: '#bd93f9',
    subtitleColor: '#ff79c6',
    statColor: '#50fa7b',
    levels: [
      { top: '#44475a', left: '#343746', right: '#282a36' }, // 0
      { top: '#6272a4', left: '#4e5a82', right: '#3a4463' }, // 1
      { top: '#8be9fd', left: '#64b6c7', right: '#458896' }, // 2
      { top: '#50fa7b', left: '#3ec460', right: '#298e43' }, // 3
      { top: '#ff79c6', left: '#cf549d', right: '#9b3572' }  // 4
    ]
  },
  nord: {
    name: 'Nord Frost',
    bgStart: '#2e3440',
    bgEnd: '#242933',
    border: '#4c566a',
    titleColor: '#88c0d0',
    subtitleColor: '#81a1c1',
    statColor: '#a3be8c',
    levels: [
      { top: '#3b4252', left: '#2e3440', right: '#242933' }, // 0
      { top: '#4c566a', left: '#3c4454', right: '#2b323e' }, // 1
      { top: '#5e81ac', left: '#4a678a', right: '#374d67' }, // 2
      { top: '#88c0d0', left: '#6b9aa7', right: '#4f737d' }, // 3
      { top: '#a3be8c', left: '#829b6e', right: '#5f734f' }  // 4
    ]
  },
  matrix: {
    name: 'Matrix Code',
    bgStart: '#0d110d',
    bgEnd: '#000000',
    border: '#00ff66',
    titleColor: '#00ff66',
    subtitleColor: '#55ff99',
    statColor: '#00ff41',
    levels: [
      { top: '#112211', left: '#0a160a', right: '#050c05' }, // 0
      { top: '#005522', left: '#003e19', right: '#002910' }, // 1
      { top: '#008833', left: '#006626', right: '#00471a' }, // 2
      { top: '#00cc44', left: '#009e35', right: '#007025' }, // 3
      { top: '#00ff55', left: '#00c742', right: '#008f2f' }  // 4
    ]
  },
  synthwave: {
    name: 'Synthwave 84',
    bgStart: '#261435',
    bgEnd: '#170b22',
    border: '#fe4450',
    titleColor: '#f92aad',
    subtitleColor: '#fede5d',
    statColor: '#36f9f6',
    levels: [
      { top: '#3c2353', left: '#2a163d', right: '#1c0c2a' }, // 0
      { top: '#72f1b8', left: '#52b588', right: '#36805d' }, // 1
      { top: '#36f9f6', left: '#24b8b6', right: '#167d7c' }, // 2
      { top: '#fede5d', left: '#c9b044', right: '#8c7a2c' }, // 3
      { top: '#f92aad', left: '#c41d86', right: '#8e1160' }  // 4
    ]
  },
  monokai: {
    name: 'Monokai Pro',
    bgStart: '#2d2a2e',
    bgEnd: '#221f22',
    border: '#727072',
    titleColor: '#ffd866',
    subtitleColor: '#fc9867',
    statColor: '#a9dc76',
    levels: [
      { top: '#403e41', left: '#312f32', right: '#222023' }, // 0
      { top: '#78dce8', left: '#5ba9b3', right: '#3f787f' }, // 1
      { top: '#a9dc76', left: '#82ab5a', right: '#5e7d3f' }, // 2
      { top: '#ffd866', left: '#c7a74a', right: '#8f7630' }, // 3
      { top: '#ff6188', left: '#c74766', right: '#8f2e46' }  // 4
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
  },
  'github-dark': {
    name: 'GitHub Dark',
    bgStart: '#0d1117',
    bgEnd: '#161b22',
    border: '#30363d',
    titleColor: '#39d353',
    subtitleColor: '#8b949e',
    statColor: '#2ea043',
    levels: [
      { top: '#161b22', left: '#10141a', right: '#0a0d11' }, // 0
      { top: '#0e4429', left: '#0a321e', right: '#072415' }, // 1
      { top: '#006d32', left: '#005226', right: '#003a1b' }, // 2
      { top: '#26a641', left: '#1c7d31', right: '#145923' }, // 3
      { top: '#39d353', left: '#2ba440', right: '#1e752d' }  // 4
    ]
  },
  'github-light': {
    name: 'GitHub Light',
    bgStart: '#ffffff',
    bgEnd: '#f6f8fa',
    border: '#d0d7de',
    titleColor: '#1a7f37',
    subtitleColor: '#57606a',
    statColor: '#0969da',
    levels: [
      { top: '#ebedf0', left: '#d0d7de', right: '#afb8c1' }, // 0
      { top: '#9be9a8', left: '#76ca83', right: '#56a762' }, // 1
      { top: '#40c463', left: '#2da04b', right: '#1e7d36' }, // 2
      { top: '#30a14e', left: '#21803c', right: '#15612c' }, // 3
      { top: '#216e39', left: '#17542a', right: '#0e3a1c' }  // 4
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
  'night-view': {
    name: 'Night View Gold',
    bgStart: '#00000f',
    bgEnd: '#05051a',
    border: '#193c82',
    titleColor: 'rgb(255, 200, 55)',
    subtitleColor: '#8be9fd',
    statColor: 'rgb(255, 200, 55)',
    levels: [
      { top: '#193c82', left: '#15326d', right: '#122a5b' },
      { top: '#195ad2', left: '#154bb0', right: '#123f93' },
      { top: '#1978dc', left: '#1564b8', right: '#12549a' },
      { top: '#1996e6', left: '#157dc0', right: '#1269a1' },
      { top: '#19a5f0', left: '#158ac9', right: '#1273a8' }
    ]
  },
  'night-rainbow': {
    name: 'Night Rainbow',
    bgStart: '#00000f',
    bgEnd: '#08081f',
    border: '#bd93f9',
    titleColor: '#ff79c6',
    subtitleColor: '#8be9fd',
    statColor: 'rgb(255, 200, 55)',
    levels: [
      { top: '#282e44', left: '#1f2334', right: '#181b28' },
      { top: '#bd93f9', left: '#926fd1', right: '#684aa3' },
      { top: '#00f0ff', left: '#00b4c0', right: '#007c85' },
      { top: '#ffb86c', left: '#d48d42', right: '#9c6227' },
      { top: '#ff79c6', left: '#cf549d', right: '#9b3572' }
    ]
  },
  'night-green': {
    name: 'Night Green',
    bgStart: '#00000f',
    bgEnd: '#03140a',
    border: '#26a641',
    titleColor: '#39d353',
    subtitleColor: '#7ee787',
    statColor: '#26a641',
    levels: [
      { top: '#161b22', left: '#0d1117', right: '#010409' },
      { top: '#0e4429', left: '#0a321e', right: '#062013' },
      { top: '#006d32', left: '#005226', right: '#003719' },
      { top: '#26a641', left: '#1d7c31', right: '#145321' },
      { top: '#39d353', left: '#2ba440', right: '#1e752d' }
    ]
  }
};

/**
 * Creates a custom theme from comma-separated hex colors (5 colors for levels 0-4)
 */
function createCustomTheme(customColorsStr, bgStr = '#0d1117') {
  if (!customColorsStr) return null;
  const hexes = customColorsStr.split(',').map(c => c.trim()).filter(Boolean);
  if (hexes.length < 5) return null;

  // Darken hex helper for left shadow and right midtone walls
  function adjustColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
    return `#${(0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  }

  const levels = hexes.slice(0, 5).map(topHex => ({
    top: topHex,
    left: adjustColor(topHex, -28),
    right: adjustColor(topHex, -45)
  }));

  return {
    name: 'Custom Palette',
    bgStart: bgStr,
    bgEnd: adjustColor(bgStr, -10),
    border: adjustColor(bgStr, 30),
    titleColor: hexes[4] || '#00f0ff',
    subtitleColor: '#8b949e',
    statColor: hexes[3] || '#bd93f9',
    levels
  };
}

module.exports = { THEMES, createCustomTheme };
