const https = require('https');

/**
 * Fetches daily contribution history for a given GitHub username.
 * Supports year selection, GitHub GraphQL API with token, and public scraper fallback.
 */
async function fetchContributions(username, token, year = 'last-year') {
  if (token) {
    try {
      const data = await fetchFromGraphQL(username, token, year);
      if (data && data.days && data.days.length > 0) return data;
    } catch (err) {
      console.warn('GraphQL fetch warning:', err.message, 'Falling back to public scraper...');
    }
  }
  return fetchFromPublic(username, year);
}

function fetchFromGraphQL(username, token, year) {
  return new Promise((resolve, reject) => {
    let dateArgs = '';
    if (year && year !== 'last-year') {
      const y = parseInt(year, 10);
      if (!isNaN(y)) {
        dateArgs = `from: "${y}-01-01T00:00:00Z", to: "${y}-12-31T23:59:59Z"`;
      }
    }

    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection(${dateArgs}) {
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

function fetchFromPublic(username, year) {
  return new Promise((resolve, reject) => {
    let path = `/users/${username}/contributions`;
    if (year && year !== 'last-year') {
      const y = parseInt(year, 10);
      if (!isNaN(y)) {
        path += `?from=${y}-12-01&to=${y}-12-31`;
      }
    }

    https.get(
      {
        hostname: 'github.com',
        path,
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

          const totalMatch = html.match(/([\d,]+)\s+contributions/i);
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
