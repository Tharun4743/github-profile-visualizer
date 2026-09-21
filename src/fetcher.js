const https = require('https');

/**
 * Fetches daily contribution history for a given GitHub username.
 * Supports GitHub GraphQL API (if token provided) with fallback to public page scraper.
 */
async function fetchContributions(username, token) {
  if (token) {
    try {
      const data = await fetchFromGraphQL(username, token);
      if (data && data.length > 0) return data;
    } catch (err) {
      console.warn('GraphQL fetch failed, falling back to public scraper:', err.message);
    }
  }
  return fetchFromPublic(username);
}

function fetchFromGraphQL(username, token) {
  return new Promise((resolve, reject) => {
    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

    const body = JSON.stringify({ query, variables: { login: username } });
    const req = https.request(
      {
        hostname: 'api.github.com',
        path: '/graphql',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'github-profile-3d-city',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(raw);
            if (parsed.errors) {
              return reject(new Error(parsed.errors[0].message));
            }
            const calendar = parsed.data?.user?.contributionsCollection?.contributionCalendar;
            if (!calendar) return reject(new Error('User not found'));

            const levelMap = {
              NONE: 0,
              FIRST_QUARTILE: 1,
              SECOND_QUARTILE: 2,
              THIRD_QUARTILE: 3,
              FOURTH_QUARTILE: 4,
            };

            const days = [];
            for (const week of calendar.weeks) {
              for (const day of week.contributionDays) {
                days.push({
                  date: day.date,
                  count: day.contributionCount,
                  level: levelMap[day.contributionLevel] ?? (day.contributionCount > 0 ? 1 : 0),
                });
              }
            }
            resolve({ days, total: calendar.totalContributions });
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function fetchFromPublic(username) {
  return new Promise((resolve, reject) => {
    https.get(
      {
        hostname: 'github.com',
        path: `/users/${username}/contributions`,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      },
      (res) => {
        let html = '';
        res.on('data', (chunk) => (html += chunk));
        res.on('end', () => {
          const days = [];
          let total = 0;
          const regex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*?data-level="(\d+)"/g;
          let match;
          while ((match = regex.exec(html)) !== null) {
            const level = parseInt(match[2], 10);
            days.push({
              date: match[1],
              count: level === 0 ? 0 : Math.max(1, level * 2),
              level,
            });
          }

          // Parse total contributions from header if available
          const totalMatch = html.match(/([\d,]+)\s+contributions\s+in\s+the\s+last\s+year/i);
          if (totalMatch) {
            total = parseInt(totalMatch[1].replace(/,/g, ''), 10);
          } else {
            total = days.reduce((sum, d) => sum + (d.count || 0), 0);
          }

          resolve({ days, total });
        });
      }
    ).on('error', reject);
  });
}

module.exports = { fetchContributions };
