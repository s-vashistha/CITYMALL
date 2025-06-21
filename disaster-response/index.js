const express = require('express');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
require('dotenv').config();

const disasterRoutes = require('./routes/disasterRoutes');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Inject io for WebSocket broadcasting
app.set('io', io);

// Routes
app.use('/disasters', disasterRoutes);

// Root
app.get('/', (req, res) => res.send('Disaster Response API is live.'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
