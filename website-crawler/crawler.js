import { parseRSS } from './utils/rssParser.js';
import { parseHTML } from './utils/htmlParser.js';
import { shouldIncludeUrl } from './utils/urlFilter.js';
import { logger } from './utils/logger.js';
import pLimit from 'p-limit';

const visited = new Set();
const limit = pLimit(5); // limit to 5 concurrent fetches

export async function crawlJob(config) {
  const { urls, include_globs, exclude_globs, exclude_css, url_type, dynamic_wait = 0 } = config;
  const results = [];

  const jobs = urls.map(urlStr => limit(async () => {
    const [type, url] = urlStr.split('|');
    if (!shouldIncludeUrl(url, include_globs, exclude_globs)) return;
    if (visited.has(url)) return;
    visited.add(url);

    try {
      if (type === 'rss' || url_type === 'rss' || url_type === 'rss_pub') {
        const items = await parseRSS(url);
        for (const itemUrl of items) {
          if (shouldIncludeUrl(itemUrl, include_globs, exclude_globs)) {
            results.push(await parseHTML(itemUrl, exclude_css, dynamic_wait));
          }
        }
      }

      if (type === 'pub' || url_type === 'pub' || url_type === 'rss_pub') {
        results.push(await parseHTML(url, exclude_css, dynamic_wait));
      }
    } catch (err) {
      logger.warn(`Failed to crawl ${url}: ${err.message}`);
    }
  }));

  await Promise.all(jobs);
  return results;
}