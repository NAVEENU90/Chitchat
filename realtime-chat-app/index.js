const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (index.html, style.css, etc.)
app.use(express.static(path.join(__dirname)));

// Socket.IO events
io.on('connection', (socket) => {
    console.log('✅ User connected');

    socket.on('chat', (data) => {
        data.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        data.date = new Date().toLocaleDateString();
        console.log("📩 Received:", data);
        io.emit('chat', data);
    });
});

// Use Render's provided PORT or default to 5000 locally
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
