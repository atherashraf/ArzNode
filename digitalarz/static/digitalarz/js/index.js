/**
 * Created by Dr. Ather Ashraf on 1/8/2019.
 */

// jQuery to collapse the navbar on scroll
function collapseNavbar() {
    var className = "bg-site";
    if ($("#top_nav").offset().top > 50) {
        $("#top_nav").addClass(className);
        $("#bottom_nav").addClass(className);
        $("#logo").css("opacity", "0.5")
    } else {
        $("#top_nav").removeClass(className);
        $("#bottom_nav").removeClass(className);
        $("#logo").css("opacity", "1")
    }
}

$(window).scroll(collapseNavbar);
$(document).ready(collapseNavbar);

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
    $('a.page-scroll').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});