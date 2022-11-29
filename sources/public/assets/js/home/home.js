$(document).ready(function(){
    $(".owl-carousel").owlCarousel({
        items : 4,
        loop: true,
        margin: 40
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




