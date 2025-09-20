const express = require('express');
const router = express.Router();
const storeCtrl = require('../controllers/storeController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// optional auth — store listing is public but users may be logged in to view their rating
router.get('/', storeCtrl.listStores);
router.get('/:id', authenticateToken, storeCtrl.storeDetailForUser);

module.exports = router;
