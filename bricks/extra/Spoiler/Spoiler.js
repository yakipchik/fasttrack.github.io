var Spoiler = function(){
    var $HideBlock = $('.Spoiler');
    var $trigger = $HideBlock.find('.Spoiler-trigger');
    $HideBlock.addClass('Spoiler_CLOSE');
    return {
        init: function(){
            $trigger.on('click', function(e){
                e.preventDefault();
                var $this = $(this);
                var scroll = $(window).scrollTop();
                var $parent = $this.closest($HideBlock);
                if ($parent.hasClass('Spoiler_CLOSE')) {
                    $parent.removeClass('Spoiler_CLOSE');
                    $(window).scrollTop(scroll);
                } else {
                    $parent.addClass('Spoiler_CLOSE');
                    $(window).scrollTop(scroll);
                }
            });
        }
    };
};
Spoiler().init();
