const isAuth = (req, res, next) => {
  if (req.user && req.user._id) {
    next();
  } else {
    res.status(401).send("Не авторизован");
  }
};

module.exports = {
  isAuth,
};
