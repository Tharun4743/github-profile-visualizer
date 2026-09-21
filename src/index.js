const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const { fetchContributions } = require('./fetcher');
const { render3DCity } = require('./isometric');
const { THEMES } = require('./themes');
const { renderActivityTimeline } = require('./visualizers/activity');
const { renderCodingHabits } = require('./visualizers/habits');
const { renderLanguageMatrix } = require('./visualizers/languages');
const { renderLeetCodeCard } = require('./visualizers/leetcode');

async function run() {
  try {
    const username = core.getInput('username') || process.env.GITHUB_REPOSITORY_OWNER;
    const token = core.getInput('token') || process.env.GITHUB_TOKEN;
    const theme = (core.getInput('theme') || 'cyberpunk').toLowerCase();
    const visualizersInput = (core.getInput('visualizers') || '3d-city').toLowerCase();
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
    const generateAllThemes = core.getInput('generate-all') === 'true';
    const leetcodeUser = core.getInput('leetcode-username') || username;

    if (!username) {
      throw new Error('Username is required. Specify input "username" or set GITHUB_REPOSITORY_OWNER.');
    }

    const resolvedDir = path.resolve(process.cwd(), outputDir);
    if (!fs.existsSync(resolvedDir)) {
      fs.mkdirSync(resolvedDir, { recursive: true });
    }

    const requested = visualizersInput === 'all'
      ? ['3d-city', 'activity', 'habits', 'languages', 'leetcode']
      : visualizersInput.split(',').map((v) => v.trim());

    core.info(`🏙️ Generating Visualizer Suite for @${username}...`);
    core.info(`📋 Requested Visualizers: ${requested.join(', ')}`);

    const selectedTheme = THEMES[theme] || THEMES.cyberpunk;

    // 1. 3D City
    if (requested.includes('3d-city') || requested.includes('city')) {
      core.info(`Generating 3D Contribution City (${year})...`);
      const data = await fetchContributions(username, token, year);
      const citySvg = render3DCity(data, username, {
        theme,
        customColors,
        customBg,
        title,
        hideHeader,
        hideLegend,
        animate,
        heightScale,
      });
      const cityPath = path.join(resolvedDir, filename);
      fs.writeFileSync(cityPath, citySvg, 'utf8');
      core.info(`✅ Generated: ${cityPath}`);
      core.setOutput('svg-path', cityPath);
      core.setOutput('total-contributions', data.total.toString());
      const activeDays = data.days.filter((d) => (d.level || 0) > 0).length;
      core.setOutput('active-days', activeDays.toString());

      if (generateAllThemes) {
        for (const tKey of Object.keys(THEMES)) {
          const tSvg = render3DCity(data, username, { theme: tKey, heightScale, animate });
          fs.writeFileSync(path.join(resolvedDir, `profile-3d-${tKey}.svg`), tSvg, 'utf8');
        }
      }
    }

    // 2. Activity Timeline
    if (requested.includes('activity') || requested.includes('activity-timeline')) {
      core.info('Generating Recent Activity Timeline...');
      const actSvg = await renderActivityTimeline(username, token, selectedTheme);
      const actPath = path.join(resolvedDir, 'activity-timeline.svg');
      fs.writeFileSync(actPath, actSvg, 'utf8');
      core.info(`✅ Generated: ${actPath}`);
      core.setOutput('activity-svg-path', actPath);
    }

    // 3. Coding Habits
    if (requested.includes('habits') || requested.includes('coding-habits')) {
      core.info('Generating Coding Habits Radar...');
      const habitsSvg = await renderCodingHabits(username, token, selectedTheme);
      const habitsPath = path.join(resolvedDir, 'coding-habits.svg');
      fs.writeFileSync(habitsPath, habitsSvg, 'utf8');
      core.info(`✅ Generated: ${habitsPath}`);
      core.setOutput('habits-svg-path', habitsPath);
    }

    // 4. Languages Matrix
    if (requested.includes('languages') || requested.includes('langs')) {
      core.info('Generating Languages Matrix...');
      const langSvg = await renderLanguageMatrix(username, token, selectedTheme);
      const langPath = path.join(resolvedDir, 'languages-matrix.svg');
      fs.writeFileSync(langPath, langSvg, 'utf8');
      core.info(`✅ Generated: ${langPath}`);
      core.setOutput('languages-svg-path', langPath);
    }

    // 5. LeetCode Card
    if (requested.includes('leetcode')) {
      core.info(`Generating LeetCode Card for @${leetcodeUser}...`);
      const lcSvg = await renderLeetCodeCard(leetcodeUser, selectedTheme);
      const lcPath = path.join(resolvedDir, 'leetcode-card.svg');
      fs.writeFileSync(lcPath, lcSvg, 'utf8');
      core.info(`✅ Generated: ${lcPath}`);
      core.setOutput('leetcode-svg-path', lcPath);
    }

    core.info('🎉 Multi-visualizer execution complete!');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
