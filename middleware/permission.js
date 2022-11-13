const permission = (...allowedRoles) => {
  return (req, res, next) => {
    const { user } = req;
    if (user && allowedRoles.includes(user.roleId)) {
      return next(); // if type permission is allowed, so continue the request using the next middleware
    }
    return res.status(403).json({ message: 'Forbidden' });
  };
}

module.exports = permission;