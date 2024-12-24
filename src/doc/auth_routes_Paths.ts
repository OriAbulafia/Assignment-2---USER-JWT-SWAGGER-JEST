const userPaths = {
  "/api/user/register": {
    post: {
      summary: "Register a new user",
      description:
        "Endpoint to register a new user with an email and password.",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  description: "The user's email address.",
                  example: "Sahar@gmail.com",
                },
                password: {
                  type: "string",
                  description: "The user's password.",
                  example: "securepassword123",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User registration succeeded.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "Sahar@gmail.com" },
                  _id: { type: "string", example: "676aa39695b4233508df4147" },
                  password: {
                    type: "string",
                    description: "Hashed password",
                    example: "$2b$10$hash...",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad request due to invalid input data.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Email is already in use.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/user/login": {
    post: {
      summary: "Login a user",
      description: "Login a user with email and password.",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  description: "The user's email address.",
                  example: "Sahar@gmail.com",
                },
                password: {
                  type: "string",
                  description: "The user's password.",
                  example: "securepassword123",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Successful login.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  accessToken: { type: "string", example: "eyJhbGci..." },
                  refreshToken: { type: "string", example: "eyJhbGci..." },
                  _id: { type: "string", example: "676aa39695b4233508df4147" },
                  email: { type: "string", example: "Sahar@gmail.com" },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid email or password.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid email or password.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/user/logout": {
    post: {
      summary: "Logout a user",
      description: "Log out a user by invalidating their refresh token.",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["refreshToken"],
              properties: {
                refreshToken: {
                  type: "string",
                  description: "The refresh token to revoke.",
                  example: "eyJhbGci...",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Logout successful.",
        },
        400: {
          description: "Missing or invalid refresh token.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Invalid token." },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/user/refresh": {
    post: {
      summary: "Refresh access token",
      description: "Exchange a valid refresh token for a new access token.",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["refreshToken"],
              properties: {
                refreshToken: {
                  type: "string",
                  description: "The refresh token to exchange.",
                  example: "eyJhbGci...",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Tokens refreshed successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  accessToken: { type: "string", example: "eyJhbGci..." },
                  refreshToken: { type: "string", example: "eyJhbGci..." },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid refresh token.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Invalid token." },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/user/delete": {
    delete: {
      summary: "Delete a user account",
      description: "Delete a user's account permanently.",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  description: "The user's email address.",
                  example: "testuser@gmail.com",
                },
                password: {
                  type: "string",
                  description: "The user's password.",
                  example: "testpassword",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User deleted successfully.",
        },
        400: {
          description: "Invalid email or password.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid email or password.",
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

export default userPaths;
