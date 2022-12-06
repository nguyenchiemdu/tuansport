
console.log('checkout')

const cartItems = JSON.parse(window.localStorage.getItem('cart')) || []
// Common function and variables
function isValidateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function isVietnamesePhoneNumber(number) {
    return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(number);
}

function isInvalid() {
    $('#user-info input').each(function() {
        if ($(this).val() == '')
            {
                $(this).addClass('is-invalid')
                $(this).siblings('.invalid-feedback').html('Vui lòng nhập thông tin')
            } else {

            }
        
    })
    const isEmail = isValidateEmail($('#email').val().trim())
    if (!isEmail) {
        $('#email').addClass('is-invalid')
        $('#validateEmail').html('Email không hợp lệ')
    }
    const isPhoneNumber = isVietnamesePhoneNumber($('#phone-number').val().trim().replaceAll(' ',''))
    if (!isPhoneNumber) {
        $('#phone-number').addClass('is-invalid')
        $('#validate-phone').html('Số điện thoại không hợp lệ')
    }
}


const order_form = $('#checkout-form')

async function submit() {
    const body = {
        customerName: $("#last-name").val() + ' ' + $("#first-name").val(),
        listProduct: cartItems,
        address: $("#address").val() + ', ' + $('#city').val(),
        contactNumber: $("#phone-number").val(),
        email: $("#email").val(),
        bankPayment: $('.form-check-input').prop('checked')
    }
    await fetch('/api/order', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            window.location.href = '/order-success'
        }
    })
    
}

$(document).ready(async function() {
    // Render transaction detail
    let transaction_product_price = 0
    let voucher_discount = JSON.parse(window.localStorage.getItem('voucher_data'))?.discount || 0
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
                    let product_price = product.basePrice 
                    transaction_product_price += parseInt(product_price) * parseInt(item.quantity)
                }
            })
        }))
    $('#transaction-product-price').html(transaction_product_price + ' đ')
    $('#voucher-discount').html(voucher_discount + ' đ')
    $('#transaction-price').html(transaction_product_price - voucher_discount + ' đ')


    $("#transaction-btn").click(async function(e) {
        e.preventDefault()
        isInvalid()
        // await submit()
    })

    $('#user-info input').on('input',(function(e) {
        $(this).removeClass('is-invalid')
        $(this).html('')
    }))

    if (cartItems.length == 0) {
        $('#error-checkout').show()
        $('#accept-checkout').hide()
    }
})