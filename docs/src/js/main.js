let user = null;

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
        $(this.obj).on('click', e => {
            $(this.obj).toggleClass("listening");
            e.preventDefault();
            this.audio.play();
            console.log("played sound " + this.id);
        });
    }
}

const go = function () {
    const TUNES = [];
    for (let i = 0; i < $(".bird-tune").length; ++i) {
        const AUDIO = new Audio("http://www.wavsource.com/snds_2017-09-17_1751672946049674/animals/bird.wav");
        const NAME = "bird" + i;
        const OBJ = $(".bird-tune")[i];
        TUNES.push(new Tune(NAME, AUDIO, OBJ, i));
    }
};

function startApp() {
    $(".signin-page").addClass("close");
    $(".app-screen").addClass("started");
    console.log("Started app.");
    go();
}

function onSignIn(googleUser) {
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