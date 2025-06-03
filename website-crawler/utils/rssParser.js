import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export async function parseRSS(url) {
  const response = await axios.get(url);
  const parser = new XMLParser();
  const json = parser.parse(response.data);
  const items = json.rss?.channel?.item || json.feed?.entry || [];

  return items.map(item => item.link?.href || item.link || '').filter(Boolean);
}