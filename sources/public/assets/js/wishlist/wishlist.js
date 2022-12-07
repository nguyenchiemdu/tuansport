console.log('wishlist')
// render wishlist
$(document).ready(function () {
    let wishlist = window.localStorage.getItem('wishlist');
    wishlist = JSON.parse(wishlist);
    if (wishlist == null) wishlist = []
    Promise.all(wishlist.map(async skuCode => {
        await fetch('/api/product/code/' + skuCode, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "GET",
        }).then(res => res.json())
            .then(res => {
                response = res;
                if (response.success) {

                    let product = response.data
                    let isOutOfStock = product.inventories[0].onHand == 0
                    let isHasAttribute = product.attributes
                    let isHasColor 
                    if (isHasAttribute) {
                        isHasColor = product?.attributes[1]?.attributeValue == undefined
                    }
                    let isHasProduct = res.length == 0
                    let isHasImage = product.images == undefined
                    let htmlTagWeb = `
                    <tr skucode='${product.code}' class=" product-item ${product.code}">
                        <td> <!-- Image item -->
                          <img src="${!isHasImage ? product.images[0] : ''}" alt="${product.name}" alt="" width="120px" height="120px" style="border-radius: 20px; object-fit: cover" />
                        </td> <!-- Image item -->
                        <td> <!-- Name item -->
                            <div class="product-name align-middle mt-3 mt-lg-0 mt-xl-0 mt-xxl-0 ms-0 ms-lg-3 ms-xl-3 ms-xxl-4">
                                <h3 class="text-start short-description">${product.name}</h3>
                            </div>
                        </td>  <!-- Name item -->
                        <td class="text-center"> <!-- Price -->
                          <h3>${product.basePrice}đ</h3>
                        </td> <!-- Price -->
                        <td> <!-- Status -->
                        ${isOutOfStock ? '<h5 class="status is-unavaliable p-2 text-center">Hết hàng</h5>' : '<h5 class="status is-avaliable p-2 text-center">Còn hàng</h5>'}
                          
                        </td> <!-- Status -->
                        <td class="pe-0 me-1 ps-4 "> <!-- Icon -->
                         <i class="ms-lg-3 ms-xl-3 ms-xxl-3 mb-2 mb-lg-0 mb-xl-0 mb-xxl-2 fa-solid fa-cart-shopping action-icon add-item-list text-center invisible"></i> 
                          <i skucode='${product.code}' class="ms-lg-3 ms-xl-3 ms-xxl-3 mt-2 mt-lg-0 mt-xl-0 mt-xxl-2 fa-regular fa-x action-icon remove-item-list text-center hover-bigger"></i>
                        </td> <!-- Icon -->
                      </tr>`
                    $('#list-product-web').append(htmlTagWeb)
                    let htmlTagMobile = `
                                <div skucode='${product.code}' class="my-3 product-item ${product.code}"> <!-- Item -->
                                    <div class="row align-items-center">
                                        <div class="col-7 d-flex align-items-center"> <!--Name-->
                                        <img src="${!isHasImage ? product.images[0] : ''} alt="${product.name}" width="60px" height="60px" style="border-radius: 5px; object-fit: cover" /> 
                                        <span class="align-middle mt-3 mt-lg-0 mt-xl-0 mt-xxl-0 ms-0 ms-lg-3 ms-xl-3 ms-xxl-4">
                                            <h5 class="ms-2 short-description text-start">${product.name}</h5>
                                        </span>
                                        </div>
                                        <div class="col-5 pt-3 ps-4"> <!-- Price-->
                                        <h5>${product.basePrice}đ</h5>
                                        </div>
                                    </div>
                                    <div class="row align-items-center">
                                        <div class="col-7 d-flex align-items-center"> <!--Status-->
                                        <h5>Tình trạng: </h5>
                                        ${isOutOfStock ? '<span class="mx-2 status-mobile is-unavaliable"><h5>Hết hàng</h5></span>' : ' <span class="mx-2 status-mobile is-avaliable"><h5>Còn hàng</h5></span>'}
                                       
                                        </div>
                                        <div class="col-5"> <!-- Icon -->
                                        <i class="ms-3 mb-2 mb-lg-0 mb-xl-0 mb-xxl-2 fa-solid fa-cart-shopping action-icon  hover-bigger add-item-list text-center invisible"></i>
                                        <i skucode='${product.code}' class="ms-3 mt-2 mt-lg-0 mt-xl-0 mt-xxl-2 fa-regular fa-x action-icon hover-bigger  remove-item-list text-center"></i>
                                        </div>
                                    </div>
                                </div>`
                    $('#list-product-mobile').append(htmlTagMobile)

                } else {
                    console.log(response)
                }
            })
    })).then(function () {
        $('.remove-item-list').on('click', function (e) {
            e.stopPropagation()
            let skuCode = $(this).attr('skucode')
            let wishlist = window.localStorage.getItem('wishlist');
            wishlist = JSON.parse(wishlist);

            if (wishlist == null) wishlist = [];
            wishlist = wishlist.filter(function (item) {
                return item !== skuCode
            })
            wishlist = new Set(wishlist)
            wishlist = Array.from(wishlist)

            if (wishlist.length > 0) {
                let badge = `
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    ${wishlist.length}
                </span>  
                `
                $("#wishlist-nav-icon").append(badge)
            } else $("#wishlist-nav-icon").children('.badge').html(wishlist.length)

            if (wishlist.length == 0) {
                $("#wishlist-nav-icon").children('.badge').remove()
            }
            window.localStorage.setItem('wishlist', JSON.stringify(wishlist))
            let products = $('.product-item.' + skuCode)
            for (let item of products) {
                $(item).addClass('d-none')
            }
        })
        $('.product-item').on('click', function (e) {
            let btn = $(this)
            let skuCode = btn.attr('skucode')
            window.location.href = '/san-pham/' + skuCode;
        })
    })
})
