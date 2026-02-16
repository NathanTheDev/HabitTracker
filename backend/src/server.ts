
import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express + TypeScript!' });
});

app.get('/api/data', (req: Request, res: Response) => {
  res.json({
    data: 'Some data from the server',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/data', (req: Request, res: Response) => {
  const { name } = req.body;
  res.json({
    message: `Hello, ${name}!`,
    received: req.body
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

