const userModel = require('../models/userModel');

exports.getUser = async (req, res) => {
  try {
    const user = await userModel.findByUsername(req.params.username);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // hash password ก่อนใช้งานจริง
    const userId = await userModel.createUser(username, password);
    res.status(201).json({ id: userId });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
