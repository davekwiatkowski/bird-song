let socket = null;

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
const throttle = (func, wait, options) => {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = () => {
        previous = options.leading === false ? 0 : _.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };

    var throttled = () => {
        var now = _.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };

    throttled.cancel = () => {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };

    return throttled;
};

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
            transform: `translateX(${swarm_pos.x}px) translateY(${swarm_pos.y}px)`
        });
    };
}

function clientHandleMove(pos) {
    // Send user email and choice
    throttle(socket.send(
        JSON.stringify({
            email: user.email,
            position: pos
        })
    ), 250);
}
