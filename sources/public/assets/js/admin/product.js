$(document).ready(() => {
    let isFullCheckedSynced = $('.sync-button').length == $('.sync-button:checked').length
    if (isFullCheckedSynced) {
        $('.sync-all').addClass('d-none')
        $('.unsync-all').removeClass('d-none')
    } else {
        $('.sync-all').removeClass('d-none')
        $('.unsync-all').addClass('d-none')
    }

    let isFullCheckedMarked = $('.marked-point').length == $('.marked-point.selected').length
    if (isFullCheckedMarked) {
        $('.marked-all').addClass('d-none')
        $('.unmarked-all').removeClass('d-none')
    } else {
        $('.marked-all').removeClass('d-none')
        $('.unmarked-all').addClass('d-none')
    }

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
                } else {
                    let isFullChecked = $('.sync-button').length == $('.sync-button:checked').length
                    if (isFullChecked) {
                        $('.sync-all').addClass('d-none')
                        $('.unsync-all').removeClass('d-none')
                    } else {
                        $('.sync-all').removeClass('d-none')
                        $('.unsync-all').addClass('d-none')
                    }
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

    $('.marked-point').on('click', async (e) => {
        let button = $(e.target)
        let body = {
            id: button.attr('productid'),
            skuCode: button.attr('skucode'),
        };
        
        await fetch('/admin/sync-marked', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(body)
        }).then(res => res.json())
            .then(res => {
                response = res;
                if (response.success) {
                    let isChecked = button.hasClass('selected')
                    button.toggleClass('selected', !isChecked)
                    let isFullChecked = $('.marked-point').length == $('.marked-point.selected').length
                    if (isFullChecked) {
                        $('.marked-all').addClass('d-none')
                        $('.unmarked-all').removeClass('d-none')
                    } else {
                        $('.marked-all').removeClass('d-none')
                        $('.unmarked-all').addClass('d-none')
                    }
                }
                 else alert(response.message);
            })
    })

    $('.marked-all').on('click', function (e) {
        $('.marked-point').each(function (item) {
            let button = $(this)
            let isChecked = button.hasClass('selected')
            if (!isChecked) {
                button.click()
            }
        })
        $(this).addClass('d-none')
        $('.unmarked-all').removeClass('d-none')

    })
    $('.unmarked-all').on('click', function (e) {
        $('.marked-point').each(function (item) {
            let button = $(this)
            let isChecked = button.hasClass('selected')
            if (isChecked) {
                button.click()
            }
        })
        $(this).addClass('d-none')
        $('.marked-all').removeClass('d-none')
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