import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => {
  console.log(`Keeviqo preview server running at http://localhost:${port}`);
  console.log(`To expose this server to the internet, run: npx localtunnel --port ${port}`);
});
