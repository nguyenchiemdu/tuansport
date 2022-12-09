$(document).ready(function() {
    $('.product-row').each(function(product) {
        $(this).on('dblclick', function(e) {
            let row = $(this);
            let id = row.attr('id');
            window.location.href = '/admin/synced-products/'+id
        })
    })
})

async function searchProduct() {
    let text = document.querySelector('#search-text').value;
    var url = new URL(window.location.href.split('?')[0]);
    url.searchParams.set('name', text);
    window.location.replace(url.toString());
}