
function removeElement(e) {
    e.preventDefault()
    let parent = $(this).parent().parent().parent().parent()
    $(parent).remove()
    let i = 0
    $('[data-index]').each(function() {
        $(this).attr('data-index', `${i++}`)
    })
}

function preventSpaceCharacter(e) {
    if(e.keyCode === 32) {
        return false;
    }
}

$(document).ready(function () {
    $('.btn-apply').on('click', async function (e) {
        let body = {
            images: [],
            tags: [],
        }

        $("form#edit-form :input").each(function () {
            var input = $(this);
            let inputName = input.attr('name')
            if (inputName == null) return
            if (inputName != 'images' && inputName != 'tags') {
                body[inputName] = input.val()
            } else {
                body[inputName].push(input.val())
            }
        });
        let flag = true
        for (let key of body.tags) {
            if (key.trim() == '') {
                alert('Tag sản phẩm không được để trống !')
                flag = false
                return false
            } 
        }   
        if (flag) {
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
        }
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
                button.parent().parent().parent().parent().remove()
            } else {
                alert(response.message)
            }
        })
    })

    $('.add-tag-btn').on('click',async function(e) {
        e.preventDefault()
        let id = window.location.pathname.split('/')[3]
        let length = $('.tag-area').children().length || 0
        let tagElement = `
        <div class="col-md-3 py-2" >
            <div class="input-group">
                <input class="form-control" placeholder="Nhập tag sản phẩm" id="tag-name" name="tags" value="" />
                <div class="input-group-append">
                    <span data-index="${length++}>">
                        <i class="fa-solid fa-x remove-tag-icon" style="padding: 11px 10px;"></i>
                    </span>
                </div>
            </div>
        </div>
        `
        $('.tag-area').append(tagElement)
    })

    $(document).on('click', '.remove-tag-icon', removeElement)

    $(document).on('keydown', 'input[name="tags"]', preventSpaceCharacter)


})

