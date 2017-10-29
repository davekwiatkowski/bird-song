const WebSocket = require('ws');
const hasha = require('hasha');

const server = new WebSocket.Server({ port: 1337 });

// Data arrays
var dict = {};

server.on('connection', socket => {
    dict[''] = null;

    socket.on('message', data => {
        // Update our arrays of data

        // Broadcast to everyone
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                // Send everyone updated data
                client.send(data);
            }
        });
    });
});
