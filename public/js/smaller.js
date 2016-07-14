function init() {
    window.addEventListener('scroll', function(e){
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
            shrinkOn = 50,
            header = document.querySelector(".navbar");
        if (distanceY > shrinkOn) {
            $(".navbar-fixed-top .container-fluid ").addClass("smaller");
        } else {
            if ( $(".navbar-fixed-top .container-fluid ").hasClass("smaller")) {
                 $(".navbar-fixed-top .container-fluid ").removeClass("smaller");
            }
        }
    });
}
window.onload = init();
