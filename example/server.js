const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 1337 });

// Broadcast to all.
server.broadcast = data => {
    server.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('Test send!');
        }
    });
};

server.on('connection', socket => {
    socket.on('message', data => {
        // Broadcast to everyone else.
        server.clients.forEach(client => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});
