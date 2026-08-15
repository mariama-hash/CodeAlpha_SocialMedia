# DevConnect — Social Media Platform (CodeAlpha Task 2)

A mini social media platform built as part of the **Full Stack Development Internship** at **CodeAlpha**, designed for students and developers to share their learning progress, tips, and questions.

## 🚀 Features

**Core (CodeAlpha requirements)**
- **Authentication**: user registration, login, logout (sessions + bcrypt)
- **Posts**: create, delete, view posts in a live feed
- **Likes**: toggle like/unlike on posts
- **Comments**: comment on posts
- **User profiles**: bio, avatar, follower/following stats
- **Follow system**: follow/unfollow other users

**Extended features**
- **Image posts**: attach an image to a post (Multer upload)
- **Dislikes**: toggle dislike, mutually exclusive with likes
- **Threaded replies**: reply to a comment, with mention support for back-and-forth discussion
- **Comment likes**: like individual comments/replies
- **Follow shortcuts**: follow/unfollow directly from the feed and from followers/following lists
- **User search**: find and follow other users by name
- **Notifications inbox**: unread badge covering likes, comments, replies, comment likes, follows, and new posts from followed users
- **Custom SVG icons** and fully responsive layout (mobile-first fixes)

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL, Sequelize (ORM)
- **Frontend**: EJS (server-side templates), HTML/CSS/JS
- **Authentication**: bcrypt, express-session
- **File uploads**: Multer (avatars and post images)

## 📂 Project Structure

CodeAlpha_SocialMedia/
├── config/ # Database configuration
├── controllers/ # Business logic
├── middlewares/ # Auth guard, file upload handling, notification counter
├── models/ # Sequelize models
├── routes/ # Express routes
├── views/ # EJS templates (+ reusable partials, SVG icons)
├── public/ # CSS, images, user-uploaded avatars and post images
└── server.js # Entry point


## ⚙️ Installation

1. Clone the repository
```bash
git clone https://github.com/mariama-hash/CodeAlpha_SocialMedia.git
cd CodeAlpha_SocialMedia
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file at the project root:

PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=codealpha_socialmedia
SESSION_SECRET=change_this_secret_key


4. Create an empty MySQL database named `codealpha_socialmedia`

5. Start the server
```bash
npm run dev
```

The app will be running at `http://localhost:3001`

##  Author

**SEYDOU Zouwéra** — L2 Software Engineering Student, ESIG Global Success (Lomé, Togo)
Full Stack Development Internship — CodeAlpha (August 10 – September 10, 2026)

---
*Project completed as part of the CodeAlpha internship program.*