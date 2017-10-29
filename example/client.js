// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:1337');

// Connection opened
// socket.addEventListener('open', event => {
// });

// Listen for messages from the server
socket.addEventListener('message', event => {
    const updated = event.data;
});

handle = data => {
    // Send user email and choice
    socket.send({
        email: ,
        choice: data
    });
}
