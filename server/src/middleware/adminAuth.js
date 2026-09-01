const auth = require("./auth");

function adminAuth(req, res, next) {
  return auth(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  });
}

module.exports = adminAuth;
