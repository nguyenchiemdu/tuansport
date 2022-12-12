console.log('category Tree')


$(document).ready(function() {
    $('.list-group-item').each(function() {
        $(this).removeClass('selected')
    })


    $('.list-group-item').on('dragstart', function(e) {
        console.log('drag')
        if (!$(e.target).children().length) {
            e.originalEvent.dataTransfer.setData('element', e.target.getAttribute('data-bs-target'))
    }
    })

    $(document).on('drop', async function(e) {
        console.log('drop')
        let id = e.originalEvent.dataTransfer.getData('element')
        let element = $(`[data-bs-target="${id}"]`)
        let level = parseInt($(e.target).attr('aria-level'))
        await $(element).css('padding-left', `${level * 1.25}rem`)
        await $(element).attr('aria-level', `${level}`)
        await $(e.target).parent().append($(element))
        
    })

    $('.list-group-item').on('dragover', function(e) {
        e.preventDefault();
    })
})

