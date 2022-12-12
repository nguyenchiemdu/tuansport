$(document).ready(function () {
    $('.btn-apply').on('click', async function (e) {
        let body = {
            images: []
        }
        $("form#edit-form :input").each(function () {
            var input = $(this);
            let inputName = input.attr('name')
            if (inputName == null) return
            if (inputName != 'images') {
                body[inputName] = input.val()
            } else {
                body[inputName].push(input.val())
            }
        });
        console.log(body)
        await fetch(window.location.href,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "PUT",
                body: JSON.stringify(body)
            }).then(res => res.json()).
            then(response => {
                if (response.success) {
                    $('#update-success').toast('show')
                } else {
                    $('#update-failed').toast('show')
                }
            })
    })
    $('#edit-form input[name="images"]').each(function () {
        $(this).on('blur', function () {
            let parent = $(this).parent()
            let src = $(this).val()
            $(parent).each(function () {
                $(this).children('div').css('background-image', `url('${src}')`)
            })
        })
        $(this).on('input', function () {
            let src = $(this).val()
            $(this).parent().css('background-image', `url('${src}')`)
            // let parent = $(this).parent()

            // let src = $(this).val()
            // $(parent).each(function () {
            //     $(this).children('div').css('background-image',`url('${src}')`)
            // })
        })
    })
    $('.btn-delete-img').click(function (e) {
        var url = new URL(window.location.href.split('?')[0]);
        let button = $(this);
        let imageUrl = $(this).attr('url');
        let body = {
            url: imageUrl
        }
        e.preventDefault()
        fetch(url + '/delete-img', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(res=> res.json())
        .then(res=> {
            if (res.success) {
                button.parent().parent().remove()
            } else {
                alert(response.message)
            }
        })
    })
})