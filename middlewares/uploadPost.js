const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/posts'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `post_${req.session.utilisateur.id}_${Date.now()}${ext}`);
  }
});

const uploadPost = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4 Mo max
  fileFilter: (req, file, cb) => {
    const typesAutorises = ['image/jpeg', 'image/png', 'image/webp'];
    if (typesAutorises.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format non supporté (JPEG, PNG ou WEBP uniquement)'));
    }
  }
});

module.exports = uploadPost;