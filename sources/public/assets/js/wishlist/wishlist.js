
var mobile = document.getElementById('wishlist-mobile');
var web = document.getElementById('wishlist-web');

window.onresize = function() {
    let width = window.innerWidth;
    console.log(width);
    if (width <1200) {
        mobile.style.display = 'block';
        web.style.display = 'none';
    } else {
        mobile.style.display = 'none';
        web.style.display = 'block';
    }
}
