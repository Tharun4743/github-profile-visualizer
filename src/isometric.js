const { THEMES } = require('./themes');

/**
 * Generates an Isometric 3D SVG from daily contribution data.
 */
function render3DCity(data, username, themeKey = 'cyberpunk') {
  const { days, total } = data;
  const theme = THEMES[themeKey] || THEMES.cyberpunk;

  // Group into 52+ weeks of 7 days
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
  const height = 440;
  const tileW = 14;
  const tileH = 7;
  const originX = 430;
  const originY = 55;

  // Build tile objects
  const tiles = [];
  for (let w = 0; w < weeks.length; w++) {
    for (let d = 0; d < weeks[w].length; d++) {
      const day = weeks[w][d];
      const level = Math.min(4, Math.max(0, day.level || 0));

      // Isometric position
      const x = originX + (w * (tileW / 2)) - (d * tileW);
      const y = originY + (w * (tileH / 2)) + (d * tileH);

      // Height formula: 0 level is 2.5px flat tile; levels 1-4 scale up
      let pillarHeight = 3;
      if (level > 0) {
        pillarHeight = level * 10 + Math.min(30, (day.count || level) * 2);
      }

      tiles.push({
        w,
        d,
        x,
        y,
        pillarHeight,
        level,
        day,
        // Painter's algorithm depth: sort by screen Y and X so back is rendered first
        depth: y + (x * 0.001),
      });
    }
  }

  // Sort back-to-front (lowest Y drawn first)
  tiles.sort((a, b) => a.depth - b.depth);

  // Active days count
  const activeDays = days.filter((d) => (d.level || 0) > 0).length;

  let pillarsSvg = '';
  for (const tile of tiles) {
    const { x, y, pillarHeight, level, day } = tile;
    const colors = theme.levels[level] || theme.levels[0];

    // Diamond vertices:
    // Top roof
    const topX = x;
    const topY = y - pillarHeight;
    const rightX = x + tileW / 2;
    const rightY = y + tileH / 2 - pillarHeight;
    const bottomX = x;
    const bottomY = y + tileH - pillarHeight;
    const leftX = x - tileW / 2;
    const leftY = y + tileH / 2 - pillarHeight;

    // Base ground bottom vertices
    const baseBottomY = y + tileH;
    const baseLeftY = y + tileH / 2;
    const baseRightY = y + tileH / 2;

    // SVG polygon points
    const leftWallPoints = `${leftX},${leftY} ${bottomX},${bottomY} ${bottomX},${baseBottomY} ${leftX},${baseLeftY}`;
    const rightWallPoints = `${bottomX},${bottomY} ${rightX},${rightY} ${rightX},${baseRightY} ${bottomX},${baseBottomY}`;
    const roofPoints = `${topX},${topY} ${rightX},${rightY} ${bottomX},${bottomY} ${leftX},${leftY}`;

    const tooltip = `${day.date}: ${day.count || (level > 0 ? '1+' : '0')} contributions`;

    pillarsSvg += `
      <g class="tower" tabindex="0">
        <title>${tooltip}</title>
        <polygon points="${leftWallPoints}" fill="${colors.left}" />
        <polygon points="${rightWallPoints}" fill="${colors.right}" />
        <polygon points="${roofPoints}" fill="${colors.top}" />
      </g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="auto">
  <defs>
    <linearGradient id="bg-canvas" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bgStart}" />
      <stop offset="100%" stop-color="${theme.bgEnd}" />
    </linearGradient>
    <filter id="city-glow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${theme.titleColor}" flood-opacity="0.18" />
    </filter>
    <style>
      .tower { transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer; }
      .tower:hover { filter: brightness(1.35) drop-shadow(0 0 6px ${theme.titleColor}); }
      .stat-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; fill: #8b949e; text-transform: uppercase; letter-spacing: 0.5px; }
      .stat-value { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; fill: ${theme.statColor}; }
    </style>
  </defs>

  <!-- Container Box -->
  <rect width="${width}" height="${height}" rx="14" fill="url(#bg-canvas)" stroke="${theme.border}" stroke-width="1.5" />

  <!-- Header Section -->
  <g transform="translate(36, 42)">
    <text fill="${theme.titleColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700">
      ⚡ ${username}'s 3D Contribution City
    </text>
    <text y="22" fill="${theme.subtitleColor}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12">
      ${theme.name} Edition • Powered by github-profile-3d-city
    </text>
  </g>

  <!-- Telemetry Badges in Header Right -->
  <g transform="translate(620, 28)">
    <g transform="translate(0, 0)">
      <text class="stat-label">Total Commits</text>
      <text y="20" class="stat-value">${total.toLocaleString()}</text>
    </g>
    <g transform="translate(140, 0)">
      <text class="stat-label">Active Days</text>
      <text y="20" class="stat-value">${activeDays} days</text>
    </g>
  </g>

  <!-- Isometric 3D Projection -->
  <g transform="translate(0, 48)" filter="url(#city-glow)">
    ${pillarsSvg}
  </g>

  <!-- Legend in Footer -->
  <g transform="translate(36, 412)">
    <text fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="10">Less</text>
    <rect x="32" y="-9" width="10" height="10" rx="2" fill="${theme.levels[0].top}" stroke="${theme.border}" stroke-width="0.5" />
    <rect x="46" y="-9" width="10" height="10" rx="2" fill="${theme.levels[1].top}" />
    <rect x="60" y="-9" width="10" height="10" rx="2" fill="${theme.levels[2].top}" />
    <rect x="74" y="-9" width="10" height="10" rx="2" fill="${theme.levels[3].top}" />
    <rect x="88" y="-9" width="10" height="10" rx="2" fill="${theme.levels[4].top}" />
    <text x="104" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="10">More</text>
  </g>
</svg>`;
}

module.exports = { render3DCity };
