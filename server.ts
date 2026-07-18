import express, {type Express, type Request, type Response} from 'express';

const app: Express = express();
const port = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const initialTasks = [
  { id: 1, title: 'Task 1', done: false },
  { id: 2, title: 'Task 2', done: true },
  { id: 3, title: 'Task 3', done: false },
];

let tasks = [...initialTasks];
let nextId = 4;

// Get all tasks extended with done status and search query
app.get('/tasks', (req: Request, res: Response) => {
  const done = req.query.done;
  const search = req.query.search;

  let filteredTasks = tasks;

  if (done === 'true') {
    filteredTasks = filteredTasks.filter(t => t.done === true);
  } 
  else if (done === 'false') {
    filteredTasks = filteredTasks.filter(t => t.done === false);
  }
  else if (done !== undefined) {
    return res.status(400).json({ error: 'Invalid done query parameter' });
  }

  if (typeof search === 'string' && search.trim().length > 0) {
    filteredTasks = filteredTasks.filter(t => t.title.includes(search));
  }

  return res.json(filteredTasks);
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

app.get('/stats', (req: Request, res: Response) => {
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.done).length;
  const openTasks = totalTasks - doneTasks;

  return res.json({total: totalTasks, done: doneTasks, open: openTasks})
});

app.post('/reset', (req: Request, res: Response) => {
  tasks = [...initialTasks];
  nextId = 4;
  return res.json({ message: 'Tasks reset successfully', tasks });
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