function getParent(element, condition) {
    while (!element.hasClass(condition)) {
        element = element.parent(); 
    }
    return element;
}


var timeAnimation = 300;
// Change the number of items
$(".product-amount").change(function() {
    updatePrice(this);
})

async   function updatePrice(amountInput) {
    var product = getParent($(amountInput), 'product')
    var element = $(product).children()
    
    var amount = parseInt($(amountInput).val())
    var price_item = parseInt($(element).children('.product-price').children('h3').text())
    
    var total_price =  amount * price_item

    var product_total_price = $(element).children('.product-total-price').children('h3')
    $(product_total_price).fadeOut(timeAnimation, function () {
        $(product_total_price).html(total_price + " đ")
        recalculateTransactionPrice()
        $(product_total_price).fadeIn(timeAnimation)
    })
}

// Prevent negative quantity 
$(".product-amount").keydown(function(e) {
    if(!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 48 && e.keyCode < 58) 
      || e.keyCode == 8)) {
        return false;
    }
})

// Click to remove item
$(".remove-item-list").click(function() {
    removeItem(this);
})

function recalculateTransactionPrice() {
    let transaction_product_price = 0 // Price total product without coupon
    $(".product").each(function() {
        transaction_product_price += parseInt($(this).children().children('.product-total-price').children('h3').text())
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


// Click to inc or dec item 

$('.change-value').click(async function() {
    var amountInput = $(this).siblings('input');
    if ($(this).hasClass('inc-value')) {
        amountInput.val(parseInt(amountInput.val()) + 1)
    } 
    if ($(this).hasClass('dec-value')) {
        if (amountInput.val() > 1)
        amountInput.val(parseInt(amountInput.val()) - 1)
    }
    updatePrice(amountInput)
})

recalculateTransactionPrice()
