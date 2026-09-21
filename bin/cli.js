#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { fetchContributions } = require('../src/fetcher');
const { render3DCity } = require('../src/isometric');
const { THEMES } = require('../src/themes');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    username: null,
    theme: 'cyberpunk',
    customColors: null,
    customBg: null,
    title: null,
    hideHeader: false,
    hideLegend: false,
    animate: true,
    heightScale: 1.0,
    year: 'last-year',
    output: './',
    filename: 'profile-3d-city.svg',
    all: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--username' || arg === '-u') {
      options.username = args[++i];
    } else if (arg === '--theme' || arg === '-t') {
      options.theme = args[++i];
    } else if (arg === '--custom-colors' || arg === '-c') {
      options.customColors = args[++i];
    } else if (arg === '--custom-bg') {
      options.customBg = args[++i];
    } else if (arg === '--title') {
      options.title = args[++i];
    } else if (arg === '--hide-header') {
      options.hideHeader = true;
    } else if (arg === '--hide-legend') {
      options.hideLegend = true;
    } else if (arg === '--no-animate') {
      options.animate = false;
    } else if (arg === '--height-scale' || arg === '-s') {
      options.heightScale = parseFloat(args[++i]);
    } else if (arg === '--year' || arg === '-y') {
      options.year = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--filename' || arg === '-f') {
      options.filename = args[++i];
    } else if (arg === '--all' || arg === '-a') {
      options.all = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
⚡ github-profile-3d-city — Ultra-Customizable CLI Tool
Transform your GitHub contribution calendar into an isometric 3D cyber city skyline.

Usage:
  github-profile-3d-city --username <user> [options]

Options:
  -u, --username <name>       Target GitHub username (required)
  -t, --theme <name>          Theme: cyberpunk, tokyonight, dracula, nord, matrix,
                              synthwave, monokai, sunset, github-dark, github-light (default: cyberpunk)
  -c, --custom-colors <hexes> 5 comma-separated hex colors for levels 0-4 (e.g. "#161b22,#0e4429,...")
  --custom-bg <hex>           Custom background color (e.g. "#0a0a0f")
  --title <string>            Custom header title
  --hide-header               Hide header text and telemetry counters
  --hide-legend               Hide bottom activity legend
  --no-animate                Disable pulsing neon light animation
  -s, --height-scale <float>  Scale tower heights (e.g. 1.5, default: 1.0)
  -y, --year <year>           Calendar year (e.g. 2025) or 'last-year' (default: last-year)
  -o, --output <dir>          Output directory (default: current directory)
  -f, --filename <name>       Output SVG filename (default: profile-3d-city.svg)
  -a, --all                   Generate SVGs for all available themes
  -h, --help                  Show this help screen

Examples:
  npx github-profile-3d-city --username Tharun4743 --theme dracula
  npx github-profile-3d-city --username Tharun4743 --custom-colors "#151515,#00d26a,#00f0ff,#bd93f9,#ff79c6"
  npx github-profile-3d-city --username Tharun4743 --height-scale 1.4 --title "Code City" -o ./assets
`);
}

async function main() {
  const options = parseArgs();

  if (!options.username) {
    console.error('Error: --username is required.\nRun with --help for usage details.');
    process.exit(1);
  }

  const outDir = path.resolve(process.cwd(), options.output);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`🏙️  Fetching contribution history for @${options.username} (Year: ${options.year})...`);
  const token = process.env.GITHUB_TOKEN;
  const data = await fetchContributions(options.username, token, options.year);
  console.log(`📊 Fetched ${data.days.length} days of telemetry (Total: ${data.total} contributions).`);

  if (options.all) {
    for (const tKey of Object.keys(THEMES)) {
      const svg = render3DCity(data, options.username, { ...options, theme: tKey, customColors: null });
      const filePath = path.join(outDir, `profile-3d-${tKey}.svg`);
      fs.writeFileSync(filePath, svg, 'utf8');
      console.log(`✨ Generated: ${filePath}`);
    }
  } else {
    const svg = render3DCity(data, options.username, options);
    const filePath = path.join(outDir, options.filename);
    fs.writeFileSync(filePath, svg, 'utf8');
    console.log(`✨ Generated: ${filePath}`);
  }

  console.log('🎉 Done!');
}

main().catch((err) => {
  console.error('Execution failed:', err.message);
  process.exit(1);
});
