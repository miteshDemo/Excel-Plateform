import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Protect middleware for logged-in users
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Allow static token for local admin if needed
      if (token === "admin-token-123") {
        req.user = {
          _id: "admin-001",
          name: "Local Admin",
          email: "admin@gmail.com",
          role: "admin",
        };
        return next();
      }

      // ✅ Verify normal token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) return res.status(404).json({ message: "User not found" });

      next();
    } catch (error) {
      console.error("Auth error:", error.message);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

// ✅ Admin-only middleware
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
    next();
  } else {
    res.status(403).json({ message: "Admins only." });
  }
};

// ✅ SuperAdmin-only middleware
export const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next();
  } else {
    res.status(403).json({ message: "Super Admins only." });
  }
};
