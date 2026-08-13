require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(require('./middlewares/notifications'));
app.use(require('./middlewares/flash'));
app.use('/notifications', require('./routes/notificationRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/recherche', require('./routes/rechercheRoutes'));
app.use('/', require('./routes/postRoutes'));
app.use('/posts', require('./routes/postRoutes'));
app.use('/profil', require('./routes/profilRoutes'));

const PORT = process.env.PORT || 3001;

const { sequelize } = require('./models');

sequelize.sync()
  .then(() => {
    console.log('✅ Base de données synchronisée');
    app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
  })
  .catch(err => console.error(' Erreur de connexion DB :', err));
