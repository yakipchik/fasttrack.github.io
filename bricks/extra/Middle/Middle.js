var Middle = function(){
    let $middleTop = $('.Middle-top').eq(0);
    return {
        init: function(){
            function calcCQH(e) {
                $middleTop.css('--cqhMT', $middleTop.outerHeight() / 100)
            }
            calcCQH();
            $(window).on('resize', calcCQH);
        }
    };
};
Middle().init();
