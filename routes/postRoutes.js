const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const interactionController = require('../controllers/interactionController');
const { estConnecte } = require('../middlewares/auth');

router.get('/', estConnecte, postController.fil);
router.post('/creer', estConnecte, postController.creerPost);
router.post('/supprimer/:id', estConnecte, postController.supprimerPost);

router.get('/:id', estConnecte, interactionController.voirPost);
router.post('/like/:id', estConnecte, interactionController.toggleLike);
router.post('/:id/commenter', estConnecte, interactionController.ajouterCommentaire);

module.exports = router;