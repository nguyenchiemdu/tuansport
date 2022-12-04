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


    
