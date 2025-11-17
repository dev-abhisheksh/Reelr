# 🚀 Reelr Chat  
A real-time chat application built with **Node.js**, **Express**, **Socket.IO**, and **MongoDB**.

---

## ✨ Features
- 🔐 JWT Authentication  
- 💬 Real-time messaging with Socket.IO  
- 👤 User online/offline status  
- 📡 Scalable backend architecture  
- 📁 Clean folder structure  
- ⚡ Fast API responses  

---

## 🛠 Tech Stack
**Frontend:** React / Next.js (optional)  
**Backend:** Node.js, Express  
**Database:** MongoDB  
**Real-time:** Socket.IO  
**Auth:** JWT  
**Env:** Nodemon, dotenv  
**Other:** CORS, cookie-parser  

---

## 📂 Folder Structure

root/
├── server.js
├── package.json
├── config/
│ └── db.js
├── controllers/
│ └── user.controller.js
├── middleware/
│ └── auth.js
├── models/
│ ├── User.js
│ └── Message.js
└── routes/
├── user.routes.js
└── message.routes.js

yaml
Copy code

---

## ⚙️ Installation

```bash
git clone https://github.com/dev-abhisheksh/Reelr-chat.git
cd Reelr-chat
npm install
npm run dev
Add a .env file:

env
Copy code
MONGO_URI=your_mongo_url
JWT_SECRET=your_secret_key
PORT=8000
🚀 Running the App
bash
Copy code
npm run dev
Server will start at:
http://localhost:8000

📡 API Endpoints
Auth
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user

Messages
Method	Endpoint	Description
GET	/api/messages/:id	Get chat history
POST	/api/messages	Send new message

Users
Method	Endpoint	Description
GET	/api/users	All users
GET	/api/users/:id	User details

📸 Screenshots
Add your screenshots here
Example:

scss
Copy code
![Home Page](./screenshots/home.png)
![Chat Page](./screenshots/chat.png)
📈 Future Improvements
⏳ Typing indicators

📷 Image & file sharing

🛡 Rate limiting + security improvements

📱 UI web + mobile redesign

🤝 Contributing
Contributions, issues, and feature requests are welcome!

📜 License
This project is licensed under the MIT License.

yaml
Copy code

---

# 🔥 **How to Make It Beautiful**
Don’t overthink — follow these rules:

### ✔️ Add spacing  
Use blank lines between sections. Makes it readable.

### ✔️ Use emojis (but not too many)  
Makes the README feel alive.

### ✔️ Add badges  
Go to https://shields.io and add these:

```md
![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-black?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)
✔️ Add a banner
Make a simple banner in Canva → export → add:

md
Copy code
![Banner](./assets/banner.png)