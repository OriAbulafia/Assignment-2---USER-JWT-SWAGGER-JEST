const commentsPaths = {
  "/comments": {
    post: {
      summary: "Create a new comment",
      description: "Creating a new comment.",
      tags: ["Comments"],
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
              required: ["comment", "postId"],
              properties: {
                comment: {
                  type: "string",
                  description: "The comment content.",
                  example: "This is my first comment.",
                },
                postId: {
                  type: "string",
                  description: "The post id.",
                  example: "60f3b4a2c4f5c50015e4f8a8",
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
                  comment: {
                    type: "string",
                    example: "This is my first comment.",
                  },
                  postId: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
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
      summary: "Get all comments and filter",
      description:
        "Get all comments and filter the comments by owner or postId.",
      tags: ["Comments"],
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
                    comment: {
                      type: "string",
                      example: "This is my first comment.",
                    },
                    postId: {
                      type: "string",
                      example: "60f3b4a2c4f5c50015e4f8a8",
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
          description: "No comments found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "no comments found",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/comments/{id}": {
    get: {
      summary: "Get comment by id",
      description: "Get comment by id.",
      tags: ["Comments"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "The comment id.",
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
                    comment: {
                      type: "string",
                      example: "This is my first comment.",
                    },
                    postId: {
                      type: "string",
                      example: "60f3b4a2c4f5c50015e4f8a8",
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
          description: "Comment not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "comment not found",
                  },
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
    put: {
      summary: "Update comment by id",
      description: "Update comment by id.",
      tags: ["Comments"],
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
          description: "The comment id.",
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
                comment: {
                  type: "string",
                  description: "The comment content.",
                  example: "Updated comment.",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Comment updated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                  comment: {
                    type: "string",
                    example: "Updated comment.",
                  },
                  postId: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
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
          description: "Comment not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "comment not found",
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
      summary: "Delete comment by id",
      description: "Delete comment by id.",
      tags: ["Comments"],
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
          description: "The comment id.",
          schema: {
            type: "string",
            example: "60f3b4a2c4f5c50015e4f8a8",
          },
        },
      ],
      responses: {
        200: {
          description: "Comment deleted successfully.",
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
          description: "Comment not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "comment not found",
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

export default commentsPaths;
