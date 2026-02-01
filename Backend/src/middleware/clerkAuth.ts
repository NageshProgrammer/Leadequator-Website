import { clerkClient } from "@clerk/clerk-sdk-node";
import { Request, Response, NextFunction } from "express";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing auth token" });
    }

    const token = authHeader.replace("Bearer ", "");

    const session = await clerkClient.verifyToken(token);

    // attach userId to request
    (req as any).auth = {
      userId: session.sub,
    };

    next();
  } catch (err) {
    console.error("Clerk auth error:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
