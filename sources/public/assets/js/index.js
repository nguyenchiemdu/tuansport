// this is script that wil run on all site

// Dropdown in mobile
$(document).ready(function(e) {
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
})

// Dropdown in PC
$(document).ready(function() {
    var width = $(document).width() 
    if (width >=1200) {
        let navRedirect = document.querySelectorAll('#nav-redirect')
        $(navRedirect).hover(function() {
            let tag = $(this).children('a')
            let dropdown = $(this).children('ul')

            tag.attr('aria-expanded', "true")
            tag.addClass('show')

            dropdown.attr('data-bs-popper', 'static')
            dropdown.addClass('show')
        }, function(){
            let tag = $(this).children('a')
            let dropdown = $(this).children('ul')

            tag.attr('aria-expanded', "false")
            tag.removeClass('show')

            dropdown.attr('data-bs-popper', '')
            dropdown.removeClass('show')
        })

        $(navRedirect).click(function() {
            let port
            if (window.location.port) 
                port = window.location.port
            var redirect = $(this).children("a").attr('href')

            window.location.href =  redirect
        })
    }
})

// Icon stroke if it is path
const path = window.location.pathname.split('/')[1]

    switch (path) {
        case 'wishlist': {
            const icon = document.querySelector('.feather-heart')
            icon.classList.add('is-path')
            break;
        }
        case 'cart': {
            const icon = document.querySelector('.feather-shopping-cart')
            icon.classList.add('is-path')
            break;
        }
        default: break;
    }


    // Badge in wishlist + cart

$(document).ready(function() {
    let wishlist = JSON.parse(window.localStorage.getItem('wishlist')) || [];
    let cart = JSON.parse(window.localStorage.getItem('cart')) || [];
    if (wishlist.length > 0) {
        let badge = `
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            ${wishlist.length}
        </span>  
        `
        $("#wishlist-nav-icon").append(badge)
    }
    if (cart.length > 0) {
        let badge = `
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            ${cart.length}
        </span>  
        `
        $("#shopping-cart-nav-icon").append(badge)
    }
})


    
