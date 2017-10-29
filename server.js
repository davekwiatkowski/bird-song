const WebSocket = require('ws');
const hasha = require('hasha');
const server = new WebSocket.Server({port: (process.env.PORT || 5000)});

// Data
const dict = {}; // List of users and their choices
let size = 0;
let swarm_pos = {
    x: 0,
    y: 0,
};

function broadcast() {
    try {
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                console.log(swarm_pos);

                // Send everyone updated data
                client.send(
                    JSON.stringify(swarm_pos)
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
            const new_pos = data.position;

            // Update our arrays of data
            key = hasha(data.email);

            if (key in dict) {
                const old_pos = dict[key];
                swarm_pos.x = ((swarm_pos.x * size) - old_pos.x + new_pos.x) / size;
                swarm_pos.y = ((swarm_pos.y * size) - old_pos.y + new_pos.y) / size;
            }
            else {
                size++;
                swarm_pos.x = ((swarm_pos.x * size) + new_pos.x) / size;
                swarm_pos.y = ((swarm_pos.y * size) + new_pos.y) / size;
            }

            dict[key] = data.position;

            // Broadcast to everyone
            broadcast();
        }
        catch (error) {
            console.log(error);
        }
    });

    socket.on('close', () => {
        try {
            size--;
            if (size == 0) {
                swarm_pos.x = 0;
                swarm_pos.y = 0;
            }
            else {
                if (key in dict) {
                    const old_pos = dict[key];
                    swarm_pos.x = ((swarm_pos.x * size) - old_pos.x) / size;
                    swarm_pos.y = ((swarm_pos.y * size) - old_pos.y) / size;
                }
            }
            if (key in dict) {
                delete dict[key];
            }
            broadcast();
        }
        catch (error) {
            console.log(error);
        }
    });
});
