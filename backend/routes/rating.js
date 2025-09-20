const express = require('express');
const router = express.Router();
const ratingCtrl = require('../controllers/ratingController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { permit } = require('../middlewares/roleMiddleware');

// authenticated users only
router.post('/:storeId', authenticateToken, permit('user','admin'), ratingCtrl.submitOrUpdateRating);

// for owners to view ratings on their stores
router.get('/owner/ratings', authenticateToken, permit('owner'), ratingCtrl.getRatingsForStoreOwner);

module.exports = router;
