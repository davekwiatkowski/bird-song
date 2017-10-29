let socket = null;
let time = 40;

function countDown() {
    let timer = setInterval(function () {
        --time;
        if (time < 0) {
            time = 0;
            clearInterval(timer);
        }

        // $("#time").text("Time: " + time + "s");
    }, 1000);
}

function getTruePosition(pos) {
    if (nipple_pos === null) {
        return { x: 0, y: 0 };
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
        const parsed_data = JSON.parse(event.data);

        // Update
        if (parsed_data['status'] == 'update') {
            // console.log('Received message from server: ', parsed_data['data']);
            const swarm_pos = parsed_data['data'];
            // console.log(swarm_pos);
            $(".swarm").css({
                'transform': `translate(${swarm_pos.x}px, ${swarm_pos.y}px)`
            });
        } else if (parsed_data['status'] == 'begin') {
            $(".bird-tune").css("color", "#ccc");
            $(".bird-tune").css("border-bottom", "1px solid #ccc");
            // console.log("Beginning.");
            // new_date = new Date();
            // time = (new_date.getTime() - new Date(parsed_data['data']).getTime()) / 1000;
            // countDown();
        }
        else { // Winner
            let winner = parsed_data['data'];
            winner = winner === 1 ? 4 : winner === 2 ? 3 : winner;
            $(TUNES[winner].obj).css("color", "#5fa");
            $(TUNES[winner].obj).css("border-bottom", "1px solid #5fa");
        }
    };
}

function clientHandleMove(pos) {
    // console.log('Client -> Server: ', getTruePosition(pos));

    // Send user email and position
    socket.send(
        JSON.stringify({
            email: user.email,
            position: getTruePosition(pos)
        })
    )
}
