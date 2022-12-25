console.log("search.js");
// load more
var threshold = 1060;
var isLoading = false;
var page = 2;
var pages = 2;
window.addEventListener('scroll',async  function() {
    if (page> pages) return;
    // the height of the entire content (including overflow)
    var contentHeight = document.documentElement.scrollHeight;
    // current scroll is height of content that's above the viewport plus
    // height of the viewport.
    var contentScrolled = document.body.scrollTop;
    var distanceToBottom = contentHeight - contentScrolled;
    var closeToBottomOfPage = distanceToBottom < threshold;
    var shouldLoadMoreContent = !isLoading && closeToBottomOfPage;
    if(shouldLoadMoreContent) {
        isLoading = true;
		
        try {
				let uri = new URL(window.location.href);
				let queryParams = paramsToObject(uri.searchParams)
                queryParams.page = page
                pages = await loadMore(queryParams,'.list-product')
                page+=1;
        } catch (e){
                console.log(e)
                page = pages+1;
        }
        isLoading = false;
    }
})

function paramsToObject(entries) {
    const result = {}
    for(const [key, value] of entries) {
      result[key] = value;
    }
    return result;
}