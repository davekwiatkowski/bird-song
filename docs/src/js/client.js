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
        $(".swarm").css({
            top: "calc(50% - 20px)",
            left: "calc(50% - 20px)",
            transform: `translateX(${swarm_pos.x}px) translateY(${swarm_pos.y}px)`
        });
    };
}

function clientHandleMove(pos) {
    // Send user email and position
    socket.send(
        JSON.stringify({
            email: user.email,
            position: pos
        })
    )
}
