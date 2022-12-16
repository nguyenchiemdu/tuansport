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
    

    $('.btn-direct-buy').on('click', function (e) {
        e.stopPropagation();
        
        let button = $(this)
        let skuCode = button.attr('skucode')
        if (skuCode.includes('Master')){
            $('.toast-body span').text('Vui lòng chọn thuộc tính của sản phẩm')
            $('.toast-body a').addClass('d-none')
            $('#add-to-cart-success').toast('show')
        } else {
            if ($('#product-status span:contains("0")').length > 0) {
                $('.toast-body span').text('Sản phẩm của bạn hiện đã hết hàng')
                $('.toast-body a').addClass('d-none')
                $('#add-to-cart-success').toast('show')
            } else {
                
                window.location.pathname= '/checkout'
            }
        }

    })
    $('.btn-cart').on('click', function (e) {
        e.stopPropagation();
        
        let button = $(this)
        let skuCode = button.attr('skucode')
        let hasAttr = !(button.attr('noattr')==='true')
        if (skuCode.includes('Master')&& hasAttr){
            $('.toast-body span').text('Vui lòng chọn thuộc tính của sản phẩm')
            $('.toast-body a').addClass('d-none')
            $('#add-to-cart-success').toast('show')
        } else {
            if ($('#product-status span:contains("0")').length > 0) {
                $('.toast-body span').text('Sản phẩm của bạn hiện đã hết hàng')
                $('.toast-body a').addClass('d-none')
                $('#add-to-cart-success').toast('show')
            } else {
                skuCode = skuCode.replace('Master','')
                let cartItems = JSON.parse(window.localStorage.getItem('cart')) ?? []
                let index = cartItems.findIndex(item => item.id == skuCode)
                if (index<0) {
                    cartItems.push({id: skuCode,quantity:1})
                } else {
                    cartItems[index].quantity = parseInt(cartItems[index].quantity) +1
                }
                window.localStorage.setItem('cart', JSON.stringify(cartItems))
                
                if (cartItems.length > 0) {
                    let badge = `
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        ${cartItems.length}
                    </span>  
                    `
                    $("#shopping-cart-nav-icon").append(badge)
                }
                $("#shopping-cart-nav-icon").children('.badge').html(cartItems.length)
                $('.toast-body span').text('Đã thêm sản phẩm vào giỏ hàng!')
                $('.toast-body a').removeClass('d-none')
                $('.toast-body a').text('Đi đến giỏ hàng')
                $('.toast-body a').attr('href', '/cart')
                $('#add-to-cart-success').toast('show')
            }
        }
    })
    $('.btn-wishlist').on('click', function (e) {
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
    })
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
