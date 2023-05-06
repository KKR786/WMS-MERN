const requireSuperAdmin = (req, res, next) => {
    
    if (!req.user) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    
    if (req.user.role !== 'Super-Admin') {
      return res.status(403).json({ error: 'You do not have permission to perform this action' });
    }
    
    next();
  };
  
  module.exports = requireSuperAdmin;
  