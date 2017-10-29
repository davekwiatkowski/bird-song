const WebSocket = require('ws');
const hasha = require('hasha');

const server = new WebSocket.Server({ port: 1337 });

// Data
const dict = {}; // List of users and their choices
const choice_counts = {
    'A': 0,
    'B': 0,
    'C': 0,
    'D': 0,
    'NC': 0,
};

server.on('connection', socket => {
    socket.on('message', raw_data => {
        const data = JSON.parse(raw_data);

        // Update our arrays of data
        const key = hasha(data.email);
        if (key in dict) {
            choice_counts[dict[key]]--;
        }

        dict[key] = data.choice;
        choice_counts[data.choice]++;

        // Broadcast to everyone
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                // Send everyone updated data
                client.send(
                    JSON.stringify(choice_counts)
                );
            }
        });
    });
});
