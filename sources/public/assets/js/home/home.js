$(document).ready(function () {
    $(".product-category").owlCarousel({
        items: 4,
        loop: true,
        // margin: 40,
        responsive: {
            1024: {
                items: 4
            },
            800: {
                items: 3,
                autoplay: true

            },
            600: {
                items: 2,
                autoplay: true

            },
            100: {
                items: 2,
                autoplay: true

            },
        }
    });
    $(".policy-row").owlCarousel({
        items: 4,
        loop: true,
        // margin: 30,
        mouseDrag: false,
        touchDrag: false,
        autoHeight: false,
        responsive: {
            1400: {
                items: 4,
            },
            1000: {
                items: 3,
            },
            800: {
                items: 2,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true
            },
            600: {
                items: 1,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true

            },
            100: {
                items: 1,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true
            },
        }
    });
    $(".newest-product").owlCarousel({
        items: 5,
        // remove this 
        // loop: true,
        // margin: 30,
        responsive: {
            1024: {
                items: 5,
            },
            800: {
                items: 3,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true
            },
            600: {
                items: 2,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true

            },
            100: {
                items: 2,
                mouseDrag: true,
                touchDrag: true,
                autoplay: true
            },
        }
    });
});
// load more
var threshold = 1297;
var isLoading = false;
var page = 2;
var pages = 2;
$('.see-more').on('click',async  function() {
    if (page> pages) return;
    // // the height of the entire content (including overflow)
    // var contentHeight = document.documentElement.scrollHeight;
    // // current scroll is height of content that's above the viewport plus
    // // height of the viewport.
    // var contentScrolled = document.body.scrollTop;
    // var distanceToBottom = contentHeight - contentScrolled;
    // var closeToBottomOfPage = distanceToBottom < threshold;
    // var shouldLoadMoreContent = !isLoading && closeToBottomOfPage;

    if(!isLoading) {
        isLoading = true;
		
        try {
				let queryParams = {
					page : page,
				}
                pages = await loadMore(queryParams,'#list-all-products')
                page+=1;
        } catch (e){
                console.log(e)
                page = pages+1;
        }
        isLoading = false;
    }
})











