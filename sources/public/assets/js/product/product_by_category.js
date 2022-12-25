// controll Multi Range slider
var inputLeft = document.getElementById("input-left");
var inputRight = document.getElementById("input-right");

var thumbLeft = document.querySelector(".slider > .thumb.left");
var thumbRight = document.querySelector(".slider > .thumb.right");
var range = document.querySelector(".slider > .range");

function setLeftValue() {
	var _this = inputLeft,
		min = parseInt(_this.min),
		max = parseInt(_this.max);
	_this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);
	var percent = ((_this.value - min) / (max - min)) * 100;
	thumbLeft.style.left = percent + "%";
	range.style.left = percent + "%";
	$('.slider-start').html(_this.value + "đ")
}
setLeftValue();

function setRightValue() {
	var _this = inputRight,
		min = parseInt(_this.min),
		max = parseInt(_this.max);
	_this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);
	var percent = ((_this.value - min) / (max - min)) * 100;
	thumbRight.style.right = (100 - percent) + "%";
	range.style.right = (100 - percent) + "%";
	$('.slider-end').html(_this.value + "đ")

}
setRightValue();

inputLeft.addEventListener("input", setLeftValue);
inputRight.addEventListener("input", setRightValue);

inputLeft.addEventListener("mouseover", function () {
	thumbLeft.classList.add("hover");
});
inputLeft.addEventListener("mouseout", function () {
	thumbLeft.classList.remove("hover");
});
inputLeft.addEventListener("mousedown", function () {
	thumbLeft.classList.add("active");
});
inputLeft.addEventListener("mouseup", function () {
	thumbLeft.classList.remove("active");
	applyFilter()
});
// for mobile
inputLeft.addEventListener("touchend", function () {
	applyFilter()
});


inputRight.addEventListener("mouseover", function () {
	thumbRight.classList.add("hover");
});
inputRight.addEventListener("mouseout", function () {
	thumbRight.classList.remove("hover");

});
inputRight.addEventListener("mousedown", function () {
	thumbRight.classList.add("active");
});
inputRight.addEventListener("mouseup", function () {
	thumbRight.classList.remove("active");
	applyFilter()
});
inputRight.addEventListener("touchend", function () {
	applyFilter()
});
// reset button
$(document).ready(function () {
	$('.btn-reset').on('click', function (e) {
		let uri = new URL(window.location.href);
		window.location.href = uri.pathname;
		// resetLeftValue();
		// resetRightValue();
		// let sizeButtons = $('.size-button')
		// for (let button of sizeButtons) {
		// 	let btn = $(button)
		// 	if (btn.hasClass('btn-primary')) {
		// 		btn.addClass('btn-light')
		// 		btn.removeClass('btn-primary');
		// 	}
		// }
		// selectedSizes = []
	})
})
function resetLeftValue() {
	var _this = inputLeft,
		min = parseInt(_this.min),
		max = parseInt(_this.max);
	_this.value = 0;
	var percent = ((_this.value - min) / (max - min)) * 100;
	thumbLeft.style.left = percent + "%";
	range.style.left = percent + "%";
	$('.slider-start').html(_this.value + "đ")
}
function resetRightValue() {
	var _this = inputRight,
		min = parseInt(_this.min),
		max = parseInt(_this.max);
	_this.value = max;
	var percent = ((_this.value - min) / (max - min)) * 100;
	thumbRight.style.right = (100 - percent) + "%";
	range.style.right = (100 - percent) + "%";
	$('.slider-end').html(_this.value + "đ")

}
function initLeftValue(value) {
	var _this = inputLeft,
		min = parseInt(_this.min),
		max = parseInt(_this.max);
	_this.value = value;
	var percent = ((_this.value - min) / (max - min)) * 100;
	thumbLeft.style.left = percent + "%";
	range.style.left = percent + "%";
	$('.slider-start').html(_this.value + "đ")
}
function initRightValue(value) {
	var _this = inputRight,
		min = parseInt(_this.min),
		max = parseInt(_this.max);
	_this.value = value;
	var percent = ((_this.value - min) / (max - min)) * 100;
	thumbRight.style.right = (100 - percent) + "%";
	range.style.right = (100 - percent) + "%";
	$('.slider-end').html(_this.value + "đ")

}
var selectedSizes = []
// select size buttons
$('.size-button').on('click', function () {
	let btn = $(this)
	if (btn.hasClass('btn-light')) {
		btn.removeClass('btn-light')
		btn.addClass('btn-primary');
		selectedSizes.push(btn.attr('value'))
	} else {
		btn.addClass('btn-light')
		btn.removeClass('btn-primary');
		selectedSizes = selectedSizes.filter(size => size != btn.attr('value'))
	}
	applyFilter()
})

// apply filter button
// $('.apply-filter').on('click',applyFilter)

 function applyFilter() {
	var loc = window.location.pathname;
	var dir = loc.substring(0, loc.lastIndexOf('?'));
	window.location.href = `${dir}?sizes=${JSON.stringify(selectedSizes)}&min=${inputLeft.value}&max=${inputRight.value}`
}

// init selected filter
$(document).ready(function () {
	let url = new URL(window.location.href)
	let sizes = JSON.parse(url.searchParams.get('sizes'))?? [];
	let min = parseInt(url.searchParams.get('min'));
	let max = parseInt(url.searchParams.get('max'));
	if (min.toString() !='NaN') initLeftValue(min)
	if (max.toString() !='NaN') initRightValue(max)
	sizes.forEach(size => {
		selectedSizes.push(size)
		$(`.size-button[value='${size}']`).removeClass('btn-light')
		$(`.size-button[value='${size}']`).addClass('btn-primary')
	});
})
// load more
var threshold = 1297;
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
				let categoryId = uri.pathname.split('/').at(-1);
				let queryParams = {
					page : page,
					categoryid: categoryId,
					sizes:JSON.stringify(selectedSizes),
					min:inputLeft.value,
					max:inputRight.value
				}
                pages = await loadMore(queryParams,'.list-product')
                page+=1;
        } catch (e){
                console.log(e)
                page = pages+1;
        }
        isLoading = false;
    }
})