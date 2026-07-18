import express, {type Express, type Request, type Response} from 'express';

const app: Express = express();
const port = 3000;

app.use(express.json());

const tasks = [
  { id: 1, title: 'Task 1', done: false },
  { id: 2, title: 'Task 2', done: true },
  { id: 3, title: 'Task 3', done: false },
]

app.get('/tasks', (req: Request, res: Response) => {
  res.json(tasks);
});

app.get('/tasks/:id', (req: Request, res: Response) => {
  const taskId = parseInt(String(req.params.id), 10);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    res.status(404).json({ error: 'Task 99 not found' });
  }
  
  res.json(task);
});

app.post('/tasks', (req: Request, res: Response) => {
  const title = req.body.title;
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
  }

  const newTask = { id: tasks.length + 1, title, done: false };
  tasks.push(newTask);
  res.status(201).json({ message: 'Task created successfully', task: newTask });
});

app.get('/', (req: Request, res: Response) => {
  res.json({ name: 'Task API', version: '1.0', endpoints: ["/tasks"] });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});