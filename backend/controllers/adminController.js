const { User, Store, Rating, sequelize } = require('../models');
const { nameValid, emailValid, passwordValid, addressValid } = require('../utils/validators');

// Add new user (admin creates normal users or admins)
const addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  if (!nameValid(name)) return res.status(400).json({ message: 'Name must be 20-60 characters' });
  if (!emailValid(email)) return res.status(400).json({ message: 'Invalid email' });
  if (!passwordValid(password)) return res.status(400).json({ message: 'Password must be 8-16, uppercase+special' });
  if (address && !addressValid(address)) return res.status(400).json({ message: 'Address too long' });
  if (role && !['admin','user','owner'].includes(role)) return res.status(400).json({ message: 'Invalid role' });

  try {
    const existing = await User.findOne({ where: { email }});
    if (existing) return res.status(400).json({ message: 'Email exists' });
    const u = await User.create({ name, email, password, address, role: role || 'user' });
    return res.status(201).json({ user: u.toJSON() });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add a new store
const addStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  if (!name || name.trim().length === 0) return res.status(400).json({ message: 'Store name required' });
  if (email && !emailValid(email)) return res.status(400).json({ message: 'Invalid email' });
  if (address && !addressValid(address)) return res.status(400).json({ message: 'Address too long' });

  try {
    const store = await Store.create({ name, email, address, ownerId });
    return res.status(201).json({ store });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List users with filters
const listUsers = async (req, res) => {
  const { name, email, address, role, sortBy = 'id', order = 'ASC', limit = 50, offset = 0 } = req.query;
  const where = {};
  if (name) where.name = { [sequelize.Op.iLike]: `%${name}%` };
  if (email) where.email = { [sequelize.Op.iLike]: `%${email}%` };
  if (address) where.address = { [sequelize.Op.iLike]: `%${address}%` };
  if (role) where.role = role;
  try {
    const users = await User.findAndCountAll({
      where,
      order: [[sortBy, order]],
      limit: Number(limit),
      offset: Number(offset),
      attributes: ['id','name','email','address','role']
    });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List stores with their average rating
const listStores = async (req, res) => {
  const { name, email, address, sortBy = 'id', order = 'ASC', limit = 50, offset = 0 } = req.query;
  const where = {};
  if (name) where.name = { [sequelize.Op.iLike]: `%${name}%` };
  if (email) where.email = { [sequelize.Op.iLike]: `%${email}%` };
  if (address) where.address = { [sequelize.Op.iLike]: `%${address}%` };
  try {
    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          attributes: []
        },
        {
          model: User,
          as: 'owner',
          attributes: ['id','name','email']
        }
      ],
      attributes: {
        include: [
          [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('ratings.rating')), 0), 'avgRating'],
          [sequelize.fn('COUNT', sequelize.col('ratings.id')), 'ratingCount']
        ]
      },
      group: ['Store.id','owner.id'],
      order: [[sortBy, order]],
      limit: Number(limit),
      offset: Number(offset),
      subQuery: false
    });
    return res.json(stores);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const dashboard = async (req, res) => {
  try {
    const userCount = await User.count();
    const storeCount = await Store.count();
    const ratingCount = await Rating.count();
    return res.json({ userCount, storeCount, ratingCount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addUser, addStore, listUsers, listStores, dashboard };
