import express, {type Express, type Request, type Response} from 'express';

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.json({ name: 'Task API', version: '1.0', endpoints: ["/tasks"] });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});