($ => {
    let user = null;

    class User {
        constructor(profile) {
            this.id = profile.getId();
            this.name = profile.getName();
            this.image = profile.getImageUrl();
            this.email = profile.getEmail();
        }
    }

    function onSignIn(googleUser) {
        const profile = googleUser.getBasicProfile();
        user = new User(profile);
        $(".signin-page").addClass("signed-in");
    }

    function signOut() {
        const auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            user = null;
            console.log('User signed out.');
            $(".signin-page").removeClass("signed-in");
        });
    }
})(jQuery);
