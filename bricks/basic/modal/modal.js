let modal = function(){
    let $MobileControl = $('.MobileControl');
    let $Header = $('.Header');
    let $body = $('body');
    function setVh() {
        let vh = window.innerHeight * 0.01;

        $body.css({
            '--MobileControlHeight': $MobileControl.outerHeight()||0 + 'px',
            '--HeaderHeight': $Header.outerHeight()||0 +'px'
        });
        document.documentElement.style.setProperty('--vh', `${vh}px`);


        if ( (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0))) {
            $('.Site').addClass('Site_touchscreen');
        } else {
            $('.Site').removeClass('Site_touchscreen');
        }
    }
    setVh();
    var doit;
    $(window).on('resize', function () {
        clearTimeout(doit);
        doit = setTimeout(setVh, 100);
    });

    let $trigger = $('.trigger'),
        $modal = $('.modal');

    let template = {
        img: (img) => '<div class="modal modal_pict">' +
                        '<div class="modal-window">' +
                            '<a href="#" class="modal-close"><span></span><span></span></a>' +
                            '<div class="modal-content">' +
                            '<img src="' + img + '"  class="modal-img"/>' +
                            '</div>' +
                        '</div>' +
                    '</div>'
    };

    return {
        refresh: function(){
        },
        trigger: function (href, type, $thisElem) {
            var $href = $(href);
            if($thisElem.attr('data-href')) {
                $href = $($thisElem.attr('data-href'));
            } else if($thisElem.attr('href')) {
                $href = $($thisElem.attr('href'));
            } else {
                $href = $thisElem.find('.modal');
            }
            function refreshData($thisModal) {
                if ($thisModal.data('direction')==='up' || $thisModal.data('direction')==='down') {
                    var left = $thisModal.find('.modal-window').offset().left;
                    var right = left + $thisModal.find('.modal-window').outerWidth()
                    if (left < 0) {
                        $thisModal.data('offsetHz',(-(left) + 20));
                    }
                    if (right > $(document).width()) {
                        $thisModal.data('offsetHz', $(document).width() - right - 20);
                    }
                    $thisModal.css({
                        'margin-left': ($thisModal.data('offsetHz')) + 'px',
                        '--offsetTriangleHz': (-($thisModal.data('offsetHz')) + 'px')
                    });
                }
                if ($thisModal.data('direction')==='right' || $thisModal.data('direction')==='left') {
                    var top = $thisModal.find('.modal-window').offset().top;
                    var bottom = top + $thisModal.find('.modal-window').outerHeight()
                    if (top < 0) {
                        $thisModal.data('offsetVt',(-(top) + 20));
                    }
                    if (bottom > $(document).width()) {
                        $thisModal.data('offsetVt', $(document).width() - bottom - 20);
                    }
                    $thisModal.css({
                        'margin-top': ($thisModal.data('offsetVt')) + 'px',
                        '--offsetTriangleVt': (-($thisModal.data('offsetVt')) + 'px')
                    });
                }
            }
            if ($thisElem && $thisElem.hasClass('trigger_dropdown')) {
                if (!$thisElem.hasClass('trigger_OPEN')) {
                    var $thisModal = $href;
                    $thisModal.addClass('modal_OPEN');
                    var $document = $(document);
                    $thisModal.data({
                        offsetHz: 0,
                        offsetVt: 0,
                        direction: 'down',
                        top: $thisElem.offset().top,
                        left: $thisElem.offset().left,
                        right: $document.width() - $thisElem.offset().left - $thisElem.outerWidth(),
                        bottom: $document.height() - $thisElem.offset().top - $thisElem.outerHeight(),
                        type: 'dropdown'
                    })
                    if ($thisModal.hasClass('modal_down')) {
                        $thisModal.data('direction', 'down');
                    }
                    if ($thisModal.hasClass('modal_up')) {
                        $thisModal.data('direction', 'up');
                    }
                    if ($thisModal.hasClass('modal_left')) {
                        $thisModal.data('direction', 'left');
                    }
                    if ($thisModal.hasClass('modal_right')) {
                        $thisModal.data('direction', 'right');
                    }
                    refreshData($thisModal);
                    if ($thisModal.data('direction')==='left' && $thisModal.outerWidth() > $thisModal.data('left')) {
                        if ($thisModal.outerWidth() > $thisModal.data('right')) {
                            $thisModal.removeClass('modal_left').addClass('modal_down');
                            $thisModal.data('direction', 'down');
                        } else {
                            $thisModal.removeClass('modal_left').addClass('modal_right');
                            $thisModal.data('direction', 'right');
                        }

                    }
                    if ($thisModal.data('direction')==='right' && $thisModal.outerWidth() > $thisModal.data('right')) {
                        if ($thisModal.outerWidth() > $thisModal.data('left')) {
                            $thisModal.removeClass('modal_right').addClass('modal_down');
                            $thisModal.data('direction', 'down');
                        } else {
                            $thisModal.removeClass('modal_right').addClass('modal_left');
                            $thisModal.data('direction', 'left');
                        }
                    }
                    if ($thisModal.data('direction')==='down' && $thisModal.outerHeight() > $thisModal.data('bottom')) {
                        $thisModal.removeClass('modal_down').addClass('modal_up');
                        $thisModal.data('direction', 'up');
                    }
                    if ($thisModal.data('direction')==='up' && $thisModal.outerHeight() > $thisModal.data('top')) {
                        $thisModal.removeClass('modal_up').addClass('modal_down');
                        $thisModal.data('direction', 'down');
                    }

                    refreshData($thisModal);
                    $thisElem.addClass("trigger_OPEN");
                }
            } else {
                let $modals = $('.modal_OPEN');
                let zIndex = 0;
                if ($modals.length > 0) {
                    $modals.each(function () {
                       let $this = $(this);
                       let thisZIndex = parseFloat($this.css('z-index'));
                       if (thisZIndex > zIndex) {
                           zIndex = thisZIndex + 1;
                       }
                    });
                    $href.css('z-index', zIndex);
                }
                $href.addClass("modal_OPEN");
                if (type!=='scroll') {
                    // var scrollTop = $('html').scrollTop();
                    // $('.Site').css('margin-top', -scrollTop);
                    $body.addClass("Site_modalOPEN");
                    $body.css('overflow', 'hidden');
                    // $('html').css('overflow-y', 'scroll');
                }
                $thisElem.addClass("trigger_OPEN");
            }
        },
        init: function(){
            var actions = this;
            /* Далее код включающий модальное окно по бездействию пользователя
            $modal.each(function () {
               let $this = $(this);
               let time;
               let timeout = $this.attr('data-idle');
               if (timeout) {
                   timeout = parseFloat(timeout);
                   $(window).on('mousemove keydown keypress mousedown mouseup resize wheel scroll', resetTimer)
                   function resetTimer() {
                       clearTimeout(time);
                       if (!$this.hasClass('modal_OPEN')){
                           time = setTimeout(function () {
                               $this.addClass('modal_OPEN');
                           }, timeout * 1000);
                       }
                   }
               }

            });*/
            let $HeaderClone =  $Header.clone().addClass('modal-HeaderClone Header_clone');
            $HeaderClone.find('.Header-unit_menu').remove();
            $HeaderClone.find('.Header-unit_trigger').empty().prepend('<div class="modal-close"><span></span><span></span></div>');
            if ($HeaderClone.hasClass('Header_invert')) {
                let $logo = $HeaderClone.find('.logo-image');
                $logo.attr({
                    'src': $logo.attr('src').replace('logo', 'logo_color'),
                    'srcset': $logo.attr('srcset').replace('logo', 'logo_color')
                });
            }
            $HeaderClone.find('.Contacts').removeClass('Contacts_invert');
            $HeaderClone.addClass('Site-header_clone');
            $HeaderClone.prependTo('.modal_menu > .modal-window > .modal-header');
            function modalClick(e, typeModal) {

                let $target = $(e.target),
                    $this = $(this);


                if ( $target.hasClass('modal-closeTrigger') || $target.closest('a').hasClass('modal-closeTrigger') || $target.hasClass('modal-close') || $target.closest('a').hasClass('modal-close') ) {
                    $target = $this;
                }

                if ( $this.is($target)) {
                    e.preventDefault();
                    $this.removeClass("modal_OPEN");
                    if ($('.modal_OPEN').length === 0) {
                        $body.removeClass("Site_modalOPEN");
                        $body.css('overflow', '');
                        $('html').css('overflow-y', '');
                    } else {
                        $this.css('z-index', '');
                    }
                    $this.trigger('closeModal');

                    // var scrollTop = parseInt($('.Site').css('margin-top'));
                    // if (typeof scrollTop === 'number') {
                    //     $('.Site').css('margin-top','');
                    //     $body.css('overflow', '');
                    //     $('html').css('overflow-y', '');
                    //     if (scrollTop < 0) {
                    //         $('html').scrollTop(-scrollTop);
                    //     }
                    // }
                    let $modalIns = $this.filter('.modal');
                    if (!$modalIns.length) {
                        $modalIns = $this.closest('.modal');
                    }
                    let hrefIns = $modalIns.attr('id');
                    let $triggerIns = $('[href="#' + hrefIns + '"], [data-href="#' + hrefIns + '"]');
                    if (!$triggerIns.length) {
                        $triggerIns = $this.closest('.trigger');
                    }
                    if ($modalIns.length) {
                        $modalIns.removeClass('modal_OPEN');
                        $triggerIns.removeClass('trigger_OPEN');
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            }

            function triggerAction(e) {
                var $this = $(this);
                var href = $this.attr("href") || $this.attr("data-href");
                var $hint = '';
                var src = !$(href).length && $this.data('src');
                if (src) {
                    let $img = $( template.img( $this.data('src') ) );
                    $img.attr('id', href.replace('#','') );
                    $body.append( $img );
                }
                if (href) {
                    $hint = $(href);
                } else {
                    $hint = $this.find('.modal');
                }
                if (!$hint.hasClass('modal_OPEN')){
                    if ($hint.hasClass('modal_dropdown')) {
                        $('.modal_dropdown.modal_OPEN').removeClass('modal_OPEN');
                        $('.trigger_dropdown.trigger_OPEN').removeClass('trigger_OPEN');
                    }
                    if ( src ) {
                        let $href = $(href);
                        $modal = $modal.add( $href );
                        $href.click(modalClick);
                        setTimeout(function () {
                            actions.trigger(href, null, $this);
                        }, 200);
                    } else {
                        if ($this.data('action') === 'closeOther') {
                            $('.trigger_OPEN[data-group="' + $this.data('group') + '"]').trigger('click');
                        }
                        actions.trigger(href, null, $this);
                    }
                } else if (e.type !== 'input') {
                    $hint.removeClass('modal_OPEN');
                    $this.removeClass("trigger_OPEN");
                    var scrollTop = parseInt($('.Site').css('margin-top'));
                    if (typeof scrollTop === 'number') {
                        // $('.Site').css('margin-top','');
                        // $body.removeClass('Site_modalOPEN').css('overflow', '');
                        $body.css('overflow', '');
                        $('html').css('overflow-y', '');
                        // if (scrollTop < 0) {
                        //     $('html').scrollTop(-scrollTop);
                        // }
                    }
                }
            }
            if ( (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0))) {
                $('.Site').addClass('Site_touchscreen');
            }
            $trigger.filter('[data-event="click"]').on('click', triggerAction);
            $trigger.filter('[data-event="input"]').on('input', triggerAction);
            $(document).on('click', function(e){
                var $this  = $(e.target);
                if ($this.length && !$this.closest('.modal_OPEN').length && !$this.closest('.trigger_OPEN').length && !$this.is('.trigger_OPEN')  ){
                    $('.modal.modal_OPEN').removeClass('modal_OPEN');
                    $('.trigger.trigger_OPEN').removeClass('trigger_OPEN');
                }
            });

                $trigger.filter('.trigger_dropdown').not('[data-event="click"], [data-event="input"]').on('mouseover', function () {
                    var $this = $(this);
                    clearTimeout( $this.data('timerId') );
                    var $hint = '';
                    var href = $this.attr("href") || $this.attr("data-href");
                    if (href) {
                        $hint = $(href);
                    } else {
                        $hint = $this.find('.modal');
                    }
                    $hint.css('z-index', '1020');
                    if (!$hint.hasClass('modal_OPEN')){
                        actions.trigger(href, null, $this);
                    }
                });
                $trigger.filter('.trigger_dropdown').not('[data-event="click"], [data-event="input"]').on('mouseleave', function () {
                    var $this = $(this);
                    var $hint = '';
                    var href = $this.attr("href") || $this.attr("data-href");
                    if (href) {
                        $hint = $(href);
                    } else {
                        $hint = $this.find('.modal');
                    }
                    $hint.css('z-index', '');
                    var timerId = setTimeout(function(){
                        if ($hint.hasClass('modal_OPEN')) {
                            $hint.removeClass('modal_OPEN');
                            $this.removeClass("trigger_OPEN");
                            return false;
                        }
                    }, 500);
                    $this.data('timerId', timerId);
                });

            $modal.click(modalClick);

        }
    };
};

let modalAPI = modal();

modalAPI.init();

