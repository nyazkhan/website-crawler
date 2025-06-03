import axios from 'axios';
import cheerio from 'cheerio';

export async function parseHTML(url, excludeCss = [], wait = 0) {
  if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  for (const selector of excludeCss) {
    $(selector).remove();
  }

  return {
    url,
    title: $('title').text(),
    content: $('body').text().trim().slice(0, 10000)
  };
}