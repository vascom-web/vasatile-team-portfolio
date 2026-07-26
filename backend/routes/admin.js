const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const adminController = require('../controllers/adminController');

// Login route with validation
router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  adminController.login
);

module.exports = router;