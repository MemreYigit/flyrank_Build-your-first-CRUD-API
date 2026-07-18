# Task Management REST API

An in-memory Task Management REST API built with TypeScript, Node.js, Express, and Swagger UI.

## Installation Commands

```bash
npm init -y
npm install express swagger-ui-express
npm install -D typescript ts-node-dev @types/node @types/express @types/swagger-ui-express
```

## Project Structure

```text
.
├── README.md
├── package-lock.json
├── package.json
├── tsconfig.json
└── src
    ├── server.ts
    └── swagger.ts
```

## Source Code

- `src/server.ts` contains the Express server, in-memory task data, validation, and CRUD routes.
- `src/swagger.ts` contains the OpenAPI 3.0 specification used by Swagger UI.

Each task uses this structure:

```json
{
  "id": 1,
  "title": "Complete backend assignment",
  "done": false
}
```

The server starts with three example tasks and stores all changes in memory.

## Swagger/OpenAPI

Swagger UI is served at:

```text
http://localhost:3000/docs
```

The OpenAPI configuration documents:

- `GET /`
- `GET /health`
- `GET /tasks`
- `GET /tasks/{id}`
- `POST /tasks`
- `PUT /tasks/{id}`
- `DELETE /tasks/{id}`

It includes schemas, path parameters, request bodies, success responses, validation errors, and `404` errors. CRUD operations can be tested from Swagger UI using **Try it out**.

## Start the Server

For local development:

```bash
npm run dev
```

For compiled JavaScript:

```bash
npm run build
npm start
```

The API runs on:

```text
http://localhost:3000
```

## Example curl Commands

### API information

```bash
curl http://localhost:3000/
```

### Health check

```bash
curl http://localhost:3000/health
```

### List all tasks

```bash
curl http://localhost:3000/tasks
```

### Get an existing task

```bash
curl http://localhost:3000/tasks/1
```

### Get a missing task

```bash
curl http://localhost:3000/tasks/99
```

### Create a task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk"}'
```

### Create a task with invalid input

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"   "}'
```

### Update a task title

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Submit backend assignment"}'
```

### Update a task status

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'
```

### Update a task with invalid input

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"done":"yes"}'
```

### Delete a task

```bash
curl -i -X DELETE http://localhost:3000/tasks/1
```

### Delete a missing task

```bash
curl http://localhost:3000/tasks/99 -X DELETE
```
