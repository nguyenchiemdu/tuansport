
console.log('checkout')


var cartItems
var previousURL = document.referrer
if (previousURL.toString().includes('/san-pham')) {
    previousURL = previousURL.split('/')
    cartItems = [{
        id: previousURL[previousURL.length-1],
        quantity: 1
    }
    ]
} else {
    cartItems = JSON.parse(window.localStorage.getItem('cart')) || []
}

// Common function and variables
function isValidateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

let priceFormat =  Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
function formatedPrice(item) {
    let user = document.querySelector('[user]')
    if (user) {
        return {
            string: priceFormat.format(item.priceBooks[0].price),
            price: item.priceBooks[0].price
        }
    } else  {
        return {
            string: priceFormat.format(item.basePrice),
            price: item.basePrice
        };
    }
}

function isVietnamesePhoneNumber(number) {
    return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(number);
}

function isValid() {
    let isValid = true
    $('#user-info input').each(function() {
        if ($(this).attr('name')== 'email') return // do not check email
        if ($(this).val() == '')
            {   isValid = false;
                $(this).addClass('is-invalid')
                $(this).siblings('.invalid-feedback').html('Vui lòng nhập thông tin')
            } 
        
    })
    const isEmail = isValidateEmail($('#email').val().trim())
    if ((!isEmail) &&( $('#email').val().length >0)) {
        isValid = false
        $('#email').addClass('is-invalid')
        $('#validateEmail').html('Email không hợp lệ')
    }
    const isPhoneNumber = isVietnamesePhoneNumber($('#phone-number').val().trim().replaceAll(' ',''))
    if (!isPhoneNumber) {
        isValid = false
        $('#phone-number').addClass('is-invalid')
        $('#validate-phone').html('Số điện thoại không hợp lệ')
    }
    return isValid
}


const order_form = $('#checkout-form')

async function submit() {
    const body = {
        role: $('[user]').attr('user'),
        customerName: $("#last-name").val() + ' ' + $("#first-name").val(),
        contactNumber: $("#phone-number").val(),
        address: $("#address").val() + ', ' + $('#city').val(),
        email: $("#email").val(),
        listProduct: cartItems.map(function(item) {
          return {
            "productCode": item.id,
            "quantity": parseInt(item.quantity)
          }
        }),
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
            const data = res.data
            console.log(data)
            const isBank = data.description.includes('Chuyển khoản ngân hàng')
            let payment
            if (isBank) {
                payment = 'Thanh toán bằng hình thức chuyển khoản'
            } else {
                payment = 'Trả bằng tiền mặt khi nhận hàng'
            }
            localStorage.removeItem("cart");
            $('#accept-checkout').hide();
                $('#title-page').html('Đã đặt hàng thành công')
                $('.name-order').html(body.customerName)
                $('.phone-order').html(body.contactNumber)
                $('.address-order').html(body.address)
                $('.bank-payment-order').html(payment)
            $('#order-successfully').show();
        } else {
            $('.modal-body').html(res.message)
            $('#checkout-fail-modal').modal('show')
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
                    let product_price = formatedPrice(product).price
                    transaction_product_price += parseInt(product_price) * parseInt(item.quantity)
                }
            })
        }))
    $('#transaction-product-price').html(priceFormat.format(transaction_product_price))
    $('#voucher-discount').html(priceFormat.format(voucher_discount))
    $('#transaction-price').html(priceFormat.format(transaction_product_price - voucher_discount))


    $("#transaction-btn").click(async function(e) {
        e.preventDefault()
        if (isValid())  await submit()
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