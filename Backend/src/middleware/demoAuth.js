import jwt from 'jsonwebtoken';

export const isDemoModeEnabled = () => {
  return process.env.DEMO_MODE_ENABLED !== 'false';
};

export const getDemoJwtSecret = () => {
  return (
    process.env.DEMO_JWT_SECRET ||
    'fixmate_demo_secret_isolated_2026_recruiter_preview'
  );
};

// Middleware: Guard that ensures demo mode is enabled on the server
export const checkDemoEnabled = (req, res, next) => {
  if (!isDemoModeEnabled()) {
    return res.status(403).json({
      message: 'Demo mode is currently disabled by the system administrator.',
    });
  }
  next();
};

// Middleware: Authenticate demo tokens signed with DEMO_JWT_SECRET
export const protectDemo = async (req, res, next) => {
  if (!isDemoModeEnabled()) {
    return res.status(403).json({
      message: 'Demo mode is currently disabled by the system administrator.',
    });
  }

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verifies STRICTLY with DEMO_JWT_SECRET
      // A standard production token signed with JWT_SECRET will automatically fail here
      const decoded = jwt.verify(token, getDemoJwtSecret());

      if (!decoded.isDemo) {
        return res.status(401).json({ message: 'Invalid demo session' });
      }

      req.user = {
        _id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        isDemo: true,
      };

      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Demo session expired. Please enter demo mode again.' });
      }
      return res.status(401).json({ message: 'Not authorized, invalid demo token' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no demo token provided' });
};

// Middleware: Role-based authorization within demo sessions
export const authorizeDemo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Demo authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Demo role '${req.user.role}' is not authorized for this resource`,
      });
    }

    next();
  };
};

