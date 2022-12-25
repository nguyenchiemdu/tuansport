let priceFormat =  Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
function formatedPrice(item) {
    let user = document.querySelector('[user]')
    let price;
    if (user){
            price =  item.ctvPrice
            return  'CTV: '+`<span class="text-color-tertiary">${priceFormat.format(price)}</span>`
    } else  {
     price =  item.price;
    return priceFormat.format(price)
    }
}
function secondaryPrice(item){
    let user = document.querySelector('[user]')

let price;
    if (user){
            price =  item.price
            return  'Giá bán: '+priceFormat.format(price)
    } else  {
     price =  item.salePrice;
    return priceFormat.format(price)
    }
}

function renderProductItem(item) {
 
return `<a href="/san-pham/${item.skuCode}"/> <div skucode='${item.skuCode} '
    class="product-item col hover-bigger fade-in" onload="document.body.style.opacity='1'">
    <div class="rounded-4 ratio ratio-1x1"
            style="background-image: url('${item.images[0]}');background-size:cover">
            <div class="d-float">
                    <div class="float-end mt-3 me-3">
                            <button skucode="${item.skuCode }"
                                    class="btn btn-wishlist no-listen btn-light ${item.skuCode } rounded-circle px-2 py-2">
                                    <img class=""
                                            src="/assets/images/svg/love.svg"
                                            style="width:21px;height: auto; " />
                            </button>
                    </div>
            </div>
    </div>
    <div class="mt-3">
            <h4 class="short-description">
                    ${item.name}
            </h4>
    </div>
    <div>
            <h3>
                    ${formatedPrice(item)}
            </h3>
            <div class="row row-cols-2">

                    <div class="col-8">
                        ${ (item.salePrice!= null)?
                            `<h6
                            style="color: var(--dark-gray-color)">
                            <s>
                                ${secondaryPrice(item)}
                            </s>
                            </h6>`
                            :'' } 
                    </div>
                    <div class=" col-4 position-relative ">
                            <div class="p-2"
                                    style="position:absolute;bottom: 0;right: 12px;">
                                    <button skucode="${item.skuCode}"
                                            class="btn btn-cart btn-light px-3 py-3 d-none">
                                            <img class="d-block"
                                                    src="/assets/images/svg/cart.svg"
                                                    style="width:21px;height: auto;" />
                                    </button>
                            </div>

                    </div>
            </div>
    </div>
</div></a>`
}
function addListerner() {
        $('.btn-wishlist.no-listen').on('click',addToWishlist)
        $('.btn-wishlist.no-listen').each(btn=> $(this).removeClass('no-listen'))
}

async function loadMore(query,queryContainer,) {
    let pages;
    let listAllProducts = $(queryContainer)
    listAllProducts.parent().append(`
    <div class="loading d-flex justify-content-center my-2">
    <div class="spinner-border" role="status">
    </div>
  </div>
  `)      
    await fetch('/api/products?'+new URLSearchParams(query))
    .then(res=> res.json())
    .then(response=> {
        if (response.success) {
            //render 
            
          
            for (let product of response.data.docs) listAllProducts?.append(renderProductItem(product))
            addListerner()
            pages = parseInt(response.data.pages)
        }
    })
    .catch(err=> {console.log(err)})
    listAllProducts.parent().children('.loading').remove()

    return pages;
}