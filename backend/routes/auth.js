const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);
router.post('/change-password', authenticateToken, authCtrl.changePassword);

module.exports = router;
