export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Task Management REST API",
    version: "1.0.0",
    description: "A local in-memory REST API for creating, reading, updating, and deleting tasks."
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server"
    }
  ],
  tags: [
    {
      name: "General",
      description: "API metadata and health endpoints"
    },
    {
      name: "Tasks",
      description: "Task CRUD operations"
    }
  ],
  paths: {
    "/": {
      get: {
        tags: ["General"],
        summary: "Get API information",
        responses: {
          "200": {
            description: "Basic API information",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ApiInfo"
                },
                example: {
                  name: "Task Management REST API",
                  version: "1.0.0",
                  resources: {
                    tasks: "/tasks",
                    docs: "/docs",
                    health: "/health"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/health": {
      get: {
        tags: ["General"],
        summary: "Check server health",
        responses: {
          "200": {
            description: "Server is running",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Health"
                },
                example: {
                  status: "ok",
                  message: "Server is running"
                }
              }
            }
          }
        }
      }
    },
    "/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "List all tasks",
        responses: {
          "200": {
            description: "Complete task list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Task"
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Tasks"],
        summary: "Create a task",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTaskRequest"
              },
              examples: {
                valid: {
                  summary: "Valid task",
                  value: {
                    title: "Buy milk"
                  }
                },
                invalid: {
                  summary: "Invalid task",
                  value: {
                    title: "   "
                  }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Created task",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Task"
                }
              }
            }
          },
          "400": {
            $ref: "#/components/responses/BadRequest"
          }
        }
      }
    },
    "/tasks/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Numeric task ID",
          schema: {
            type: "integer",
            minimum: 1
          },
          example: 1
        }
      ],
      get: {
        tags: ["Tasks"],
        summary: "Get one task",
        responses: {
          "200": {
            description: "Matching task",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Task"
                }
              }
            }
          },
          "400": {
            $ref: "#/components/responses/BadRequest"
          },
          "404": {
            $ref: "#/components/responses/NotFound"
          }
        }
      },
      put: {
        tags: ["Tasks"],
        summary: "Update a task",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateTaskRequest"
              },
              examples: {
                updateTitle: {
                  summary: "Update title",
                  value: {
                    title: "Buy oat milk"
                  }
                },
                updateDone: {
                  summary: "Mark done",
                  value: {
                    done: true
                  }
                },
                updateBoth: {
                  summary: "Update title and done",
                  value: {
                    title: "Submit backend assignment",
                    done: true
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Updated task",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Task"
                }
              }
            }
          },
          "400": {
            $ref: "#/components/responses/BadRequest"
          },
          "404": {
            $ref: "#/components/responses/NotFound"
          }
        }
      },
      delete: {
        tags: ["Tasks"],
        summary: "Delete a task",
        responses: {
          "204": {
            description: "Task deleted successfully"
          },
          "400": {
            $ref: "#/components/responses/BadRequest"
          },
          "404": {
            $ref: "#/components/responses/NotFound"
          }
        }
      }
    }
  },
  components: {
    schemas: {
      ApiInfo: {
        type: "object",
        required: ["name", "version", "resources"],
        properties: {
          name: {
            type: "string",
            example: "Task Management REST API"
          },
          version: {
            type: "string",
            example: "1.0.0"
          },
          resources: {
            type: "object",
            required: ["tasks", "docs", "health"],
            properties: {
              tasks: {
                type: "string",
                example: "/tasks"
              },
              docs: {
                type: "string",
                example: "/docs"
              },
              health: {
                type: "string",
                example: "/health"
              }
            }
          }
        }
      },
      Health: {
        type: "object",
        required: ["status", "message"],
        properties: {
          status: {
            type: "string",
            example: "ok"
          },
          message: {
            type: "string",
            example: "Server is running"
          }
        }
      },
      Task: {
        type: "object",
        required: ["id", "title", "done"],
        properties: {
          id: {
            type: "integer",
            example: 1
          },
          title: {
            type: "string",
            example: "Complete backend assignment"
          },
          done: {
            type: "boolean",
            example: false
          }
        }
      },
      CreateTaskRequest: {
        type: "object",
        required: ["title"],
        additionalProperties: false,
        properties: {
          title: {
            type: "string",
            minLength: 1,
            example: "Buy milk"
          }
        }
      },
      UpdateTaskRequest: {
        type: "object",
        minProperties: 1,
        additionalProperties: false,
        properties: {
          title: {
            type: "string",
            minLength: 1,
            example: "Buy oat milk"
          },
          done: {
            type: "boolean",
            example: true
          }
        }
      },
      Error: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "string",
            example: "Task 99 not found"
          }
        }
      }
    },
    responses: {
      BadRequest: {
        description: "Invalid request",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            },
            examples: {
              invalidId: {
                summary: "Invalid ID",
                value: {
                  error: "Task ID must be a positive number"
                }
              },
              invalidTitle: {
                summary: "Invalid title",
                value: {
                  error: "Title is required and must be a non-empty string"
                }
              },
              invalidDone: {
                summary: "Invalid done value",
                value: {
                  error: "Done must be a Boolean when provided"
                }
              },
              unsupportedField: {
                summary: "Unsupported field",
                value: {
                  error: "Unsupported field: priority"
                }
              }
            }
          }
        }
      },
      NotFound: {
        description: "Task not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            },
            example: {
              error: "Task 99 not found"
            }
          }
        }
      }
    }
  }
};
