import express, { Request, Response } from "express";
import authController from "../controllers/auth_controller";

const router = express.Router();

/**
 *@swagger
 * tags:
 *  name: Auth
 *  description: The Authentication API
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: The user email
 *              password:
 *                  type: string
 *                  description: The user password
 *          example:
 *              email: 'bob@gmail.com'
 *              password: '123456'
 */

/**
 * @swagger
 * /auth/register:
 *  post:
 *      summary: registers a new user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: Registration success, return the new user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */

router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: registers a new user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: Registration success, return the new user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */
router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/refresh", authController.refresh);

router.delete("/delete", authController.deleteUser);

export default router;
