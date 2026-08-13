const { Notification } = require('../models');

async function compteurNotifications(req, res, next) {
  if (req.session.utilisateur) {
    try {
      const count = await Notification.count({
        where: { destinataire_id: req.session.utilisateur.id, lu: false }
      });
      res.locals.unreadCount = count;
    } catch (err) {
      res.locals.unreadCount = 0;
    }
  } else {
    res.locals.unreadCount = 0;
  }
  next();
}

module.exports = compteurNotifications;