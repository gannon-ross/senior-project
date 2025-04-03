import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = {
  /**
   * Middleware to protect routes that require authentication
   */
  protect: (req, res, next) => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized to access this route'
        });
      }

      // Extract token
      const token = authHeader.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user to request
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  },

  /**
   * Middleware to restrict access based on user role
   * @param {...string} roles - Roles allowed to access the route
   */
  authorize: (...roles) => {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `User role ${req.user ? req.user.role : 'undefined'} is not authorized to access this route`
        });
      }

      next();
    };
  }
};

export default authMiddleware;
