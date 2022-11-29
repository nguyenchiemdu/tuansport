$(document).ready(function () {
    $(".product-category").owlCarousel({
        items: 4,
        loop: true,
        margin: 40,
        responsive: {
            1024: {
                items: 4
            },
            800: {
                items: 3,
                autoplay: true

            },
            600: {
                items: 2,
                autoplay: true

            },
            100: {
                items: 2,
                autoplay: true

            },
        }
    });
    $(".policy-row").owlCarousel({
        items: 4,
        loop: true,
        margin: 30,
        mouseDrag: false,
        touchDrag: false,
        autoHeight: false,
        responsive: {
            1024: {
                items: 4,
            },
            800: {
                items: 3,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true
            },
            600: {
                items: 1,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true

            },
            100: {
                items: 1,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true
            },
        }
    });
});




