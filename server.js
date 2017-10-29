const WebSocket = require('ws');
const hasha = require('hasha');
const server = new WebSocket.Server({port: (process.env.PORT || 5000)});

// Data
let dict = {}; // List of users and their choices
let size = 0;
let swarm_pos = {
    x: 0,
    y: 0,
};

// Round info
const max_round_time = 40; // 40 Seconds
let round_time = 0;
let in_round = false;
let wait = null;

function setSwarmPos(newx, newy) {
    if (newx != null && newy != null && !isNaN(newx) && !isNaN(newy) && Number.isFinite(newx) && Number.isFinite(newy)) {
        swarm_pos.x = newx;
        swarm_pos.y = newy;
    }
    else {
        // console.log('Could not assign: ', newx, newy);
    }
}

function getSwarmDeg() {
    return Math.atan2(swarm_pos.y, swarm_pos.x) * 180 / Math.PI + 180;
}

function selectWinner() {
    const deg = getSwarmDeg();

    if (deg >= 54 && deg < 126) {
        return 0; // 1
    }
    else if (deg >= 126 && deg < 198) {
        return 4; // 5
    }
    else if (deg >= 198 && deg < 270) {
        return 3; // 4
    }
    else if (deg >= 270 && deg < 342) {
        return 2; // 3
    }
    else {
        return 1; // 2
    }
}

function clear() {
    // Reset all vars
    if (wait != null) {
        clearInterval(wait);
    }
    round_time = 0;
    in_round = false;

    // console.log('Clearing to 0, 0 from: ', swarm_pos);
}

function createRound() {
    if (in_round) {
        return;
    }

    clear();

    // console.log('Trying to make a round...');
    round_time = new Date();
    in_round = true;
    swarm_pos = {
        x: 0,
        y: 0,
    };

    try {
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                // Send everyone updated data
                client.send(
                    JSON.stringify({
                        'status': 'begin',
                        'data': round_time
                    })
                );
            }
        });
    }
    catch (error) {
        console.log(error);
    }

    wait = setInterval(() => {
        const time_now = new Date();

        // Round is over
        if (Math.floor((time_now.getTime() - round_time.getTime()) / 1000) >= max_round_time) {
            clear();

            const winner = selectWinner();
            broadcastWinner(winner);

            setTimeout(() => {
                if (size >= 1) {
                    createRound();
                }
            }, 10 * 1000);
        }
    }, 1000);
}

function broadcast() {
    // console.log('Tring to broadcast. INrdoun is: ', in_round);
    if (!in_round) {
        return;
    }

    try {
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                // Send everyone updated data
                client.send(
                    JSON.stringify({
                        'status': 'update',
                        'data': swarm_pos
                    })
                );
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}

function broadcastWinner(winner) {
    try {
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                // Send everyone updated data
                client.send(
                    JSON.stringify({
                        'status': 'winner',
                        'data': winner
                    })
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
                console.log(173);
                setSwarmPos(
                    ((swarm_pos.x * size) - old_pos.x + new_pos.x) / size,
                    ((swarm_pos.y * size) - old_pos.y + new_pos.y) / size
                );
            }
            else {
                size++;
                if (in_round) {
                    try {
                        server.clients.forEach(client => {
                            if (client.readyState === WebSocket.OPEN) {
                                // Send everyone updated data
                                client.send(
                                    JSON.stringify({
                                        'status': 'begin',
                                        'data': (new Date() - round_time)
                                    })
                                );
                            }
                        });
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                else {
                    createRound();
                }
                // console.log(181);
                setSwarmPos(
                    ((swarm_pos.x * size) + new_pos.x) / size,
                    ((swarm_pos.y * size) + new_pos.y) / size
                );
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
                clear();
            }
            else {
                if (key in dict) {
                    const old_pos = dict[key];
                    // console.log(206);
                    setSwarmPos(
                        ((swarm_pos.x * size) - old_pos.x) / size,
                        ((swarm_pos.y * size) - old_pos.y) / size
                    );
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
