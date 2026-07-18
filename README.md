# Task API

A simple in-memory CRUD API for managing tasks, built with Express and TypeScript. This was my first assignment as a Backend AI Engineering intern at FlyRank — the goal was to build a minimal REST API, document it with Swagger, and write clear setup instructions.

The server keeps tasks in a plain in-memory array (no database), and exposes standard Create / Read / Update / Delete endpoints for them. It also serves interactive API docs at `/docs` via Swagger UI.

## Install & Run

```bash
npm install && npm run dev
```

This installs all dependencies and starts the dev server (via `tsx`) on **http://localhost:3000**.

## Endpoints

| Method | Path          | Description                     |
|--------|---------------|----------------------------------|
| GET    | `/`           | API info (name, version, endpoints) |
| GET    | `/health`     | Health check                    |
| GET    | `/tasks`      | Get all tasks                   |
| GET    | `/tasks/:id`  | Get a single task by ID         |
| POST   | `/tasks`      | Create a new task (body: `{ "title": string }`) |
| PUT    | `/tasks/:id`  | Update a task (body: `{ "title": string, "done": boolean }`) |
| DELETE | `/tasks/:id`  | Delete a task by ID             |
| GET    | `/docs`       | Swagger UI (interactive API docs) |

## Example Request

```
$ curl -i http://localhost:3000/tasks

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 117
ETag: W/"75-7hvHNFe4C9UBIYQ/i1+IZv+x3FE"
Date: Sat, 18 Jul 2026 12:36:39 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"title":"Task 1","done":false},{"id":2,"title":"Task 2","done":true},{"id":3,"title":"Task 3","done":false}]
```

## Swagger UI

Once the server is running, visit `http://localhost:3000/docs` to try out the endpoints interactively.

![Swagger UI screenshot](./swagger-screenshot.png)

## The Mortality Experiment

When I added new tasks and restarted the server, GET /tasks returned only the original 3 tasks — my additions were gone. This happens because the task list lives only in RAM (the server process's working memory) as a JavaScript array, and RAM is volatile — its contents are wiped the moment the process stops, so nothing survives a restart unless it's written to persistent storage like a disk or database.
