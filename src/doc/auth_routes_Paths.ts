const userPaths = {
  "/auth/register": {
    post: {
      summary: "Register a new user",
      description: "Endpoint to register a new user with an email and password.",
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
                  password: {
                    type: "string",
                    description: "Hashed password",
                    example: "$2b$10$hash...",
                  },
                  refreshTokens: {
                    type: "array",
                    items: { type: "string" },
                    example: ["eyJhbGci...", "eyJhbGci..."],
                  },
                  _id: { type: "string", example: "676aa39695b4233508df4147" },
                },
              },
            },
          },
        },
        400: {
          description:
            "Bad request due to missing input data or email already exists.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "missing email or password | email already exists",
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
                    example: "An unexpected error occurred.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/login": {
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
                  email: { type: "string", example: "Sahar@gmail.com" },
                  _id: { type: "string", example: "676aa39695b4233508df4147" },
                  accessToken: { type: "string", example: "eyJhbGci..." },
                  refreshToken: { type: "string", example: "eyJhbGci..." },
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
                    example: "email or password is wrong",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/logout": {
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
                  message: {
                    type: "string",
                    example: "invalid token | missing refresh token",
                  },
                },
              },
            },
          },
        },
        403: {
          description: "Invalid refresh token.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "invalid token",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/refresh": {
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
          description: "Invalid or missing refresh token.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "invalid token | missing refresh token",
                  },
                },
              },
            },
          },
        },
        403: {
          description: "Invalid refresh token.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "invalid token",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/delete": {
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
          description: "User deleted successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User deleted successfully",
                  },
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
                    example:
                      "wrong email or password | missing email or password",
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
