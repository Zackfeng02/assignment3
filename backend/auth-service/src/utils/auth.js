import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

// Generate Access Token
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate Refresh Token
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }
};

// Authentication Middleware
export const authMiddleware = async (req, res, next) => {
  
  // Ensure req.body exists before accessing operationName
  if (!req.body || typeof req.body !== "object") {
    return next(); // If req.body is undefined, proceed without blocking
  }
  
  const publicRoutes = ["signup", "login"];

  // Allow public routes without authentication
  if (req.body.operationName && publicRoutes.includes(req.body.operationName)) {
    return next();
  }

  // Get token from the authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
