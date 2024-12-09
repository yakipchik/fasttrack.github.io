var menu = function(){
    var $menuMain = $('.Header-menu > .menu');
    $menuMain.css('position', 'absolute');
    var menuHeight = $menuMain.outerHeight();
    $menuMain.css('position', 'static');
    var $body = $('body');
    function refresh(){
        if (window.innerWidth<990) {
            // $('.menuModal').each(function(){
            //     var $this = $(this);
            //     setTimeout(function(){
            //         if ($this.attr('height') > 0) {
            //             $this.css('height', 0);
            //         }
            //     }, 100);
            // });
            // $('.menuModal').css('height', 0);
            $menuMain.css('position', 'absolute');
            menuHeight = $menuMain.outerHeight();
            $menuMain.css('position', 'static');
        } else {
            menuHeight = $menuMain.outerHeight();
            $('.menuModal')
                .removeClass("menuModal_OPEN")
                .css('height', '');
            $body.removeClass("Site_menuOPEN");
            $('.menuTrigger').removeClass("menuTrigger_OPEN");
        }
    }

    return {
        init: function(){
            if (window.innerWidth<990) {
            $(".menuModal").css('height', menuHeight);
            // Меню для мобильных
                $(".menuTrigger").each(function () {
                    $($(this).attr('href')).css('height', 0);
                });

                $menuMain.on('click', function(e){
                    if ($(e.target).is('.menu-item_parent')){
                        $(e.target).children('.menu-subMenu').toggleClass('menu-subMenu_OPEN');
                    }
                    setTimeout(function(){
                        menuHeight = $menuMain.outerHeight();
                        $('.menuModal').css({
                            'height': menuHeight
                        })
                    }, 200)
                });
            }

            $(".menuTrigger").click(function(e){
                var $this = $(this),
                    href = $this.attr("href");

                if ($this.hasClass("menuTrigger_OPEN")) {
                    $body.removeClass("Site_menuOPEN");
                    $(href)
                        .removeClass("menuModal_OPEN")
                        .css('height', 0);
                    $this.removeClass("menuTrigger_OPEN");
                }else{
                    $body.addClass("Site_menuOPEN");
                    $(href)
                        .addClass("menuModal_OPEN")
                        .css('height', menuHeight);
                    $this.addClass("menuTrigger_OPEN");
                }
                e.preventDefault();
            });
            $(window).on('resize', refresh);
            var $menu_header = $('.ControlPanel-menu > .menu');
            $menu_header.find('.menu-item_parent > .menu-link').after('<span class="menu-arrow"></span>');
            if (window.innerWidth<990) {
                $(document).on('click','.menuModal_OPEN',  function ({target}) {
                    var $target = $(target);
                    var $this = $(this);
                    if ($target.is('a')||$target.closest('a')){
                        setTimeout(function () {
                            $('.menuTrigger[href="#' + $this.attr('id') + '"]').trigger('click');
                        }, 200);
                    }
                });
            }
            if (window.innerWidth<645) {
                $menu_header.find('.menu-arrow').on('click', function(e){
                    e.preventDefault();
                    $(this).closest('.menu-item').trigger('click');
                })
            }

        }
    };
};
menu().init();

