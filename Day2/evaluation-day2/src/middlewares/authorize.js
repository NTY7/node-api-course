function authorize(allowedRoles = ['user', 'admin']) {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Accès interdit pour ce rôle'
      });
    }
    next();
  };
}

module.exports = authorize;
