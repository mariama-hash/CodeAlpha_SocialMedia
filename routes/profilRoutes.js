const express = require('express');
const router = express.Router();
const profilController = require('../controllers/profilController');
const upload = require('../middlewares/upload');
const { estConnecte } = require('../middlewares/auth');

router.get('/modifier', estConnecte, profilController.formulaireModifier);
router.post('/modifier', estConnecte, upload.single('avatar'), profilController.modifierProfil);

router.get('/:id/abonnes', estConnecte, profilController.voirAbonnes);
router.get('/:id/abonnements', estConnecte, profilController.voirAbonnements);

router.get('/:id', estConnecte, profilController.voirProfil);
router.post('/:id/follow', estConnecte, profilController.toggleFollow);

module.exports = router;