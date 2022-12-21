console.log('category Tree')


$(document).ready(function(e) {

    
    $(`#tree [aria-level = 1]`).each(function(e) {
        $(this).removeAttr('draggable')
    })

    $('.list-group-item').each(function() {
        if($(this).children().length > 0) 
            $(this).removeAttr('draggable')
    })
    $(document).on('dragstart', function(e) {
        let id =  e.target.getAttribute('data-bs-target')
        // Set data to drop
        e.originalEvent.dataTransfer.setData('element', e.target.getAttribute('data-bs-target'))

    })

    if ($('#list-free-category [role="treeitem"]').length == 0) {
        $('#item-test').removeClass('d-none')
    }
    $('#tree').on('drop', async function(e) {
        // Get element to drop
        let id = e.originalEvent.dataTransfer.getData('element')
        let element = $(`[data-bs-target="${id}"]`)
        let level = parseInt($(e.target).attr('aria-level'))
        await $(element).css('padding-left', `${level * 1.25}rem`)
        await $(element).attr('aria-level', `${level}`)

        let groupId = $(e.target).attr('data-bs-target').slice(1);
        let groupElement = $(`#${groupId}`)
        
        let parentGroupId
        let parentId
        if ($(groupElement).length != 0) {
            await $(element).css('padding-left', `${(level+1) * 1.25}rem`)
            await $(element).attr('aria-level', `${level+1}`)
            parentId = $(e.target).attr('id')
            $(groupElement).append($(element))
        } else {
            parentGroupId = $(e.target).parent().attr('id')
            parentId = $(`[data-bs-target="#${parentGroupId}"]`).attr('id')
            $(e.target).parent().append($(element))
        }

        if ($('#list-free-category [role="treeitem"]').length == 0) {
            $('#item-test').removeClass('d-none')
        }
        // Save position of element
       
        // if ($(e.target).attr('aria-level') != '1') {
        //     parentGroupId = $(e.target).parent().attr('id')
        //     parentId = $(`[data-bs-target="#${parentGroupId}"]`).attr('id')
        // } else {
        //     parentId = $(e.target).attr('id')
        // }
        let categoryId = $(element).attr('id')
        await fetch(`/admin/category/${categoryId}/position`, {
            method: 'PATCH',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({parentId})
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
            }
        })
    })

    $('#list-free-category').on('drop', async function(e) {
        
        
        // Get element to drop
        let id = e.originalEvent.dataTransfer.getData('element')
        let element = $(`[data-bs-target="${id}"]`)
        // Config element 
        await $(element).css('padding-left', `${1.25}rem`)
        await $(element).attr('aria-level', `1`)
        if ($(e.target) == $(this)) {
            console.log('true')
            await $(e.target).append($(element))
        } else {
            await $(e.target).parent().append($(element))
        }
        $('#item-test ').addClass('d-none')
        
        // Save position of element
        let categoryId = await $(element).attr('id')
        await fetch(`/admin/category/${categoryId}/position`, {
            method: 'PATCH',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({parentId: 0})
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
            }
        })
    })
    $('.list-group-item').on('dragover', function(e) {
        e.preventDefault();
    })
})

