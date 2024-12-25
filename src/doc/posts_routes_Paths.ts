const postsPaths = {
  "/posts": {
    post: {
      summary: "Create a new post",
      description: "Create a new post with the user's ID as the owner.",
      tags: ["Posts"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "content"],
              properties: {
                title: {
                  type: "string",
                  description: "The post's title.",
                  example: "My first post",
                },
                content: {
                  type: "string",
                  description: "The post's content.",
                  example: "This is my first post.",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Post created successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                  title: {
                    type: "string",
                    example: "My first post",
                  },
                  content: {
                    type: "string",
                    example: "This is my first post.",
                  },
                  owner: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "internal server error",
                  },
                },
              },
            },
          },
        },
      },
    },
    get: {
      summary: "Get all posts and filter",
      description: "Get all posts and filter by owner or title.",
      tags: ["Posts"],
      responses: {
        200: {
          description: "Successful request.",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                      example: "60f3b4a2c4f5c50015e4f8a8",
                    },
                    title: {
                      type: "string",
                      example: "My first post",
                    },
                    content: {
                      type: "string",
                      example: "This is my first post.",
                    },
                    owner: {
                      type: "string",
                      example: "60f3b4a2c4f5c50015e4f8a8",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "No post found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "no post found",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/posts/{id}": {
    get: {
      summary: "Get post by ID",
      description: "Get a post by its ID.",
      tags: ["Posts"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "The post's ID.",
          schema: {
            type: "string",
            example: "60f3b4a2c4f5c50015e4f8a8",
          },
        },
      ],
      responses: {
        200: {
          description: "Successful request.",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                      example: "60f3b4a2c4f5c50015e4f8a8",
                    },
                    title: {
                      type: "string",
                      example: "My first post",
                    },
                    content: {
                      type: "string",
                      example: "This is my first post.",
                    },
                    owner: {
                      type: "string",
                      example: "60f3b4a2c4f5c50015e4f8a8",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "No post found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "no post found",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal server error.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "internal server error",
                  },
                },
              },
            },
          },
        },
      },
    },
    put: {
      summary: "Update a post",
      description: "Update a post by its ID.",
      tags: ["Posts"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "The post's ID.",
          schema: {
            type: "string",
            example: "60f3b4a2c4f5c50015e4f8a8",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "The post's title.",
                  example: "The updated title.",
                },
                content: {
                  type: "string",
                  description: "The post's content.",
                  example: "The updated content.",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Post updated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                  title: {
                    type: "string",
                    example: "The updated title.",
                  },
                  content: {
                    type: "string",
                    example: "The updated content.",
                  },
                  owner: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "No post found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "no post found",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "internal server error",
                  },
                },
              },
            },
          },
        },
      },
    },
    delete: {
      summary: "Delete a post",
      description: "Delete a post by its ID.",
      tags: ["Posts"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "The post's ID.",
          schema: {
            type: "string",
            example: "60f3b4a2c4f5c50015e4f8a8",
          },
        },
      ],
      responses: {
        200: {
          description: "Post deleted successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Item deleted",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "internal server error",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default postsPaths;
