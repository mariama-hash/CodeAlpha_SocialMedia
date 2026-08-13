const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const interactionController = require('../controllers/interactionController');
const uploadPost = require('../middlewares/uploadPost');
const { estConnecte } = require('../middlewares/auth');

router.get('/', estConnecte, postController.fil);
router.post('/creer', estConnecte, uploadPost.single('image'), postController.creerPost);
router.post('/supprimer/:id', estConnecte, postController.supprimerPost);

router.get('/:id', estConnecte, interactionController.voirPost);
router.post('/like/:id', estConnecte, interactionController.toggleLike);
router.post('/dislike/:id', estConnecte, interactionController.toggleDislike);
router.post('/:id/commenter', estConnecte, interactionController.ajouterCommentaire);
router.post('/commentaire/supprimer/:id', estConnecte, interactionController.supprimerCommentaire);
router.post('/commentaire/like/:id', estConnecte, interactionController.toggleLikeCommentaire);

module.exports = router;