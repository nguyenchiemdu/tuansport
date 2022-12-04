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







$(document).ready(function () {
    $(".toggle-submenu").on('click', function (e) {

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
    $(".product-item").on('click', function (e) {
        let skuCode = ($(this).attr('code'))
        window.location.href = '/san-pham/' + skuCode;
    })
    $('.btn-cart').on('click', function (e) {
        e.stopPropagation();
    })
    $('.btn-wishlist').on('click', function (e) {
        e.stopPropagation();
        let button = $(this)
        if (button.hasClass('btn-light')) {
            button.removeClass('btn-light')
            button.addClass('btn-primary')
            let skuCode = button.attr('skucode')
            let sameSkuCodeButtons = $('.btn-wishlist.' + skuCode)
            for (let button of sameSkuCodeButtons) {
                $(button).removeClass('btn-light')
                $(button).addClass('btn-primary')
            }
            let wishlist = window.localStorage.getItem('wishlist');
            wishlist = JSON.parse(wishlist);
           
            if (wishlist == null) wishlist = [];
            wishlist.push(skuCode)
            wishlist = new Set(wishlist)
            wishlist = Array.from(wishlist)
            window.localStorage.setItem('wishlist', JSON.stringify(wishlist))
            if (wishlist.length > 0) {
                let badge = `
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    ${wishlist.length}
                </span>  
                `
                $("#wishlist-nav-icon").append(badge)
            }
            $("#wishlist-nav-icon").children('.badge').html(wishlist.length)
            
        } else {
            button.removeClass('btn-primary')
            button.addClass('btn-light')
            let skuCode = button.attr('skucode')
            let sameSkuCodeButtons = $('.btn-wishlist.' + skuCode)
            for (let button of sameSkuCodeButtons) {
                $(button).removeClass('btn-primary')
                $(button).addClass('btn-light')
            }
            let wishlist = window.localStorage.getItem('wishlist');
            wishlist = JSON.parse(wishlist);
           
            if (wishlist == null) wishlist = [];
            wishlist = wishlist.filter(function(item) {
                return item !== skuCode
            })
            wishlist = new Set(wishlist)
            wishlist = Array.from(wishlist)
            window.localStorage.setItem('wishlist', JSON.stringify(wishlist))
            if (wishlist.length == 0) {
                $("#wishlist-nav-icon").children('.badge').remove()
            }
            $("#wishlist-nav-icon").children('.badge').html(wishlist.length)

        }
    })
    // update porduct that in wishlists
    let wishlist = window.localStorage.getItem('wishlist');
    wishlist = JSON.parse(wishlist);
    if (wishlist == null) wishlist = []

    for (let skuCode of wishlist) {
        let sameSkuCodeButtons = $('.btn-wishlist.' + skuCode)
            for (let button of sameSkuCodeButtons) {
                $(button).removeClass('btn-light')
                $(button).addClass('btn-primary')
            }
    }
})




