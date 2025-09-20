const { Store, Rating, sequelize, User } = require('../models');

// list stores for normal users (with search & pagination)
const listStores = async (req, res) => {
  const { qName, qAddress, sortBy = 'id', order = 'ASC', limit = 20, offset = 0 } = req.query;
  const where = {};
  if (qName) where.name = { [sequelize.Op.iLike]: `%${qName}%` };
  if (qAddress) where.address = { [sequelize.Op.iLike]: `%${qAddress}%` };

  try {
    // include average rating
    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          attributes: []
        }
      ],
      attributes: {
        include: [
          [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('ratings.rating')), 0), 'avgRating'],
          [sequelize.fn('COUNT', sequelize.col('ratings.id')), 'ratingCount']
        ]
      },
      group: ['Store.id'],
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

const storeDetailForUser = async (req, res) => {
  const storeId = req.params.id;
  const userId = req.user ? req.user.id : null;
  try {
    const store = await Store.findByPk(storeId, {
      include: [
        { model: Rating, include: [{ model: User, attributes: ['id','name','email'] }] }
      ]
    });
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // compute avg
    const avg = await Rating.findOne({
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
      where: { storeId }
    });

    const userRating = userId ? await Rating.findOne({ where: { storeId, userId } }) : null;

    return res.json({ store, avgRating: avg.dataValues.avgRating || 0, userRating: userRating ? userRating.rating : null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listStores, storeDetailForUser };
