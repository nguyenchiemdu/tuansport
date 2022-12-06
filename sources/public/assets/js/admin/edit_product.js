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
    $('form#edit-form :input[name="images"]').each(function () {
        $(this).on('blur', function () {
            let parent = $(this).parent().parent()

            let src = $(this).val()
            $(parent).each(function () {
                $(this).find('img').attr('src', src)
            })
        })
        $(this).on('input', function () {
            let parent = $(this).parent().parent()

            let src = $(this).val()
            $(parent).each(function () {
                $(this).find('img').attr('src', src)
            })
        })
    })
})