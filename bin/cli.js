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
⚡ github-profile-3d-city — CLI Tool
Generate futuristic 3D isometric contribution city SVGs for your GitHub profile.

Usage:
  github-profile-3d-city --username <user> [options]

Options:
  -u, --username <name>     GitHub username (required)
  -t, --theme <theme>       Theme name: cyberpunk, tokyonight, emerald, sunset (default: cyberpunk)
  -o, --output <directory>  Output directory path (default: current directory)
  -f, --filename <name>     Output SVG filename (default: profile-3d-city.svg)
  -a, --all                 Generate SVGs for all available themes
  -h, --help                Show this help message

Examples:
  npx github-profile-3d-city --username Tharun4743
  npx github-profile-3d-city --username Tharun4743 --theme tokyonight --output ./assets
  npx github-profile-3d-city --username Tharun4743 --all --output ./profile-3d
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

  console.log(`🏙️  Fetching contribution history for @${options.username}...`);
  const token = process.env.GITHUB_TOKEN;
  const data = await fetchContributions(options.username, token);
  console.log(`📊 Fetched ${data.days.length} days of telemetry (Total: ${data.total} contributions).`);

  if (options.all) {
    for (const tKey of Object.keys(THEMES)) {
      const svg = render3DCity(data, options.username, tKey);
      const filePath = path.join(outDir, `profile-3d-${tKey}.svg`);
      fs.writeFileSync(filePath, svg, 'utf8');
      console.log(`✨ Generated: ${filePath}`);
    }
  } else {
    const svg = render3DCity(data, options.username, options.theme);
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
