export function validatePostRegister(req, res, next) {
  const { username, password, firstName, lastName } = { ...req.body };
  if (!username || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing a required parameter." });
  }
  next();
}

export function validatePostLogin(req, res, next) {
  const { username, password } = { ...req.body };
  if (!username || !password) {
    return res.status(400).json({ message: "Missing a required parameter." });
  }
  next();
}
