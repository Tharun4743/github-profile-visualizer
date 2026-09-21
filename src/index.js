const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const { fetchContributions } = require('./fetcher');
const { render3DCity } = require('./isometric');
const { THEMES } = require('./themes');

async function run() {
  try {
    const username = core.getInput('username') || process.env.GITHUB_REPOSITORY_OWNER;
    const token = core.getInput('token') || process.env.GITHUB_TOKEN;
    const theme = (core.getInput('theme') || 'cyberpunk').toLowerCase();
    const outputDir = core.getInput('output-dir') || 'profile-3d-contrib';
    const filename = core.getInput('filename') || 'profile-3d-city.svg';

    if (!username) {
      throw new Error('Username is required. Please specify input "username" or set GITHUB_REPOSITORY_OWNER.');
    }

    core.info(`🏙️ Generating 3D Contribution City for @${username}...`);
    core.info(`🎨 Selected Theme: ${theme}`);

    const data = await fetchContributions(username, token);
    core.info(`📊 Retrieved ${data.days.length} days of contribution history (Total: ${data.total}).`);

    // Ensure output directory exists
    const resolvedDir = path.resolve(process.cwd(), outputDir);
    if (!fs.existsSync(resolvedDir)) {
      fs.mkdirSync(resolvedDir, { recursive: true });
    }

    // Generate selected theme
    const svg = render3DCity(data, username, theme);
    const outputPath = path.join(resolvedDir, filename);
    fs.writeFileSync(outputPath, svg, 'utf8');
    core.info(`✅ Generated: ${outputPath}`);

    // If 'all' or generate multiple requested, also generate all themes
    const generateAll = core.getInput('generate-all') === 'true';
    if (generateAll) {
      for (const tKey of Object.keys(THEMES)) {
        const themedSvg = render3DCity(data, username, tKey);
        const tPath = path.join(resolvedDir, `profile-3d-${tKey}.svg`);
        fs.writeFileSync(tPath, themedSvg, 'utf8');
        core.info(`✅ Generated theme variant: ${tPath}`);
      }
    }

    core.setOutput('svg-path', outputPath);
    core.setOutput('total-contributions', data.total.toString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
