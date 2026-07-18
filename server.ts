import express, {type Express, type Request, type Response} from 'express';

const app: Express = express();
const port = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const tasks = [
  { id: 1, title: 'Task 1', done: false },
  { id: 2, title: 'Task 2', done: true },
  { id: 3, title: 'Task 3', done: false },
]
let nextId = 4;

// Get all tasks
app.get('/tasks', (req: Request, res: Response) => {
  return res.json(tasks);
});

// Get task
app.get('/tasks/:id', (req: Request, res: Response) => {
  const taskId = parseInt(String(req.params.id), 10);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }
  
  return res.json(task);
});

// Create task
app.post('/tasks', (req: Request, res: Response) => {
  const title = req.body.title;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = { id: nextId++, title, done: false };
  tasks.push(newTask);
  return res.status(201).json({ message: 'Task created successfully', task: newTask });
});

// Update task
app.put('/tasks/:id', (req: Request, res: Response) => {
  const taskId = parseInt(String(req.params.id), 10);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }

  const title = req.body.title;
  const done = req.body.done;

  if (!title || typeof title !== 'string' || done === undefined || typeof done !== 'boolean') {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  
  task.title = title;
  task.done = done;

  return res.json({ message: 'Task updated successfully', task });
});

// Delete task
app.delete('/tasks/:id', (req: Request, res: Response) => {
  const taskId = parseInt(String(req.params.id), 10);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }

  tasks.splice(tasks.indexOf(task), 1);
  return res.json({ message: 'Task deleted successfully', task: task});
});

app.get('/', (req: Request, res: Response) => {
  return res.json({ name: 'Task API', version: '1.0', endpoints: ["/tasks"] });
});

app.get('/health', (req: Request, res: Response) => {
  return res.json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});