const { THEMES, createCustomTheme } = require('./themes');

/**
 * Generates a Customizable Isometric 3D SVG City from daily contribution telemetry.
 */
function render3DCity(data, username, options = {}) {
  const { days, total } = data;

  // Determine theme
  let theme = null;
  if (options.customColors) {
    theme = createCustomTheme(options.customColors, options.customBg || '#0d1117');
  }
  if (!theme) {
    const themeKey = (options.theme || 'cyberpunk').toLowerCase();
    theme = THEMES[themeKey] || THEMES.cyberpunk;
  }

  const heightScale = typeof options.heightScale === 'number' && !isNaN(options.heightScale) ? options.heightScale : 1.0;
  const animate = options.animate !== false;
  const hideHeader = options.hideHeader === true;
  const hideLegend = options.hideLegend === true;
  const customTitle = options.title || `⚡ ${username}'s 3D Contribution City`;

  // Group into weeks of 7 days
  const weeks = [];
  let currentWeek = [];
  days.forEach((day, i) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || i === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const width = 940;
  const height = hideHeader ? 380 : 450;
  const tileW = 14;
  const tileH = 7;
  const originX = 430;
  const originY = hideHeader ? 20 : 55;

  const tiles = [];
  for (let w = 0; w < weeks.length; w++) {
    for (let d = 0; d < weeks[w].length; d++) {
      const day = weeks[w][d];
      const level = Math.min(4, Math.max(0, day.level || 0));

      const x = originX + (w * (tileW / 2)) - (d * tileW);
      const y = originY + (w * (tileH / 2)) + (d * tileH);

      let pillarHeight = 3;
      if (level > 0) {
        pillarHeight = (level * 10 + Math.min(32, (day.count || level) * 2.2)) * heightScale;
      }

      tiles.push({
        w,
        d,
        x,
        y,
        pillarHeight,
        level,
        day,
        depth: y + (x * 0.001),
      });
    }
  }

  // Painter's algorithm sort
  tiles.sort((a, b) => a.depth - b.depth);
  const activeDays = days.filter((d) => (d.level || 0) > 0).length;

  let pillarsSvg = '';
  for (let idx = 0; idx < tiles.length; idx++) {
    const tile = tiles[idx];
    const { x, y, pillarHeight, level, day } = tile;
    const colors = theme.levels[level] || theme.levels[0];

    const topX = x;
    const topY = y - pillarHeight;
    const rightX = x + tileW / 2;
    const rightY = y + tileH / 2 - pillarHeight;
    const bottomX = x;
    const bottomY = y + tileH - pillarHeight;
    const leftX = x - tileW / 2;
    const leftY = y + tileH / 2 - pillarHeight;

    const baseBottomY = y + tileH;
    const baseLeftY = y + tileH / 2;
    const baseRightY = y + tileH / 2;

    const leftWall = `${leftX},${leftY} ${bottomX},${bottomY} ${bottomX},${baseBottomY} ${leftX},${baseLeftY}`;
    const rightWall = `${bottomX},${bottomY} ${rightX},${rightY} ${rightX},${baseRightY} ${bottomX},${baseBottomY}`;
    const roof = `${topX},${topY} ${rightX},${rightY} ${bottomX},${bottomY} ${leftX},${leftY}`;

    const tooltip = `${day.date}: ${day.count || (level > 0 ? '1+' : '0')} commits`;
    const animClass = animate && level >= 3 ? ' tower glow-pulse' : ' tower';

    pillarsSvg += `
      <g class="${animClass}" tabindex="0">
        <title>${tooltip}</title>
        <polygon points="${leftWall}" fill="${colors.left}" />
        <polygon points="${rightWall}" fill="${colors.right}" />
        <polygon points="${roof}" fill="${colors.top}" />
      </g>`;
  }

  // Header and Legend templates
  const headerSvg = hideHeader
    ? ''
    : `
  <!-- Header Section -->
  <g transform="translate(36, 42)">
    <text fill="${theme.titleColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700">
      ${customTitle}
    </text>
    <text y="22" fill="${theme.subtitleColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12">
      ${theme.name} • 3D Isometric Telemetry
    </text>
  </g>

  <!-- Telemetry Badges -->
  <g transform="translate(620, 28)">
    <g transform="translate(0, 0)">
      <text class="stat-label">Total Commits</text>
      <text y="20" class="stat-value">${total.toLocaleString()}</text>
    </g>
    <g transform="translate(140, 0)">
      <text class="stat-label">Active Days</text>
      <text y="20" class="stat-value">${activeDays} days</text>
    </g>
  </g>`;

  const legendSvg = hideLegend
    ? ''
    : `
  <!-- Legend in Footer -->
  <g transform="translate(36, ${height - 24})">
    <text fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="10">Less</text>
    <rect x="32" y="-9" width="10" height="10" rx="2" fill="${theme.levels[0].top}" stroke="${theme.border}" stroke-width="0.5" />
    <rect x="46" y="-9" width="10" height="10" rx="2" fill="${theme.levels[1].top}" />
    <rect x="60" y="-9" width="10" height="10" rx="2" fill="${theme.levels[2].top}" />
    <rect x="74" y="-9" width="10" height="10" rx="2" fill="${theme.levels[3].top}" />
    <rect x="88" y="-9" width="10" height="10" rx="2" fill="${theme.levels[4].top}" />
    <text x="104" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="10">More</text>
  </g>`;

  const animationCss = animate
    ? `
      @keyframes neon-sweep {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.22) drop-shadow(0 0 5px ${theme.titleColor}); }
      }
      .glow-pulse { animation: neon-sweep 4s ease-in-out infinite; }
    `
    : '';

  const rx = options.borderRadius !== undefined ? options.borderRadius : 14;
  const showBorder = options.showBorder !== false;
  const bg = options.transparent ? 'none' : 'url(#bg-canvas)';
  const border = showBorder ? theme.border : 'none';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="auto">
  <defs>
    <linearGradient id="bg-canvas" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bgStart}" />
      <stop offset="100%" stop-color="${theme.bgEnd}" />
    </linearGradient>
    <filter id="city-glow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="${theme.titleColor}" flood-opacity="0.16" />
    </filter>
    <style>
      .tower { transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer; }
      .tower:hover { filter: brightness(1.4) drop-shadow(0 0 8px ${theme.titleColor}); }
      .stat-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; fill: #8b949e; text-transform: uppercase; letter-spacing: 0.5px; }
      .stat-value { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: 700; fill: ${theme.statColor}; }
      ${animationCss}
    </style>
  </defs>

  <!-- Container Box -->
  <rect width="${width}" height="${height}" rx="${rx}" fill="${bg}" stroke="${border}" stroke-width="1.5" />

  ${headerSvg}

  <!-- Isometric 3D Projection -->
  <g transform="translate(0, ${hideHeader ? 30 : 48})" filter="url(#city-glow)">
    ${pillarsSvg}
  </g>

  ${legendSvg}

  <!-- Personal Branding Watermark -->
  <a href="https://github.com/Tharun4743/github-profile-visualizer" target="_blank">
    <text x="${width - 36}" y="${height - 24}" text-anchor="end" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" opacity="0.85">⚡ by @Tharun4743</text>
  </a>
</svg>`;
}

module.exports = { render3DCity };
