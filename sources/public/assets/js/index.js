// this is script that wil run on all site

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
    let wishlist_length = JSON.parse(window.localStorage.getItem('wishlist')).length;
    let cart_length = JSON.parse(window.localStorage.getItem('cart')).length;
    if (wishlist_length > 0) {
        let badge = `
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            ${wishlist_length}
        </span>  
        `
        $("#wishlist-nav-icon").append(badge)
    }
    if (wishlist_length > 0) {
        let badge = `
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            ${cart_length}
        </span>  
        `
        $("#shopping-cart-nav-icon").append(badge)
    }
})

// Change UI depend on screen
    
    var width_default = window.innerWidth;

    var mobile = document.getElementById('UI-mobile');
    var web = document.getElementById('UI-web');
    
    
    if (width_default <1200) {
        mobile.style.display = 'block';
        web.style.display = 'none';
    } else {
        mobile.style.display = 'none';
        web.style.display = 'block';
    }
    
    window.onresize = function() {
        let width_resize = window.innerWidth
        if (width_resize <1200)     {
            mobile.style.display = 'block';
            web.style.display = 'none';
        } else {
            mobile.style.display = 'none';
            web.style.display = 'block';
        }
    }
    
