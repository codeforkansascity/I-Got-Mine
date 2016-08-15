/*
 * Scroll To Top functionality
 * Original Code Example: http://jsfiddle.net/gilbitron/Lt2wH/
 */

$(document).ready(function () {
    "use stricT";

    var $scrollToTopElement = $('#scrollToTop'),
        lastKnownPixelsFromTop = $(window).scrollTop(),
        scrollTriggerAreaInPixels = 100,
        animationTimeInMilliseconds = 700;

    initialize();

    function initialize() {
        onScroll();
        $(window).on('scroll', onScroll);
        $scrollToTopElement.on('click', onScrollToTopClick);
    }

    function onScrollToTopClick(event) {
        event.preventDefault();

        $('html,body').animate({
            scrollTop: 0
        }, animationTimeInMilliseconds);
    }

    function onScroll() {
        var currentPixelsFromTop = $(window).scrollTop(),
            isScrollingUp = currentPixelsFromTop < lastKnownPixelsFromTop,
            isOutsideOfTriggerArea = currentPixelsFromTop > scrollTriggerAreaInPixels;

        if (isScrollingUp && isOutsideOfTriggerArea) {
            $scrollToTopElement.show();
        } else {
            $scrollToTopElement.hide();
        }

        lastKnownPixelsFromTop = currentPixelsFromTop;
    }
});