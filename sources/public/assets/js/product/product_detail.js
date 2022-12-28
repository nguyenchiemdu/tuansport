console.log('product_detail');

let selecedAttributes = {};
$(document).ready(function () {
    initCarousel();
    // selected attribute and show product left
    $('.attribute-button').on('click', async function (e) {
        if ($(this).hasClass('btn-primary')){
                $(this).removeClass('btn-primary');
                $(this).addClass('btn-light');
                $('#product-status').addClass('d-none')
            let attributeId = parseInt($(this).attr('attributeId'))
            delete selecedAttributes[attributeId]
        } else {
            let attributeId = parseInt($(this).attr('attributeId'))
            let value = $(this).attr('value')
            let newValue = {
                attributeId: attributeId,
                value: value
            }
            // get available attributes with new selected value
            let mapAvailableAttr = getAvailableOtherAttributesValue(newValue)

            // condition to reduce spam
            let isNew = !(JSON.stringify(newValue) == JSON.stringify(selecedAttributes[attributeId]))
            // remove selected attributes if they are not available
            for (let key in selecedAttributes) {
                let attribute = selecedAttributes[key]
                if (mapAvailableAttr[key] != null && !mapAvailableAttr[key].includes(attribute.value)) {
                    delete selecedAttributes[key]
                }
            }
            updateSelectedAttributeButton(this, mapAvailableAttr)
            selecedAttributes[attributeId] = newValue
            // check if use choose all attributes to call api and show products left
            if (Object.keys(selecedAttributes).length == Object.keys(mapAttributes).length && isNew) {
                let targetKey = null;
                for (let key in mappedProductAttributes) {
                    let isOk = true
                    let listAttr = mappedProductAttributes[key]
                    listAttr = listAttr.map(attr => JSON.stringify(attr))
                    for (let k in selecedAttributes) {

                        let selecedAttribute = JSON.stringify(selecedAttributes[k])
                        if (!listAttr.includes(selecedAttribute)) {
                            isOk = false;
                            break
                        }
                    }
                    if (isOk) {
                        targetKey = key;
                        break
                    }
                }
                if (targetKey != null) {
                    res = await fetch('/api/product/' + targetKey)
                        .then(res => res.json())
                    if (res.success) {
                        updateSelectedProduct(res.data)
                    } else {
                        alert(res.message);
                    }
                } else {
                    removeOnHandTag()
                }
            } else if (Object.keys(selecedAttributes).length != Object.keys(mapAttributes).length) {
                removeOnHandTag()
            }
            }
        
    })
    $('.btn-cart').on('click', function (e) {
        e.stopPropagation();
        
        let button = $(this)
        let skuCode = button.attr('skucode')
        let hasAttr = !(button.attr('noattr')==='true')
        let selectFullAttributes = Object.keys(selecedAttributes).length == Object.keys(mapAttributes).length
        if ((!selectFullAttributes)&& hasAttr){
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
    $('.btn-direct-buy').on('click', function (e) {
        e.stopPropagation();
        
        let button = $(this)
        let skuCode = button.attr('skucode')
        let hasAttr = !(button.attr('noattr')==='true')
        let selectFullAttributes = Object.keys(selecedAttributes).length == Object.keys(mapAttributes).length

        if ((!selectFullAttributes)&& hasAttr){
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
    
});


function initCarousel() {
    $(".thumb-slider").owlCarousel({
        items: 1,
        loop: true,
        center: true,
        margin: 20,
        autoHeight:false,
        URLhashListener: true,
        // autoplayHoverPause:true,
        responsive: {
            600: {
                items: 1,
                // mouseDrag: true,
                // touchDrag: true,
                // autoplay: true

            },
            100: {
                items: 1,
                // mouseDrag: true,
                // touchDrag: true,
                // autoplay: true
            },
        }

    });
    $(".related-product").owlCarousel({
        items: 5,
        // remove this 
        // loop: true,
        // margin: 30,
        responsive: {
            1024: {
                items: 5,
            },
            800: {
                items: 3,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true
            },
            600: {
                items: 2,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true

            },
            100: {
                items: 2,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true
            },
        }
    });
    $(".image-controller").owlCarousel({
        items: 3,
        loop: true,
        margin: 20,
    });
    // next and previous buttons
    $('.next-button').click(function() {
        $(".image-controller").trigger('next.owl.carousel');
    })
    // Go to the previous item
    $('.prev-button').click(function() {
        $(".image-controller").trigger('prev.owl.carousel');
    })
}
function updateSelectedProduct(product) {
    $('#skuCode').html(product.skuCode);
    $('.btn-cart').each(function(){
        $(this).attr('skucode',product.skuCode)
    })
    $('.btn-direct-buy').each(function(){
        $(this).attr('skucode',product.skuCode)
    })
    // $('.product-name').html(product.fullName);
    $('#product-status').removeClass('d-none')
    $('#product-status').html(`Tình Trạng:
    <span>Còn ${product.onHand} sản
                    phẩm</span>`)
    // update price
    let oldPrice = $('#price').html()
    let price;
    if (oldPrice.includes('CTV:')){
        price = 'CTV: '+`<span class="text-color-tertiary">${priceFormat.format(product.ctvPrice)}</span>`
    } else  {
        price = priceFormat.format(product.price)
    }
    $('#price').html(price)
    $('.sale-price').html(priceFormat.format(product.salePrice))
    // update thumb image
    // let listThumbnail = ''
    // if ((product.images).length == 0)
    //     listThumbnail = `<div class="">
    //                         <img class="rounded-4" alt="${product.name}"/>
    //                     </div>`
    // else {
    //     for (let i=product.images.length-1;i >=0;i--) {
    //         listThumbnail+= `<div class="" data-hash="image-${i}">
    //                                 <img class="rounded-4"
    //                                         src="${product.images[i]}" />
    //                         </div>`
    //     }
    // }
    // reload thumbslider
    let numberThumb = $('.thumb-slider .owl-item').length;

    for (let i=0; i<numberThumb; i++) {
       $(".thumb-slider").trigger('remove.owl.carousel', i).trigger('refresh.owl.carousel');
    }
    for (let i=product.images.length-1;i >=0;i--) {
       let  data = `<div class="" data-hash="image-${i}">
       ${oldPrice.includes('CTV:') ?
        `<a href="${product.images[i]}" download>` : ""}
                                <img class="rounded-4"
                                        src="${product.images[i]}" />
                        </div>
                        ${oldPrice.includes('CTV:') ?
                        `</a>` : ""}`
        $(".thumb-slider").trigger('add.owl.carousel', [data,i]).trigger('refresh.owl.carousel')
    }
    // reload image controller
    let numberImgController = $('.image-controller .owl-item').length;
    
    for (let i=0; i<numberImgController; i++) {
        $(".image-controller").trigger('remove.owl.carousel', [0])
     }
     $('.image-controller').trigger('refresh.owl.carousel');
     for (let i=product.images.length-1;i >=0;i--) {
        let  data = `<a href="#image-${i}">
                            <img class="rounded-4"
                                    src="${product.images[i]}" />
                    </a>`
         $(".image-controller").trigger('add.owl.carousel', [data,i]).trigger('refresh.owl.carousel')
     }

}
function removeOnHandTag() {
    $('#product-status').addClass('d-none')
}
function updateSelectedAttributeButton(button, mapAvailableAttr) {
    let allAttrBtn = $('.attribute-button');
    for (let btn of allAttrBtn) {
        $(btn).parent().addClass('d-none')

        // if ($(btn).hasClass('btn-primary')) {
        // $(btn).removeClass('btn-primary')
        // $(btn).addClass('btn-light')
        // }

    }
    for (let key in mapAvailableAttr) {
        let AttrBtns = $('.attribute-button.' + key);
        for (let btn of AttrBtns) {
            let value = $(btn).attr('value')
            if (mapAvailableAttr[key].includes(value)) {
                $(btn).parent().removeClass('d-none')

            } else {
                if ($(btn).hasClass('btn-primary')) {
                    $(btn).removeClass('btn-primary')
                    $(btn).addClass('btn-light')
                }
            }
            // if ($(btn).hasClass('btn-primary')) {
            // $(btn).removeClass('btn-primary')
            // $(btn).addClass('btn-light')
            // }

        }
    }
    let attributeId = parseInt($(button).attr('attributeId'))
    let listBtn = $('.attribute-button.' + attributeId);
    for (let btn of listBtn) {
        if ($(btn).hasClass('btn-primary')) {
            $(btn).removeClass('btn-primary')
            $(btn).addClass('btn-light')
        }

    }
    $(button).removeClass('btn-light')
    $(button).addClass('btn-primary')
}

function getAvailableOtherAttributesValue(newAtrribute) {
    var mapAvailableAttr = {}
    let selecedAttributeName
    let leftAttributeId = Object.keys(selecedAttributes).find(id=> id!= newAtrribute.attributeId)
     newAtrribute = leftAttributeId!= null ? selecedAttributes[leftAttributeId]: newAtrribute
        for (let name in mapAttributes) {
        if (mapAttributes[name][0].attributeId == newAtrribute.attributeId) {
            selecedAttributeName = name;
            break
        }
    }

    for (let attribute of mapAttributes[selecedAttributeName]) {
        if (mapAvailableAttr[attribute.attributeId] == null) {
            mapAvailableAttr[attribute.attributeId] = []
        }
        if (
            !mapAvailableAttr[attribute.attributeId].includes(attribute.value)) {
            mapAvailableAttr[attribute.attributeId].push(attribute.value)
        }
    }
    // loop all sub product
    for (let key in mappedProductAttributes) {
        let isOk = true
        // all attributes of product
        let listAttr = mappedProductAttributes[key]
        //stringify to compare
        listAttr = listAttr.map(attr => JSON.stringify(attr))
        // check if this product have new attribute
        let stringAttr = JSON.stringify(newAtrribute)
        if (!listAttr.includes(stringAttr)) {
            isOk = false;
        }
        // if have new attribute then add all attributes to avaibale attribute
        if (isOk) {
            listAttr = listAttr.map(attr => JSON.parse(attr))

            for (attribute of listAttr) {
                if (mapAvailableAttr[attribute.attributeId] == null) {
                    mapAvailableAttr[attribute.attributeId] = []
                }
                if (
                    !mapAvailableAttr[attribute.attributeId].includes(attribute.value)) {
                    mapAvailableAttr[attribute.attributeId].push(attribute.value)
                }
            }

        }
    }
    return mapAvailableAttr;
}

let priceFormat =  Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })