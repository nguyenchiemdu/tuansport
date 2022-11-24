async function searchCtv() {
    let text = document.querySelector('#search-text').value;
    var url = new URL(window.location.href.split('?')[0]);
    url.searchParams.set('username', text);
    window.location.replace(url.toString());
}