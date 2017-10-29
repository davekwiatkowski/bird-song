let user = null;

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
            return 1;
        case 1:
            return PENTAGON_ANGS.c1;
        case 2:
            return -PENTAGON_ANGS.c2;
        case 3:
            return -PENTAGON_ANGS.c2;
        default:
            return PENTAGON_ANGS.c1;
    }
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
            getPentagonX(this.id) * 150
            }px) translateY(${
            getPentagonY(this.id) * 150
            }px)`
        });
    }
}

const go = function () {
    for (let i = 0; i < $(".bird-tune").length; ++i) {
        const AUDIO = new Audio("http://www.wavsource.com/snds_2017-09-17_1751672946049674/animals/bird.wav");
        const NAME = "bird" + i;
        const OBJ = $(".bird-tune")[i];
        TUNES.push(new Tune(NAME, AUDIO, OBJ, i));
    }

    const static = nipplejs.create({
        zone: document.getElementById('static'),
        mode: 'static',
        position: { left: '50%', top: '50%' },
        color: 'white',
        size: 150
    });
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
        "background": `url(${user.image}) no- repeat center center`,
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
