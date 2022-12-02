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
    
