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
        e.originalEvent.dataTransfer.setData('index', $(e.target).index())   
    })

    if ($('#list-free-category [role="treeitem"]').length == 0) {
        $('#item-test').removeClass('d-none')
    }
    $('#tree').on('drop', async function(e) {
        // Get element to drop
        let id = e.originalEvent.dataTransfer.getData('element')
        let element = $(`[data-bs-target="${id}"]`)

        // Sibling element before drop
        let prevElementId = $(element).prev().attr('id') || null
        let nextElementId = $(element).next().attr('id') || null

        let level = parseInt($(e.target).attr('aria-level'))
        await $(element).css('padding-left', `${level * 1.25}rem`)
        await $(element).attr('aria-level', `${level}`)

        let groupId = $(e.target).attr('data-bs-target').slice(1);
        let groupElement = $(`#${groupId}`)
        
        let parentGroupId
        let parentId

        let oldIndex = e.originalEvent.dataTransfer.getData('index')
        let newIndex = $(e.target).index()
        let nextSiblingAfterId, prevSiblingAfterId
        
        if ($(element).parent().attr('id') != 'list-free-category'){
            if (oldIndex != newIndex) {
                if ($(groupElement).length != 0){
                    await $(element).css('padding-left', `${(level+1) * 1.25}rem`)
                    await $(element).attr('aria-level', `${level+1}`)
                    parentId = $(e.target).attr('id')
                    $(groupElement).append($(element))
                } else {
                    parentGroupId = $(e.target).parent().attr('id')
                    parentId = $(`[data-bs-target="#${parentGroupId}"]`).attr('id')
                    if (oldIndex !== newIndex) {
                    
                            if (newIndex < oldIndex) {
                                nextSiblingAfterId = $(e.target).attr('id')
                                prevSiblingAfterId = $(e.target).prev().attr('id') || null
                                await $(e.target).before($(element))
                            } else {
                                prevSiblingAfterId = $(e.target).attr('id')
                                nextSiblingAfterId = $(e.target).next().attr('id') || null
                                await $(e.target).after($(element))
                            }
                        }
                    }
            }
        } else {

            if ($(groupElement).length != 0){
                await $(element).css('padding-left', `${(level+1) * 1.25}rem`)
                await $(element).attr('aria-level', `${level+1}`)
                parentId = $(e.target).attr('id')
                $(groupElement).append($(element))
            } else {
                parentGroupId = $(e.target).parent().attr('id')
                parentId = $(`[data-bs-target="#${parentGroupId}"]`).attr('id')
                if (oldIndex !== newIndex) {
                
                        if (newIndex < oldIndex) {
                            nextSiblingAfterId = $(e.target).attr('id')
                            prevSiblingAfterId = $(e.target).prev().attr('id') || null
                            await $(e.target).before($(element))
                        } else {
                            prevSiblingAfterId = $(e.target).attr('id')
                            nextSiblingAfterId = $(e.target).next().attr('id') || null
                            await $(e.target).after($(element))
                        }
                    }
                }
            // if (newIndex < oldIndex) {
            //     nextSiblingAfterId = $(e.target).attr('id')
            //     prevSiblingAfterId = $(e.target).prev().attr('id') || null
            //     await $(e.target).before($(element))
            // } else {
            //     prevSiblingAfterId = $(e.target).attr('id')
            //     nextSiblingAfterId = $(e.target).next().attr('id') || null
            //     await $(e.target).after($(element))
            // }
        }
        
        if ($('#list-free-category [role="treeitem"]').length == 0) {
            $('#item-test').removeClass('d-none')
        }
        // Save position of element
        let categoryId = $(element).attr('id')
        console.log(`element: ${categoryId} ,prev Sibling after: ${prevSiblingAfterId}, next Sibling after: ${nextSiblingAfterId}, prev Sibling before: ${prevSiblingBeforeId}, next Sibling before: ${nextSiblingBeforeId}`)
        let body = {
            // Category
            parentId: parentId,
            // Previous sibling after drop
            prevSiblingAfterId,
            // Next sibling after drop
            nextSiblingAfterId,
            // Previous sibling before drop
            prevSiblingBeforeId,
            // Next sibling before drop
            nextSiblingBeforeId
        }
        await fetch(`/admin/category/${categoryId}/position`, {
            method: 'PATCH',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
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
        
        let prevSiblingId = $(element).prev().attr('id') || null
        let nextSiblingId = $(element).next().attr('id') || null

        // Config element 
        await $(element).css('padding-left', `${1.25}rem`)
        await $(element).attr('aria-level', `1`)

        let oldIndex = e.originalEvent.dataTransfer.getData('index')
        let newIndex = $(e.target).index()

        if (oldIndex !== newIndex) {
            if (newIndex < oldIndex) {
                await $(e.target).before($(element))
            } else {
                await $(e.target).after($(element))
            }
        }

        
        console.log(`id prev sibling element: ${prevSiblingId}, id prev sibling element: ${nextSiblingId}`)
        // if ($(e.target) == $(this)) {
        //     await $(e.target).append($(element))
        // } else {
        //     await $(e.target).parent().append($(element))
        // }
        $('#item-test ').addClass('d-none')
        
        // Save position of element
        let categoryId = await $(element).attr('id')
        await fetch(`/admin/category/${categoryId}/position`, {
            method: 'PATCH',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                parentId: 0,
                prevSiblingId,
                nextSiblingId,
            })
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

