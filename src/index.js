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
    const customColors = core.getInput('custom-colors');
    const customBg = core.getInput('custom-bg');
    const title = core.getInput('title');
    const hideHeader = core.getInput('hide-header') === 'true';
    const hideLegend = core.getInput('hide-legend') === 'true';
    const animate = core.getInput('animate') !== 'false';
    const heightScale = parseFloat(core.getInput('height-scale') || '1.0');
    const year = core.getInput('year') || 'last-year';
    const outputDir = core.getInput('output-dir') || 'profile-3d-contrib';
    const filename = core.getInput('filename') || 'profile-3d-city.svg';
    const generateAll = core.getInput('generate-all') === 'true';

    if (!username) {
      throw new Error('Username is required. Please specify input "username" or set GITHUB_REPOSITORY_OWNER.');
    }

    core.info(`🏙️ Generating 3D Contribution City for @${username}...`);
    core.info(`🎨 Theme: ${customColors ? 'Custom Colors' : theme} (Year: ${year})`);

    const data = await fetchContributions(username, token, year);
    core.info(`📊 Retrieved ${data.days.length} days of contribution history (Total: ${data.total}).`);

    const resolvedDir = path.resolve(process.cwd(), outputDir);
    if (!fs.existsSync(resolvedDir)) {
      fs.mkdirSync(resolvedDir, { recursive: true });
    }

    const options = {
      theme,
      customColors,
      customBg,
      title,
      hideHeader,
      hideLegend,
      animate,
      heightScale,
    };

    const svg = render3DCity(data, username, options);
    const outputPath = path.join(resolvedDir, filename);
    fs.writeFileSync(outputPath, svg, 'utf8');
    core.info(`✅ Generated primary SVG: ${outputPath}`);

    if (generateAll) {
      for (const tKey of Object.keys(THEMES)) {
        const themedSvg = render3DCity(data, username, { ...options, theme: tKey, customColors: null });
        const tPath = path.join(resolvedDir, `profile-3d-${tKey}.svg`);
        fs.writeFileSync(tPath, themedSvg, 'utf8');
        core.info(`✅ Generated theme variant: ${tPath}`);
      }
    }

    const activeDays = data.days.filter((d) => (d.level || 0) > 0).length;

    core.setOutput('svg-path', outputPath);
    core.setOutput('total-contributions', data.total.toString());
    core.setOutput('active-days', activeDays.toString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
