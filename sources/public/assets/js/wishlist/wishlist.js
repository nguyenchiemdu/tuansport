var width_default = window.innerWidth;

var mobile = document.getElementById('wishlist-mobile');
var web = document.getElementById('wishlist-web');


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
