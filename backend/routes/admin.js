const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { permit } = require('../middlewares/roleMiddleware');

router.use(authenticateToken);
router.use(permit('admin'));

router.post('/users', adminCtrl.addUser);
router.post('/stores', adminCtrl.addStore);
router.get('/users', adminCtrl.listUsers);
router.get('/stores', adminCtrl.listStores);
router.get('/dashboard', adminCtrl.dashboard);

module.exports = router;
