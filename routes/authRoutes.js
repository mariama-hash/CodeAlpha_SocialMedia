const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/inscription', authController.formulaireInscription);
router.post('/inscription', authController.inscrire);

router.get('/connexion', authController.formulaireConnexion);
router.post('/connexion', authController.connecter);

router.get('/deconnexion', authController.deconnecter);

module.exports = router;