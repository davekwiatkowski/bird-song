const WebSocket = require('ws');
const hasha = require('hasha');
const server = new WebSocket.Server({port: (process.env.PORT || 5000)});

// Data
const dict = {}; // List of users and their choices
const choice_counts = {
    'A': 0,
    'B': 0,
    'C': 0,
    'D': 0,
    'NC': 0,
};

function broadcast() {
    try {
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                // Send everyone updated data
                client.send(
                    JSON.stringify(choice_counts)
                );
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}

server.on('connection', socket => {
    let key = null;

    socket.on('message', raw_data => {
        try {
            const data = JSON.parse(raw_data);

            // Update our arrays of data
            key = hasha(data.email);
            if (key in dict) {
                choice_counts[dict[key]]--;
            }

            dict[key] = data.choice;
            choice_counts[data.choice]++;

            // Broadcast to everyone
            broadcast();
        }
        catch (error) {
            console.log(error);
        }
    });

    socket.on('close', () => {
        try {
            choice_counts[dict[key]]--;
            delete dict[key];
            broadcast();
        }
        catch (error) {
            console.log(error);
        }
    });
});
