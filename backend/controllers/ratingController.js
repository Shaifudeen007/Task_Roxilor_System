const { Rating, Store, User } = require('../models');

const submitOrUpdateRating = async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be integer 1-5' });

  try {
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const existing = await Rating.findOne({ where: { userId, storeId } });
    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({ message: 'Rating updated', rating: existing });
    } else {
      const r = await Rating.create({ userId, storeId, rating });
      return res.status(201).json({ message: 'Rating created', rating: r });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getRatingsForStoreOwner = async (req, res) => {
  const ownerId = req.user.id;

  try {
    // find stores owned by ownerId
    const stores = await Store.findAll({ where: { ownerId }});
    const storeIds = stores.map(s => s.id);

    const ratings = await Rating.findAll({
      where: { storeId: storeIds },
      include: [{ model: User, attributes: ['id','name','email'] }, { model: Store }]
    });

    // compute average per store
    const averages = {};
    for (const s of stores) {
      const avg = await Rating.findOne({
        where: { storeId: s.id },
        attributes: [[Rating.sequelize.fn('AVG', Rating.sequelize.col('rating')), 'avgRating']]
      });
      averages[s.id] = avg && avg.dataValues ? Number(avg.dataValues.avgRating) || 0 : 0;
    }

    return res.json({ ratings, averages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitOrUpdateRating, getRatingsForStoreOwner };
