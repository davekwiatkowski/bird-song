let user = null;
let nipple_pos = null;

function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 250);
    var last,
        deferTimer;
    return function () {
        var context = scope || this;

        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
            // hold on to it
            clearTimeout(deferTimer);
            deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
            }, threshhold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}

const song_prefix = '/assets/audio/';
const songs = {
    'round1': {
        'names': ['Mystery Bird', 'Bewicks Swan', 'Brent Goose', 'Canada Goose', 'Wood Duck'],
        'locations': ['Round1_Target.m4a', 'Round1_Choice_Bewicks_Swan.ogg', 'Round1_Choice_Brent_Goose.ogg', 'Round1_Choice_Canada_Goose.ogg', 'Round1_Choice_Wood_Duck.ogg'],
    },
};

const TUNES = [];

const PENTAGON_ANGS = {
    c1: Math.cos(2 * Math.PI / 5),
    c2: Math.cos(Math.PI / 5),
    s1: Math.sin(2 * Math.PI / 5),
    s2: Math.sin(4 * Math.PI / 5)
};

function getPentagonX(id) {
    switch (id) {
        case 0:
            return 0;
        case 1:
            return PENTAGON_ANGS.s1;
        case 2:
            return PENTAGON_ANGS.s2;
        case 3:
            return -PENTAGON_ANGS.s2;
        default:
            return -PENTAGON_ANGS.s1;
    }
}

function getPentagonY(id) {
    switch (id) {
        case 0:
            return -1;
        case 1:
            return -PENTAGON_ANGS.c1;
        case 2:
            return PENTAGON_ANGS.c2;
        case 3:
            return PENTAGON_ANGS.c2;
        default:
            return -PENTAGON_ANGS.c1;
    }
}

function getPentagonDeg(id) {
    return id / 5 * 360;
}

class User {
    constructor(profile) {
        this.id = profile.getId();
        this.name = profile.getName();
        this.image = profile.getImageUrl();
        this.email = profile.getEmail();
    }
}

class Tune {
    constructor(name, audio, obj, id) {
        this.name = name;
        this.audio = audio;
        this.obj = obj;
        this.id = id;
        this.init();
    }

    init() {
        $(this.obj).find(".name").text(this.name);
        if (this.id === 3 || this.id === 2) {
            $(this.obj).find(".name").css({
                transform: `rotate(180deg)`
            });
        }
        $(this.obj).on('click', e => {
            $(".bird-tune").not(this).removeClass("listening");
            $(this.obj).toggleClass("listening");
            e.preventDefault();
            for (let i = 0; i < TUNES.length; ++i) if (i !== this.id) TUNES[i].audio.pause();
            this.audio.play();
            console.log("played sound " + this.id);
        });
        $(this.obj).css({
            transform:
            `translateX(${
                getPentagonX(this.id) * 130 - $(this.obj).width() / 2
            }px) translateY(${
                getPentagonY(this.id) * 130 + $(this.obj).height() / 2
            }px) rotate(${
                getPentagonDeg(this.id)
            }deg)`
        });
    }

    handleTune(degree, position) {
        const pointer = (degree - 36 + this.id * 360 / 5) % 360;
        const should_highlight = pointer < 72 && pointer >= 0;
        $(this.obj).css({
            "border-bottom-color": `rgba(255, 255, 255, ${should_highlight ? 1 : 0})`
        });

        if (should_highlight) {
            this.audio.play();
        }
        else {
            this.audio.pause();
        }
    }
}

const go = function () {
    const round = songs['round1'];

    for (let i = 0; i < $(".bird-tune").length; ++i) {
        const url = song_prefix + round['locations'][i];
        const audio = new Audio(url);
        audio.loop = true;

        const name = round['names'][i];
        const obj = $(".bird-tune")[i];
        $(this.obj).find('.names').text(name);

        TUNES.push(new Tune(name, audio, obj, i));
    }

    const nipple = nipplejs.create({
        zone: document.getElementById('static'),
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'rgba(255,255,255,0.2)',
        size: 150
    });

    nipple.on('start', (event, data) => {
        nipple_pos = data.position;
    }).on('move', (event, data) => {
        const degree = data.angle.degree;
        const position = data.position;

        for (tune of TUNES)
            tune.handleTune(degree, position);

        throttle(clientHandleMove(position), 1000);
    }).on('end', (event, data) => {
        for (tune of TUNES)
            tune.audio.pause();
    });

    nipple.start();
};

function startApp() {
    $(".signin-page").addClass("close");
    $(".app-screen").addClass("started");
    console.log("Started app.");
    go();
}

function handleSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    user = new User(profile);
    $(".signin-page").addClass("signed-in");
    console.log("User signed in.");

    $(".profile .face").css({
        "background": `url(${user.image}) no-repeat center center`,
        "background-size": "100px 100px"
    });

    $(".profile .name").text(user.name);
}

async function onSignIn(googleUser) {
    await handleSignIn(googleUser);
    clientInit();
}

function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        user = null;
        console.log('User signed out.');
        $(".signin-page").removeClass("signed-in");
    });
    $(".signin-page").removeClass("close");
}

window.onLoadCallback = function () {
    gapi.auth2.init({
        client_id: '1095164570247-c9sab3j041qg3dvr5df0im3i8ehrmlpo.apps.googleusercontent.com'
    });
}
