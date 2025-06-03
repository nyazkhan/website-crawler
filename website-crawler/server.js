import express from 'express';
import morgan from 'morgan';
import { crawlJob } from './crawler.js';
import { logger } from './utils/logger.js';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));

app.post('/crawl', async (req, res) => {
  try {
    const result = await crawlJob(req.body);
    res.json({ success: true, result });
  } catch (error) {
    logger.error('Crawl error', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Crawler API running on http://localhost:${PORT}`));