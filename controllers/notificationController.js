const { Notification, Utilisateur, Post } = require('../models');

exports.voir = async (req, res) => {
  try {
    const utilisateur_id = req.session.utilisateur.id;

    const notifications = await Notification.findAll({
      where: { destinataire_id: utilisateur_id },
      include: [{ model: Utilisateur, as: 'Source' }, { model: Post }],
      order: [['id', 'DESC']]
    });

    await Notification.update(
      { lu: true },
      { where: { destinataire_id: utilisateur_id, lu: false } }
    );

    res.render('notifications/liste', {
      notifications,
      utilisateur: req.session.utilisateur
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
};