// pages/api/auth/login.js
import {conexionDb} from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
conexionDb();

export default async function handler(req, res) {


  const { email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
