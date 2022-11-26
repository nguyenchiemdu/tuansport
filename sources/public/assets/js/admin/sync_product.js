
async function syncProduct(product) {
    product = JSON.parse(product)
    let body = {
        skuCode: product.code,
        name: product.name,
        price: product.basePrice,
        ctvPrice: product.priceBooks.find(e => e.priceBookName == 'GIÁ CTV').price,
        images: product.images,
        categoryId: product.categoryId
    };
    await fetch('/admin/sync-product',{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(body)
    }).then(res=> res.json())
    .then(res=> {
        response = res;
        if (!response.success) {
            alert(response.message);
        }
    })
}
async function searchProduct() {
    let text = document.querySelector('#search-text').value;
    var url = new URL(window.location.href.split('?')[0]);
    url.searchParams.set('name', text);
    window.location.replace(url.toString());
}