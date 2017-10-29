// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:1337');

// Connection opened
socket.addEventListener('open', function (event) {
    // Pass
});

// Listen for messages
socket.addEventListener('message', function (event) {
    var text = event.data;
    var para = document.createElement("p");
    var t = document.createTextNode(text);
    para.appendChild(t);
    document.body.appendChild(para);
});

handle = data => {
    socket.send(data);
}
