const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route example
router.get('/me', protect, (req, res) => {
    res.json({
        success: true,
        data: req.user
    });
});

module.exports = router;  
