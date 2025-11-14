import jwt from 'jsonwebtoken'

export const protect = (req, res, next) => {

  const TOKEN = req.headers.authorization? req.headers.authorization.split(" ")[1] : null

  if (!TOKEN) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {

    const decoded = jwt.verify(TOKEN, process.env.JWT_SECRET)

    req.user = decoded

    next()

  } catch (error) {

    return res.status(401).json({ message: "Invalid Token" })

  }
}
