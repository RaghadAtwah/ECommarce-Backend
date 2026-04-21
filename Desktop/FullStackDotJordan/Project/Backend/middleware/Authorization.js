const authorize = (text) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.permissions) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      if(! req.user.permissions.includes(text)){
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }
      next();
    } catch(error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

module.exports = authorize;
