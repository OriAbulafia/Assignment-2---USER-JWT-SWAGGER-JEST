import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { iUser } from "../models/user_model.js";
import asyncHandler from "express-async-handler";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: iUser & { _id: string }; // Include _id field
    }
  }
}

interface DecodedToken extends JwtPayload {
  id: string;
}

const authUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers["authorization"]?.split(" ")[1]; // Extract Bearer token
    const refreshToken = req.cookies["refreshToken"];

    if (!accessToken && !refreshToken) {
      res.status(401);
      throw new Error("Access Denied. No token provided.");
    }

    try {
      // Validate access token
      if (accessToken) {
        const decoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN as string
        ) as DecodedToken;

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
          res.status(404);
          throw new Error("User not found.");
        }

        req.user = user.toObject() as iUser & { _id: string }; // Attach user to req
        return next();
      }
    } catch (err) {
      // Log the error if needed (e.g., expired token) and move to refresh token logic
    }

    // Handle refresh token
    try {
      if (refreshToken) {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN as string
        ) as DecodedToken;

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
          res.status(404);
          throw new Error("User not found.");
        }

        // Generate new access token
        const newAccessToken = jwt.sign(
          { id: user._id },
          process.env.ACCESS_TOKEN as string,
          { expiresIn: "1h" }
        );

        req.user = user.toObject() as iUser & { _id: string }; // Attach user to req
        res.setHeader("Authorization", `Bearer ${newAccessToken}`); // Send new token in headers
        return next(); // Continue to the next middleware
      }
    } catch (err) {
      res.status(401);
      throw new Error("Access Denied. Invalid refresh token.");
    }
  }
);

export { authUser };
