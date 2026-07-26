const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const memberController = require('../controllers/memberController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Public routes
router.get('/', memberController.getAll);
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
  memberController.login
);

// Admin only routes
router.post('/register',
  auth,
  adminAuth,
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  memberController.register
);
router.put('/:id', auth, adminAuth, memberController.update);
router.delete('/:id', auth, adminAuth, memberController.delete);
router.patch('/:id/toggle', auth, adminAuth, memberController.toggleActive);

module.exports = router;