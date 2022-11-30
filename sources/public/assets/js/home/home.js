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







$(document).ready(function() {
    $(".toggle-submenu").on('click', function(e) {
        
        var dropdown = $(this).siblings('ul')
        var openMenu = document.querySelectorAll('.open-menu')
        var closeMenu = document.querySelectorAll('.close-menu')
        e.preventDefault();
        e.stopPropagation();
        dropdown.toggle()
        dropdown.toggleClass('show')
        if (dropdown.hasClass('show')) {
            openMenu[e.target.dataset.index].style.display = 'none'
            closeMenu[e.target.dataset.index].style.display = 'block'
        } else {
            openMenu[e.target.dataset.index].style.display = 'block'
            closeMenu[e.target.dataset.index].style.display = 'none'
        }
    })
})




