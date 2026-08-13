const { Utilisateur, Follow } = require('../models');
const { Op } = require('sequelize');

exports.rechercher = async (req, res) => {
  try {
    const q = req.query.q || '';
    const utilisateurConnecteId = req.session.utilisateur.id;

    let resultats = [];
    if (q.trim() !== '') {
      const utilisateurs = await Utilisateur.findAll({
        where: {
          nom: { [Op.like]: `%${q}%` },
          id: { [Op.ne]: utilisateurConnecteId }
        },
        limit: 30
      });

      const mesAbonnements = await Follow.findAll({ where: { follower_id: utilisateurConnecteId } });
      const suivisIds = mesAbonnements.map(f => f.following_id);

      resultats = utilisateurs.map(u => ({
        ...u.toJSON(),
        estSuivi: suivisIds.includes(u.id)
      }));
    }

    res.render('recherche/resultats', {
      q,
      resultats,
      utilisateur: req.session.utilisateur
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};