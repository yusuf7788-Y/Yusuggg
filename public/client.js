const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

function displayMessage(msgData) {
    const item = document.createElement('li');
    const userSpan = document.createElement('strong');
    userSpan.textContent = `${msgData.user}: `;
    
    item.appendChild(userSpan);
    item.append(msgData.text);
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}

// Sunucudan gelen mesaj geçmişini işle
socket.on('message history', (history) => {
    messages.innerHTML = ''; // Mevcut listeyi temizle
    history.forEach(msgData => {
        displayMessage(msgData);
    });
});

// Sunucudan yeni bir mesaj geldiğinde
socket.on('chat message', (msgData) => {
    displayMessage(msgData);
});

// Form gönderildiğinde
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});