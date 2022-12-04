// this is script that wil run on all site
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


    
