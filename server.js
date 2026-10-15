const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static('public'));

// Oyuncuları tutacağımız liste
const players = {};

io.on('connection', (socket) => {
  console.log('Bir oyuncu bağlandı:', socket.id);

  // Yeni oyuncu katıldığında listeye ekle
  players[socket.id] = { id: socket.id, x: 0, y: 0, name: 'Oyuncu' };

  // Diğer oyunculara yeni gelen oyuncuyu bildir
  socket.broadcast.emit('yeni-oyuncu', players[socket.id]);

  // Mevcut oyuncuların listesini yeni gelen kişiye gönder
  socket.emit('mevcut-oyuncular', players);

  // Oyuncu hareket ettiğinde (koordinat değiştiğinde)
  socket.on('oyuncu-hareket', (data) => {
    if (players[socket.id]) {
      players[socket.id].x = data.x;
      players[socket.id].y = data.y;
      // Diğer oyunculara bu oyuncunun yeni yerini yay
      socket.broadcast.emit('oyuncu-konum-guncelle', players[socket.id]);
    }
  });

  // Sohbet mesajı gönderildiğinde
  socket.on('chat-mesaji', (data) => {
    // Mesajıherkese (gönderen dahil veya hariç) ilet
    io.emit('chat-mesaji', { id: socket.id, name: data.name, mesaj: data.mesaj });
  });

  // Oyuncu oyundan çıktığında
  socket.on('disconnect', () => {
    console.log('Oyuncu ayrıldı:', socket.id);
    delete players[socket.id];
    io.emit('oyuncu-ayrildi', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
