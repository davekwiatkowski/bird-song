let socket = null;

function getTruePosition(pos) {
    if (nipple_pos === null) {
        return {x: 0, y: 0};
    }

    return {
        x: pos.x - nipple_pos.x,
        y: pos.y - nipple_pos.y
    };
}

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
        const true_pos = getTruePosition(swarm_pos);

        console.log(true_pos);

        $(".swarm").css({
            'transform': `translate(${true_pos.x}px, ${true_pos.y}px)`
        });
    };
}

function clientHandleMove(pos) {
    // Send user email and position
    socket.send(
        JSON.stringify({
            email: user.email,
            position: getTruePosition(pos)
        })
    )
}
