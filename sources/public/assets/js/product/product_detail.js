console.log('product_detail');

let selecedAttributes = {};
$(document).ready(function () {
    initCarousel();
    // selected attribute and show product left
    $('.attribute-button').on('click', async function (e) {
        let attributeId = parseInt($(this).attr('attributeId'))
        let value = $(this).attr('value')
        let newValue = {
            attributeId: attributeId,
            value: value
        }
        // condition to reduce spam
        let isNew = !(JSON.stringify(newValue) == JSON.stringify(selecedAttributes[attributeId]))
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
                updateSelectedAttributeButton(this)
                console.log(targetKey)
                res = await fetch('/api/product/' + targetKey)
                    .then(res => res.json())
                if (res.success) {
                    updateSelectedProduct(res.data)
                } else {
                    alert(res.message);
                }
            }
        } else if (Object.keys(selecedAttributes).length != Object.keys(mapAttributes).length){
            updateSelectedAttributeButton(this)
        }
    })
    $(".product-item").on('click', function(e){
        let skuCode = ($(this).attr('code'))
        window.location.href = '/san-pham/'+skuCode;
    })
});


function initCarousel() {
    $(".thumb-slider").owlCarousel({
        items: 1,
        loop: true,
        center: true,
        margin: 20,
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
        loop: false,
        margin: 20,
    });
}
function updateSelectedProduct(product) {
    $('#skuCode').html(product.code);
    $('#product-status').removeClass('d-none')
    $('#product-status').html(`Tình Trạng:
    <span>Còn ${product.inventories[0].onHand} sản
                    phẩm</span>`)
}
function updateSelectedAttributeButton(button){

    let attributeId = parseInt($(button).attr('attributeId'))
    let listBtn = $('.attribute-button.'+attributeId);
    for (let btn of listBtn) {
        $(btn).removeClass('btn-primary')
    }
    $(button).removeClass('btn-light')

    $(button).addClass('btn-primary')
}