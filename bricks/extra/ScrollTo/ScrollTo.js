var ScrollTo = function(){
    var $elements = $('.ScrollTo');
    return {
        init: function(){
            var heightHeader = $('.Header_scroll').outerHeight() || $('.Header').outerHeight();
            $(window).on('resize', function () {
                heightHeader = $('.Header_scroll').outerHeight() || $('.Header').outerHeight();
            });
            $elements.on('click', function (e) {
                e.preventDefault();
                var $this = $(this),
                    href = $this.attr('href'),
                    $href = $(href),
                    zoom = parseFloat($('.Site').css('zoom'));
                var top = $href.get(0).getBoundingClientRect().top; // $href.get(0).offsetTop
                // var scrollTop = parseFloat($('html').get(0).scrollTop);
                window.scrollTo({
                    top: (top) + ((parseFloat($href.css('padding-top')) - 40) * zoom),
                    behavior: 'smooth'
                });
                $('.modal_menu.modal_OPEN .modal-close').trigger('click');
            });
        }
    };
};
ScrollTo().init();
