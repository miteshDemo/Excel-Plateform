import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Middleware: Protect routes (for logged-in users)
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // ✅ Bypass JWT verification for Admin (local static token)
      if (token === "admin-token-123") {
        req.user = {
          _id: "admin-001",
          name: "Admin",
          email: "admin@gmail.com",
          role: "admin123",
        };
        return next(); // ✅ Allow access for admin
      }

      // ✅ Normal user token verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID and exclude password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      next(); // ✅ Proceed if token is valid and user exists
    } catch (error) {
      console.error("Auth error:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

// ✅ Middleware: Admin-only access
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // ✅ Allow admin access
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};
