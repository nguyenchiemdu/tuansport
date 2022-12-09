$(document).ready(() => {
    $('.sync-button').on('click', async (e) => {
        let button = $(e.target)
        let body = {
            id: button.attr('productid'),
            skuCode: button.attr('skucode'),
        };
        await fetch('/admin/sync-product', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(body)
        }).then(res => res.json())
            .then(res => {
                response = res;
                if (!response.success) {
                    let isChecked = button.prop('checked')
                    button.prop("checked", !isChecked)
                    alert(response.message);
                }
            })


    })
    $('.sync-all').on('click', function (e) {
        $('.sync-button').each(function (item) {
            let button = $(this)
            let isChecked = button.prop('checked')
            if (!isChecked) {
                button.click()
            }
        })
    })
    $('.unsync-all').on('click', function (e) {
        $('.sync-button').each(function (item) {
            let button = $(this)
            let isChecked = button.prop('checked')
            if (isChecked) {
                button.click()
            }
        })
    })
    $('.category-item').on('dblclick', function (e) {
        e.preventDefault()
        // console.log($(this).attr('id'))
        var url = new URL(window.location.href.split('?')[0]);
        url.searchParams.set('categoryid', $(this).attr('id'));
    window.location.replace(url.toString());

    })
})
async function syncProduct(e) {
    console.log(e.target)
    // product = JSON.parse(product)
    // let body = {
    //     id : product.id,
    //     skuCode: product.code,
    // };
    // await fetch('/admin/sync-product',{
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     method: "POST",
    //     body: JSON.stringify(body)
    // }).then(res=> res.json())
    // .then(res=> {
    //     response = res;
    //     if (!response.success) {
    //         alert(response.message);
    //     }
    // })
}
async function searchProduct() {
    let text = document.querySelector('#search-text').value;
    var url = new URL(window.location.href);
    url.searchParams.set('name', text);
    url.searchParams.delete('page');
    window.location.replace(url.toString());
}