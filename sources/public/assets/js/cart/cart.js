console.log('cart')
// Common function 
var timeAnimation = 300;

function getParent(element, condition) {
    while (!element.hasClass(condition)) {
        element = element.parent(); 
    }
    return element;
}

function updatePrice(amountInput) {
    var product = getParent($(amountInput), 'product')
    var amount = parseInt($(amountInput).val())
    var price_item = parseInt($(product).children('.product-price').children('h3').text())
    
    var total_price =  amount * price_item

    var product_total_price = $(product).children('.product-total-price').children('h3')
    $(product_total_price).fadeOut(timeAnimation, function () {
        $(product_total_price).html(total_price + " đ")
        recalculateTransactionPrice()
        $(product_total_price).fadeIn(timeAnimation)
    })
}
function recalculateTransactionPrice() {
    let transaction_product_price = 0 // Price total product without coupon
    $(".product").each(function() {
        transaction_product_price += parseInt($(this).children('.product-total-price').children('h3').text())
    })

    let voucher_discount = 0
    let transaction_price = transaction_product_price - voucher_discount
    $('.total-value').fadeOut(timeAnimation, function() {
        $('#transaction-product-price').html(transaction_product_price + ' đ')
        $('#voucher-discount').html(voucher_discount + ' đ')
        $('#transaction-price').html(transaction_price + ' đ')
        if (transaction_price == 0) {
            $('#transaction-btn').fadeOut(timeAnimation)
        } else {
            $('#transaction-btn').fadeIn(timeAnimation)
        }
        $('.total-value').fadeIn(timeAnimation)
    })
}

function removeItem(removeButton) {
    var product = getParent($(removeButton), 'product')
    product.slideUp(timeAnimation, function(){
        product.remove();
        recalculateTransactionPrice();
    })
}
// Render UI
$(document).ready(async function() {
    let cartItems = JSON.parse(window.localStorage.getItem('cart')) || []
    let cartId =[], itemQuantity = []
    cartItems.map(item => {
        cartId.push(item.id)
        itemQuantity.push(item.quantity)
    })
    let index = 0
    let isHasProduct = cartItems.length == 0
    let title = `
        Giỏ hàng ${!isHasProduct ? `(${cartItems.length})` : ""}
    `
    $('#title-page').html(title)

    await Promise.all(cartItems.map( async item => {
        await fetch('/api/product/code/' + item.id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET",
        })
        .then(res => res.json()
        )
        .then(res => {
                if (res.success) {
                    let product = res.data 
                     
                    let isHasColor = product.attributes[1]?.attributeValue == undefined
                    let isHasProduct = res.length == 0
                    
                    let htmlTagWeb = `  
                      <tr skucode="${product.code}"class="product product-item ${product.code}">  <!-- Item --> 
                          <td class="product-detail"> <!-- Name item -->
                            <img src="${product.images[0]}" alt="" width="120px" height="120px" style="border-radius: 20px" />
                            <span class="d-inline-block align-middle mt-3 mt-lg-0 mt-xl-0 mt-xxl-0 ms-0 ms-lg-3 ms-xl-3 ms-xxl-4">
                                <h3 class="">${product.name}</h3>
                                <p>Size: ${product.attributes[0].attributeValue} ${!isHasColor ? `, Màu: ${product.attributes[1]?.attributeValue}`: ``}</p>
                            </span>
                          </td> <!-- Name item -->
                            <td class="product-price text-center"> <!-- Price -->
                                <h3>${product.priceBooks[1].price} đ</h3>
                            </td> <!-- Price -->
                          <td class="product-quantity"> <!-- Amount -->
                            <div class="input-group mb-3 amount-box mx-auto">
                                <span skucode="${product.code}" class="input-group-text change-value hover-bigger dec-value" style="border-radius: 23px 0 0 23px">
                                    <i class="fa-solid fa-minus"></i>
                                </span>
                                <input type="text" skucode="${product.code}" class="form-control product-amount text-center shadow-none" aria-label="Amount" value="${item.quantity}">
                                <span skucode="${product.code}" class="input-group-text change-value hover-bigger inc-value" style="border-radius: 0 23px 23px 0">
                                    <i class="fa-regular fa-plus"></i>
                                </span>
                              </div>
                          </td> <!-- Amount -->
                          <td class="product-total-price text-center">
                            <h3>${product.priceBooks[1].price * item.quantity} đ</h3>
                          </td>
                          <td class="pe-0 me-1 ps-5"> <!-- Icon -->
                          <i skucode="${product.code}"class="ms-lg-3 ms-xl-3 ms-xxl-3 mt-2 mt-lg-0 mt-xl-0 mt-xxl-2 fa-regular fa-x action-icon hover-bigger remove-item-list text-center" style="transform:translateY(-5px)"></i>
                          </td> <!-- Icon -->
                      </tr>
                    `
                    $("#list-products-web").append(htmlTagWeb)
                    index++;
                } else {
                    console.log(res)
                }

        })
    }))
    // Handle function
    await $(document).ready(function() {

        // Remove item
        $('.remove-item-list').on('click', function(e) {
            e.stopPropagation()
            let skuCode = $(this).attr('skucode')
            let cartItems = JSON.parse(window.localStorage.getItem('cart')) || []
            cartItems = cartItems.filter(function(item) { 
                return item.id !== skuCode
            })
            new Set(cartItems)
            Array.from(cartItems)
            console.log(cartItems)

            let isHasProduct = cartItems.length == 0
            let title = `
                Giỏ hàng ${!isHasProduct ? `(${cartItems.length})` : ""}
            `
            $('#title-page').html(title)
            if (cartItems.length > 0) {
                let badge = `
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    ${cartItems.length}
                </span>  
                `
                $("#shopping-cart-nav-icon").append(badge)
            } else $("#shopping-cart-nav-icon").children('.badge').html(cartItems.length)

            if (cartItems.length == 0) {
                $("#shopping-cart-nav-icon").children('.badge').remove()
            }
            window.localStorage.setItem('cart', JSON.stringify(cartItems))
            removeItem(this)
            // let products = $('.product.' + skuCode)
            // for (let item of products) {
            //     $(item).addClass('d-none')
            // }
        })  
        // Go to product detail page
        $('.product-item').on('click', function (e) {
            let btn = $(this)
            let skuCode = btn.attr('skucode')
            window.location.href = '/san-pham/' + skuCode;
        })


        // Change the number of items
        $(".product-amount").change(function() {
            let skuCode = $(this).attr('skucode')
            let value = $(this).val()
            let cartItems = JSON.parse(window.localStorage.getItem('cart')) || []
            cartItems.find(item => {
                if (item.id === skuCode) item.quantity = value
            })
            new Set(cartItems)
            Array.from(cartItems)
            window.localStorage.setItem('cart', JSON.stringify(cartItems))
            updatePrice(this);
        })

        

        // Prevent negative quantity 
        $(".product-amount").keydown(function(e) {
            if(!((e.keyCode > 95 && e.keyCode < 106)
            || (e.keyCode > 48 && e.keyCode < 58) 
            || e.keyCode == 8)) {
                return false;
            }
        })


        

        


        // Click to inc or dec item 

        $('.change-value').click(async function() {
            let cartItems = JSON.parse(window.localStorage.getItem('cart')) || []
            let skuCode = $(this).attr('skucode')
            let amountInput = $(this).siblings('input');
            if ($(this).hasClass('inc-value')) {
                amountInput.val(parseInt(amountInput.val()) + 1)
            } 
            if ($(this).hasClass('dec-value')) {
                if (amountInput.val() > 1)
                amountInput.val(parseInt(amountInput.val()) - 1)
            }
            cartItems.find(item => {
                if (item.id === skuCode) item.quantity = amountInput.val()
            })
            new Set(cartItems)
            Array.from(cartItems)
            window.localStorage.setItem('cart', JSON.stringify(cartItems)) 
            updatePrice(amountInput)
        })

        recalculateTransactionPrice()
            }) 
})



                