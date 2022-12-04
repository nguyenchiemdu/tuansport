$(document).ready(function () {
    $(".product-category").owlCarousel({
        items: 4,
        loop: true,
        // margin: 40,
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
        // margin: 30,
        mouseDrag: false,
        touchDrag: false,
        autoHeight: false,
        responsive: {
            1400: {
                items: 4,
            },
            1000: {
                items: 3,
            },
            800: {
                items: 2,
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
    $(".newest-product").owlCarousel({
        items: 5,
        // remove this 
        // loop: true,
        // margin: 30,
        responsive: {
            1024: {
                items: 5,
            },
            800: {
                items: 3,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true
            },
            600: {
                items: 2,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true

            },
            100: {
                items: 2,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true
            },
        }
    });
});












