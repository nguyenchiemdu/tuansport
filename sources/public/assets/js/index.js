// this is script that wil run on all site

// Dropdown in mobile
$(document).ready(function(e) {
    $('.dropdownMenuLink').click(function (e) {
        e.stopPropagation()
        $(this).attr('aria-expanded', 'false' )
        $(this).removeClass('show')
        $(this).siblings('.dropdown-menu').removeClass('show')

        window.location.pathname = $(this).attr('href');
    })

    $(".toggle-submenu").on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var dropdown = $(this).siblings('ul')
        var openMenu = $(this).children('.open-menu')
        var closeMenu = $(this).children('.close-menu')
        dropdown.toggle()
        dropdown.toggleClass('show')
        if (dropdown.hasClass('show')) {
            openMenu.attr('style', 'display:none')
            closeMenu.attr('style', 'display:block')
        } else {

            openMenu.attr('style', 'display:block')
            closeMenu.attr('style', 'display:none')
        }
    })
    
})

// Dropdown in PC
$(document).ready(function() {
    var width = $(document).width() 
    if (width >=1200) {
        let navRedirect = document.querySelectorAll('.nav-redirect')
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

        $('.nav-redirect').click(function() {
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

$(document).ready(async function() {
    let wishlist = JSON.parse(window.localStorage.getItem('wishlist')) || [];
    await Promise.all(wishlist.map(async (item,i) => {
        await fetch('/api/product/code/' + item, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET",
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                let product = res.data
                if (!product.isSynced) {
                    wishlist.splice(i, 1)
                }
            } else wishlist.splice(i, 1)
            
        })
    }))
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
    if (wishlist.length > 0) {
        let badge = `
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
        ${wishlist.length}
        </span>  
        `
        $("#wishlist-nav-icon").append(badge)
    }


    let cartItems = JSON.parse(window.localStorage.getItem('cart')) || [];
    await Promise.all(cartItems.map(async (item, i) => {
        await fetch('/api/product/code/' + item.id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET",
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                let product = res.data
                if (!product.isSynced) {
                    cartItems.splice(i, 1)
                }
            } else cartItems.splice(i, 1)
        })
    }))
    localStorage.setItem('cart', JSON.stringify(cartItems))
    if (cartItems.length > 0) {
        let badge = `
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            ${cartItems.length}
        </span>  
        `
        $("#shopping-cart-nav-icon").append(badge)
    }
})


// handle event for produt items
$(document).ready(function () {

    $(".product-item").on('click', function (e) {
        let skuCode = ($(this).attr('skucode'))
        window.location.href = '/san-pham/' + skuCode;
    })
    

    $('.btn-wishlist').on('click',addToWishlist)
    // update porduct that in wishlists
    let wishlist = window.localStorage.getItem('wishlist');
    wishlist = JSON.parse(wishlist);
    if (wishlist == null) wishlist = []

    for (let skuCode of wishlist) {
        let sameSkuCodeButtons = $('.btn-wishlist.' + skuCode)
        if (sameSkuCodeButtons==null) sameSkuCodeButtons = []
            for (let button of sameSkuCodeButtons) {
                $(button).removeClass('btn-light')
                $(button).addClass('btn-primary')
            }
    }
})

// Search engine    

$(document).ready(function () {
    $('.clear-input').click(function () {
        $('#search-box').val('') 
    })
    $('.btn-search').click(function () {
        let searchText = $('#search-box').val()
        window.location.href = '/products?search='+searchText
    })
    $('#search-box').keyup(function(e){
        if(e.keyCode==13) {
        $('.btn-search').click()
        }
    })

})
// back to top button
//Get the button
let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
// add to wish List
function addToWishlist (e) {
    e.preventDefault();
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
    $('.toast-body a').text('Đi đến wishlist')
    $('.toast-body a').attr('href', '/wishlist')
    if (!$(button).hasClass('btn-light')) {
        $('.toast-body span').text('Đã thêm sản phẩm vào wishlist! ')
    } else {
        $('.toast-body span').text('Đã gỡ sản phẩm ra khỏi wishlist! ')

    }
        
    $('#add-to-cart-success').toast('show')
}