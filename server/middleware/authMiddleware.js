export const protect = (req, res, next) => {
  // Temporary middleware until authentication is implemented
  console.log("Auth middleware placeholder called");
  next();
};
