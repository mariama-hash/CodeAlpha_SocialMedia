const express = require('express');
const router = express.Router();
const rechercheController = require('../controllers/rechercheController');
const { estConnecte } = require('../middlewares/auth');

router.get('/', estConnecte, rechercheController.rechercher);

module.exports = router;