let socket = null;

function clientInit() {
    // Create WebSocket connection.
    socket = new WebSocket('ws://pacific-cove-25620.herokuapp.com');

    const email = user.email;

    // Listen for messages from the server
    socket.onmessage = event => {
        const swarm_pos = JSON.parse(event.data);
        console.log(swarm_pos);

        // For Dave:
        // Use: swarm_pos.x and swarm_pos.y
        // to draw the swarm's position in the UI
        const x = swarm_pos.x - nipple_pos.x;
        const y = swarm_pos.y - nipple_pos.y;
        $(".swarm").css({
            'transform': `translate(${x}px, ${y}px)`
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
