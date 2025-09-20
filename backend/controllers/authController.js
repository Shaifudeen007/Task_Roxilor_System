const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { nameValid, emailValid, passwordValid, addressValid } = require('../utils/validators');

require('dotenv').config();

const signup = async (req, res) => {
  const { name, email, password, address } = req.body;
  if (!nameValid(name)) return res.status(400).json({ message: 'Name must be 20-60 characters' });
  if (!emailValid(email)) return res.status(400).json({ message: 'Invalid email' });
  if (!passwordValid(password)) return res.status(400).json({ message: 'Password must be 8-16 chars, include uppercase and a special char' });
  if (address && !addressValid(address)) return res.status(400).json({ message: 'Address too long' });

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password, address, role: 'user' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: user.toJSON() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email & password required' });

  try {
    const user = await User.findOne({ where: { email }});
    if (!user || !user.validPassword(password)) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: user.toJSON() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;
  if (!user.validPassword(oldPassword)) return res.status(400).json({ message: 'Old password incorrect' });
  if (!passwordValid(newPassword)) return res.status(400).json({ message: 'New password must satisfy complexity' });
  try {
    user.password = newPassword;
    await user.save();
    return res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login, changePassword };
