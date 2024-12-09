var tags = function(){
    let $wrap  = $('.Site-wrap');
    let $body = $('body');
    let $html = $('html');
    return {
        init: function(){
            function reloadSideMg() {
                let leftWrapMg = $wrap.offset().left;
                let widthDocument = $html.outerWidth();
                $body.css({
                    '--wrapMgSide': leftWrapMg + 'px'
                });
                $html.css({
                    '--htmlWidth': widthDocument
                });

            }
            reloadSideMg();
            var doit;
            $(window).on('resize', function () {
                clearTimeout(doit);
                doit = setTimeout(reloadSideMg, 20);
            });
        }
    };
};
tags().init();
