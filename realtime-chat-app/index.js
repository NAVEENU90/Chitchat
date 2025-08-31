const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    let extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.css': contentType = 'text/css'; break;
        case '.js': contentType = 'text/javascript'; break;
    }

    fs.readFile(path.join(__dirname, filePath), (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found: ' + filePath);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

const { Server } = require('socket.io');
const io = new Server(server);

const port = 5000;

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('chat', (data) => {
        data.time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        data.date = new Date().toLocaleDateString();
        console.log(" Received:", data);
        io.emit('chat', data);
    });
});

server.listen(port, () => {
    console.log(` Server running at http://localhost:${port}`);
});
