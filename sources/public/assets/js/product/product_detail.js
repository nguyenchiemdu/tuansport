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
    $('.btn-cart').each(function(){
        $(this).attr('skucode',product.code)
    })
    $('.btn-direct-buy').each(function(){
        $(this).attr('skucode',product.code)
    })
    $('.product-name').html(product.fullName);
    $('#product-status').removeClass('d-none')
    $('#product-status').html(`Tình Trạng:
    <span>Còn ${product.inventories[0].onHand} sản
                    phẩm</span>`)
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
    for (let key in mappedProductAttributes) {
        let isOk = true
        let listAttr = mappedProductAttributes[key]
        listAttr = listAttr.map(attr => JSON.stringify(attr))
        let stringAttr = JSON.stringify(newAtrribute)
        if (!listAttr.includes(stringAttr)) {
            isOk = false;
        }
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
    // console.log(mapAvailableAttr)
    return mapAvailableAttr;
}