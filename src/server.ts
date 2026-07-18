import express, { type ErrorRequestHandler, type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./swagger";

interface Task {
  id: number;
  title: string;
  done: boolean;
}

interface CreateTaskBody {
  title?: unknown;
}

interface UpdateTaskBody {
  title?: unknown;
  done?: unknown;
}

const app = express();
const PORT = 3000;

const tasks: Task[] = [
  {
    id: 1,
    title: "Complete backend assignment",
    done: false
  },
  {
    id: 2,
    title: "Review TypeScript notes",
    done: true
  },
  {
    id: 3,
    title: "Prepare Swagger documentation",
    done: false
  }
];

let nextTaskId = Math.max(...tasks.map((task) => task.id)) + 1;

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    name: "Task Management REST API",
    version: "1.0.0",
    resources: {
      tasks: "/tasks",
      docs: "/docs",
      health: "/health"
    }
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running"
  });
});

app.get("/tasks", (_req: Request, res: Response) => {
  res.status(200).json(tasks);
});

app.get("/tasks/:id", (req: Request<{ id: string }>, res: Response) => {
  const taskId = parseTaskId(req.params.id);

  if (taskId === null) {
    res.status(400).json({ error: "Task ID must be a positive number" });
    return;
  }

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    res.status(404).json({ error: `Task ${taskId} not found` });
    return;
  }

  res.status(200).json(task);
});

app.post("/tasks", (req: Request<Record<string, never>, Task | { error: string }, CreateTaskBody>, res: Response) => {
  const body = getRequestBody(req.body);
  const title = validateTitle(body.title);

  if (title === null) {
    res.status(400).json({ error: "Title is required and must be a non-empty string" });
    return;
  }

  const newTask: Task = {
    id: nextTaskId,
    title,
    done: false
  };

  nextTaskId += 1;
  tasks.push(newTask);

  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req: Request<{ id: string }, Task | { error: string }, UpdateTaskBody>, res: Response) => {
  const taskId = parseTaskId(req.params.id);

  if (taskId === null) {
    res.status(400).json({ error: "Task ID must be a positive number" });
    return;
  }

  const supportedFields = ["title", "done"];
  const body = getRequestBody(req.body);
  const requestFields = Object.keys(body);
  const unsupportedField = requestFields.find((field) => !supportedFields.includes(field));

  if (unsupportedField) {
    res.status(400).json({ error: `Unsupported field: ${unsupportedField}` });
    return;
  }

  if (requestFields.length === 0) {
    res.status(400).json({ error: "Request body must include title, done, or both" });
    return;
  }

  let title: string | undefined;

  if ("title" in body) {
    title = validateTitle(body.title) ?? undefined;

    if (title === undefined) {
      res.status(400).json({ error: "Title must be a non-empty string when provided" });
      return;
    }
  }

  if ("done" in body && typeof body.done !== "boolean") {
    res.status(400).json({ error: "Done must be a Boolean when provided" });
    return;
  }

  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    res.status(404).json({ error: `Task ${taskId} not found` });
    return;
  }

  if (title !== undefined) {
    task.title = title;
  }

  if ("done" in body) {
    task.done = body.done as boolean;
  }

  res.status(200).json(task);
});

app.delete("/tasks/:id", (req: Request<{ id: string }>, res: Response) => {
  const taskId = parseTaskId(req.params.id);

  if (taskId === null) {
    res.status(400).json({ error: "Task ID must be a positive number" });
    return;
  }

  const taskIndex = tasks.findIndex((item) => item.id === taskId);

  if (taskIndex === -1) {
    res.status(404).json({ error: `Task ${taskId} not found` });
    return;
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

const jsonErrorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ error: "Request body must be valid JSON" });
    return;
  }

  next(error);
};

app.use(jsonErrorHandler);

function parseTaskId(value: string): number | null {
  const taskId = Number(value);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return null;
  }

  return taskId;
}

function validateTitle(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedTitle = value.trim();

  return trimmedTitle.length > 0 ? trimmedTitle : null;
}

function getRequestBody(body: unknown): Record<string, unknown> {
  if (body && typeof body === "object") {
    return body as Record<string, unknown>;
  }

  return {};
}

app.listen(PORT, () => {
  console.log(`Task Management REST API is running at http://localhost:${PORT}`);
  console.log(`Swagger UI is available at http://localhost:${PORT}/docs`);
});
