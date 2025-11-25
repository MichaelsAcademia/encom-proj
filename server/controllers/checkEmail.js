import User from "../models/users.js";

export const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ exists: false });

    const user = await User.findOne({ email });

    return res.json({ exists: !!user });
  } catch (err) {
    return res.status(500).json({ exists: false });
  }
};
