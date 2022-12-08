$(document).ready(function() {
    $('.btn-update-password').click(function() {
        let body = {}
        $('.form input').each(function(){
            input  = $(this)
            body[input.attr('name')] = input.val()
        }
        )
        fetch ('/admin/password',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(body)
        }).then(res=> res.json())
        .then((response)=> {
            if (response.success){
                console.log('oke')
            } else {
                console.log(response.message)
            }
        })
    })
})