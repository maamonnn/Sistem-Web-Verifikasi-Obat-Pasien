const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('./db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const upload = multer({ storage: multer.memoryStorage() });

const port = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

// Register user
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Hash gagal' });

    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
      if (err) return res.status(400).json({ error: 'Username sudah ada' });
      res.json({ message: '✅ User terdaftar' });
    });
  });
});

// Login user
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'User tidak ditemukan' });

    bcrypt.compare(password, user.password, (err, same) => {
      if (!same) return res.status(401).json({ error: 'Password salah' });

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login berhasil', token : token, id: user.id, username: user.username });
    });
  });
});

// Middleware autentikasi
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Endpoint dashboard
app.get('/dashboard/:id', authenticate, (req, res) => {
  const requestedId = parseInt(req.params.id);
  const tokenId = req.user.id;

  if (requestedId !== tokenId) {
    return res.status(403).json({ message: 'Akses ditolak: ID tidak cocok' });
  }

  db.get(`SELECT id, username FROM users WHERE id = ?`, [requestedId], (err, user) => {
    if (err) return res.status(500).json({ message: 'Kesalahan server' });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(user);
  });
});

//register face
const faceapi = require('face-api.js');
const canvas = require('canvas');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

app.post('/api/register-face', authenticate, upload.single('image'), (req, res) => {
  const userId = req.user.id;
  const filePath = path.join(__dirname, 'uploads', `${userId}.jpg`);

  fs.writeFileSync(filePath, req.file.buffer);

  db.run(`UPDATE users SET face_file = ? WHERE id = ?`, [`${userId}.jpg`, userId], function (err) {
    if (err) return res.status(500).json({ message: 'Gagal update DB' });
    res.json({ message: 'Wajah berhasil disimpan ke database' });
  });
});


// Load models saat start
(async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
  console.log('✅ face-api.js models loaded');
})();

app.post('/api/verify-face', authenticate, upload.single('image'), async (req, res) => {
  const userId = req.user.id;
  const userImagePath = path.join(__dirname, 'uploads', `${userId}.jpg`);
  if (!fs.existsSync(userImagePath)) {
    return res.status(404).json({ message: 'Wajah belum terdaftar' });
  }

  const referenceImage = await canvas.loadImage(userImagePath);
  const uploadedImage = await canvas.loadImage(req.file.buffer);

  const refDesc = await faceapi.computeFaceDescriptor(referenceImage);
  const inputDesc = await faceapi.computeFaceDescriptor(uploadedImage);

  const distance = faceapi.euclideanDistance(refDesc, inputDesc);

  if (distance < 0.3) {
    return res.json({ message: 'Verifikasi wajah berhasil', distance });
  } else {
    return res.status(401).json({ message: 'Wajah tidak cocok', distance });
  }
});





wss.on("connection", (ws) => {
  const interval = setInterval(() => {
    const now = new Date().toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour12: false
  });
    ws.send(JSON.stringify({time: now}));
  }, 1000);

  ws.on("close", () => {
    clearInterval(interval);
  });
});

server.listen(port, () => {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();

  console.log('Server berjalan di:');
  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        console.log(`→ http://${net.address}:${port}`);
      }
    }
  }
});


