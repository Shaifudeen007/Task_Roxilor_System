function permit(...allowedRoles) {
  return (req, res, next) => {
    const { user } = req;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}

module.exports = { permit };
