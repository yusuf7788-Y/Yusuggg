const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Public klasöründeki statik dosyaları (index.html, style.css, client.js) sun
app.use(express.static('public'));

// Mesaj geçmişini sunucu hafızasında tutmak için bir dizi oluşturalım.
// Sunucu yeniden başladığında bu mesajlar kaybolur.
const messages = [];

io.on('connection', (socket) => {
  console.log('Bir kullanıcı bağlandı.');

  // Yeni bağlanan kullanıcıya mevcut mesaj geçmişini gönder
  socket.emit('message history', messages);

  // Bir kullanıcı mesaj gönderdiğinde
  socket.on('chat message', (msg) => {
    // Gelen mesajı ve gönderen bilgisini bir obje olarak sakla
    const messageData = {
      text: msg,
      // Her kullanıcıya rastgele bir isim verelim
      user: `Kullanıcı-${socket.id.substring(0, 5)}`,
      timestamp: new Date()
    };
    
    // Mesajı geçmişe ekle
    messages.push(messageData);

    // Mesajı tüm bağlı olan istemcilere gönder
    io.emit('chat message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('Bir kullanıcı ayrıldı.');
  });
});

const PORT = process.env.PORT || 3001; // Port numarasını değiştirdik
server.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});