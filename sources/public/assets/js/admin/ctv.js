console.log('ctv.js')
async function searchCtv() {
    let text = document.querySelector('#search-text').value;
    var url = new URL(window.location.href.split('?')[0]);
    url.searchParams.set('username', text);
    window.location.replace(url.toString());
}
function onRowClick(e) {
    rowsElements.forEach(element=> element.classList.remove('selected'));
    e.path[1].classList.add('selected');
}
function onEdit(e) {
    selectedRow =Array.from(rowsElements).find(element=> element.classList.contains('selected'))
    if (selectedRow!= null)
    window.location.replace("/admin/ctv/"+selectedRow.id);
}
async function onDelete(e) {
    selectedRow =Array.from(rowsElements).find(element=> element.classList.contains('selected'))
    res = await fetch('/admin/ctv/'+selectedRow.id,{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        method: 'DELETE',
        mode: 'cors',
    }).then(res=>res.json())
    if(res.success){
        selectedRow.remove()
    $('.toast-success').toast('show');
    } else{
    $('.toast-failed').toast('show');

    }
}
rowsElements = document.querySelectorAll('tr')
rowsElements.forEach(element => {
    element.addEventListener('click', onRowClick)
});
let editButton = document.getElementById('btn-edit')
let deleteButton = document.getElementById('btn-delete')

editButton.addEventListener('click',onEdit)
deleteButton.addEventListener('click',onDelete)