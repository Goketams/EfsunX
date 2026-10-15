const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Bir oyuncu bağlandı:', socket.id);

  socket.on('oyuncu-hamlesi', (data) => {
    socket.broadcast.emit('oyuncu-guncellemesi', data);
  });

  socket.on('disconnect', () => {
    console.log('Oyuncu ayrıldı:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});