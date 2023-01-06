$(document).ready(function() {
    $('.product-row').each(function(product) {
        $(this).on('dblclick', function(e) {
            let row = $(this);
            let id = row.attr('id');
            window.location.href = '/admin/synced-products/'+id
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

async function searchProduct() {
   let text = document.querySelector('#search-text').value;
    var url = new URL(window.location.href);
    url.searchParams.set('name', text);
    url.searchParams.delete('page');
    window.location.replace(url.toString());
}