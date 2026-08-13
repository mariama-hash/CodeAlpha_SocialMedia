const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { estConnecte } = require('../middlewares/auth');

router.get('/', estConnecte, notificationController.voir);

module.exports = router;