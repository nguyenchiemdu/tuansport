$(document).ready(function(){
    $(".owl-carousel").owlCarousel({
        items : 4,
        loop: true,
        margin: 40
    });
  });

// $(document).ready(function () {
//     $(".dropdown-submenu a.submenu").on("click", function (e) {
//         console.log($(this))
//       $(this).next("ul").toggle();
//       e.preventDefault();
//       e.stopPropagation();
//       var index = e.target.dataset.index
//     })
//     $(".dropdown-submenu a.submenu").on('click', function closeMenu (e){
//         console.log($(this))

//         if($(".dropdown-submenu a.submenu").has(e.target).length === 0){
//             $(this).next("ul").removeClass('show');
//         } else {
//             $(document).one('click', closeMenu);
//         }
//     });
//   });

$(document).ready(function() {
    $(".toggle-submenu").on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var dropdown = $(this).siblings('ul')
        dropdown.toggle()
        dropdown.css({
                "position": "static",
        });
    })
})

