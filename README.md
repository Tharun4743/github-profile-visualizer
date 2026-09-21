<div align="center">

# ⚡ GitHub Profile 3D City & Activity Suite

### All-in-one developer activity visualizer: 3D isometric city skylines, coding habits radar, recent activity stream, language matrix, and LeetCode cards.

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-GitHub%20Profile%203D%20City-purple?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/marketplace/actions/github-profile-3d-city-activity-suite)
[![GitHub release](https://img.shields.io/github/v/release/Tharun4743/github-profile-3d-city?color=7aa2f7&style=for-the-badge)](https://github.com/Tharun4743/github-profile-3d-city/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-00f0ff?style=for-the-badge)](LICENSE)
[![Node 20](https://img.shields.io/badge/Runtime-Node.js%2020-00d26a?style=for-the-badge&logo=nodedotjs&logoColor=white)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ff79c6?style=for-the-badge)](https://github.com/Tharun4743/github-profile-3d-city/pulls)

<br/>

<!-- Flagship 3D City Preview -->
<img src="examples/profile-3d-cyberpunk.svg" alt="3D Isometric Contribution City" width="100%" />

</div>

---

## 🌟 The Visualizer Suite

Instead of installing 4 or 5 separate actions, this suite generates **all your telemetry cards in a single run**:

| 🕒 Productive Coding Habits | ⚡ Live Activity Stream |
| :---: | :---: |
| ![Coding Habits](examples/coding-habits.svg) | ![Recent Activity](examples/activity-timeline.svg) |

| 💻 Language Distribution Matrix | 🧩 LeetCode Problem Solving Card |
| :---: | :---: |
| ![Languages Matrix](examples/languages-matrix.svg) | ![LeetCode Card](examples/leetcode-card.svg) |

---

## 🎨 3D City Themes Gallery

<div align="center">

| Cyberpunk Neon | Dracula |
| :---: | :---: |
| ![Cyberpunk](examples/profile-3d-cyberpunk.svg) | ![Dracula](examples/profile-3d-dracula.svg) |

| Tokyo Night | Nord Frost |
| :---: | :---: |
| ![Tokyo Night](examples/profile-3d-tokyonight.svg) | ![Nord](examples/profile-3d-nord.svg) |

| Matrix Code | Synthwave 84 |
| :---: | :---: |
| ![Matrix](examples/profile-3d-matrix.svg) | ![Synthwave](examples/profile-3d-synthwave.svg) |

| Monokai Pro | Custom Hex Palette |
| :---: | :---: |
| ![Monokai](examples/profile-3d-monokai.svg) | ![Custom](examples/profile-3d-custom.svg) |

</div>

---

## 🚀 Quickstart: GitHub Actions

Add this workflow to your profile repository (`username/username`) at `.github/workflows/profile-visualizers.yml`:

```yaml
name: Update Profile Visualizers

on:
  schedule:
    - cron: "0 0,6,12,18 * * *" # Runs every 6 hours
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    name: generate-visualizers
    steps:
      - uses: actions/checkout@v4

      - name: Generate Visualizer Suite
        uses: Tharun4743/github-profile-3d-city@v1
        with:
          username: ${{ github.repository_owner }}
          visualizers: 'all' # Generates 3D city, activity, habits, languages & leetcode
          theme: 'cyberpunk'
          leetcode-username: 'Tharunkumar__K'
          output-dir: 'assets'

      - name: Commit & Push Changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add assets/
          if git diff --cached --quiet; then
            echo "No visualizer changes to commit."
          else
            git commit -m "chore: update profile visualizers [skip ci]"
            git pull --rebase origin main
            git push
          fi
```

### Embed in Your Profile README

```html
<!-- 3D Contribution City -->
<img src="assets/profile-3d-city.svg" width="100%" alt="3D Contribution City" />

<!-- Side-by-Side Activity & Habits -->
<table border="0" width="100%">
  <tr>
    <td width="50%"><img src="assets/coding-habits.svg" width="100%" /></td>
    <td width="50%"><img src="assets/activity-timeline.svg" width="100%" /></td>
  </tr>
  <tr>
    <td width="50%"><img src="assets/languages-matrix.svg" width="100%" /></td>
    <td width="50%"><img src="assets/leetcode-card.svg" width="100%" /></td>
  </tr>
</table>
```

---

## ⚙️ Configuration Inputs

| Input | Description | Required | Default |
| :--- | :--- | :---: | :--- |
| `username` | Target GitHub username | No | `${{ github.repository_owner }}` |
| `visualizers`| Choice of visualizers: `'all'` or comma-separated (`'3d-city,activity,habits,languages,leetcode'`) | No | `'3d-city'` |
| `theme` | Built-in palette: `cyberpunk`, `tokyonight`, `dracula`, `nord`, `matrix`, `synthwave`, `monokai`, `sunset`, `github-dark`, `github-light` | No | `'cyberpunk'` |
| `custom-colors` | 5 comma-separated hex codes for custom palette (`"#161b22,#0e4429,#006d32,#26a641,#39d353"`) | No | `''` |
| `title` | Custom header title for the 3D City | No | `⚡ {username}'s 3D Contribution City` |
| `height-scale`| Multiplier for 3D tower elevation (`1.0`, `1.5`, `2.0`) | No | `'1.0'` |
| `animate` | Enable neon lighting reflection animation (`true`/`false`) | No | `'true'` |
| `hide-header` | Hide header title and telemetry counters (`true`/`false`) | No | `'false'` |
| `hide-legend` | Hide bottom activity legend (`true`/`false`) | No | `'false'` |
| `year` | Specific calendar year (e.g. `2025`) or `'last-year'` | No | `'last-year'` |
| `leetcode-username`| LeetCode handle for problem solving telemetry | No | `${{ github.repository_owner }}` |
| `output-dir` | Output folder where SVGs will be saved | No | `'profile-3d-contrib'` |
| `filename` | Output filename for primary 3D city SVG | No | `'profile-3d-city.svg'` |

### Action Outputs

| Output | Description |
| :--- | :--- |
| `svg-path` | Path to generated 3D City SVG |
| `activity-svg-path` | Path to generated Recent Activity SVG |
| `habits-svg-path` | Path to generated Coding Habits SVG |
| `languages-svg-path` | Path to generated Language Matrix SVG |
| `leetcode-svg-path` | Path to generated LeetCode Telemetry SVG |
| `total-contributions` | Total contribution count detected |
| `active-days` | Count of active contribution days |

---

## 💻 CLI Usage

```bash
# Generate the full visualizer suite
npx github-profile-3d-city --username Tharun4743 --visualizers all --output ./assets

# Generate only 3D City and Coding Habits in Dracula theme
npx github-profile-3d-city --username Tharun4743 --visualizers "3d-city,habits" --theme dracula

# Generate with custom hex palette
npx github-profile-3d-city --username Tharun4743 --custom-colors "#151515,#00d26a,#00f0ff,#bd93f9,#ff79c6"
```

---

## 🚀 How to Publish to GitHub Marketplace

1. Navigate to: **[https://github.com/Tharun4743/github-profile-3d-city](https://github.com/Tharun4743/github-profile-3d-city)**.
2. In the right-hand sidebar under **Releases**, click on **Releases** or edit the latest release **v1.2.0**.
3. Check the box: **☑ "Publish this Action to the GitHub Marketplace"**.
4. Select category: **Utilities** (and **Continuous Integration**).
5. Click **Publish release**!

---

## 📄 License

Distributed under the [MIT License](LICENSE). Built with ❤️ by [@Tharun4743](https://github.com/Tharun4743).
