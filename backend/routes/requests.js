const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

// Public: create request
router.post('/', requestController.create);

// Member only: get own requests
router.get('/me', auth, requestController.getByMember);

// Member only: update status
router.patch('/:id/status', auth, requestController.updateStatus);

// Public: get by code (for link)
router.get('/code/:code', requestController.getByCode);

module.exports = router;