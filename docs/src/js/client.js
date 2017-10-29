let socket = null;

function clientInit() {
    // Create WebSocket connection.
    socket = new WebSocket('ws://pacific-cove-25620.herokuapp.com');

    const email = user.email;

    // Listen for messages from the server
    socket.onmessage = event => {
        const swarm_pos = JSON.parse(event.data);
        // For Dave:
        // Use: swarm_pos.x and swarm_pos.y
        // to draw the swarm's position in the UI
    };
}

function clientHandleMove(pos) {
    // Send user email and choice
    socket.send(
        JSON.stringify({
            email: user.email,
            position: pos
        })
    );
}
