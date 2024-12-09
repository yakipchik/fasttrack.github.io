//-=require plg/jquery.form.js
//-=require plg/jquery.maskedinput.min.js
var form = function(){
    var $selectList = $('.selectList');
    var $input = $('.form-input, .form-textarea');
    var $form = $('.form');
    var $select = $('.form-select');
    return {
        init: function(){
            $selectList.each(function(){
                var $this = $(this),
                    $radio= $this.find('input[type="radio"], input[type="checkbox"]');
                function changeTitle($block, $element) {
                    var $title = $block.find('.selectList-title');
                    var title = '';
                    var $toggle = $element.closest('.toggle');
                    var $titleText = $title.find('.selectList-titleText');
                    // $element.each(function (item) {
                    //     if (item > 0) {
                    //         title = title + ', ';
                    //     };
                    //     title = title +
                    //         $(this).closest('.selectList-item')
                    //             .find('.selectList-text').text();
                    // });
                    // $title.text(title);
                    if (!$block.data('name')) {
                        let afterIns, htmlIns;
                        if ($toggle.data('name')) {
                            afterIns = '<div class="selectList-text toggle-text selectList-titleText selectList-titleText_new">' + $toggle.data('name') + '</div>';
                            htmlIns = '<div class="selectList-text toggle-text selectList-titleText">' + $toggle.data('name') + '</div>';
                        } else {
                            afterIns = $element.closest('.selectList-item').find('.selectList-text').clone().addClass('selectList-titleText selectList-titleText_new') ;
                            htmlIns = $element.closest('.selectList-item').find('.selectList-text').clone().addClass('selectList-titleText') ;
                        }
                        if ($titleText.length > 0) {
                            $titleText.eq(0).after(afterIns);
                            $titleText.addClass('selectList-titleText_old');
                            $title.closest($selectList).removeClass('selectList_OPEN');
                            $titleText.on('transitionend', function () {
                                $titleText.next('.selectList-titleText_new').removeClass('selectList-titleText_new');
                                $titleText.remove();
                            });
                        } else {
                            $title.html(htmlIns);
                            $title.closest($selectList).removeClass('selectList_OPEN');
                        }
                        if ($toggle.data('direction')) {
                            if ($toggle.data('direction') === 'asc') {
                                $block.addClass('selectList_asc')
                            } else {
                                $block.removeClass('selectList_asc')
                            }

                            if ($toggle.data('direction') === 'desc') {
                                $block.addClass('selectList_desc')
                            } else {
                                $block.removeClass('selectList_desc')
                            }
                        }
                    }
                    // $block.find('.selectList-title')
                    //     .text( $element.reduce(function(sum, item){
                    //         if (typeof sum !== 'string') {
                    //             sum = sum.closest('.selectList-item')
                    //                     .find('.selectList-text').text();
                    //         }
                    //         item = item.closest('.selectList-item')
                    //             .find('.selectList-text').text();
                    //         return sum + ', ' + item
                    //     }));
                }
                changeTitle($this, $radio.filter('[checked]'));
                $radio.on('change', function(){
                    changeTitle($this, $(this).closest($selectList).find($radio).filter(':checked'));
                });

            });
            let $selectLists_temp = $selectList;
            $(document).on('click', function(e){
                var $this = $(e.target);
                if (!$this.hasClass('selectList-header') ) {
                    $this = $(e.target).closest('.selectList-header');
                }
                if ( $this.length){
                    e.preventDefault();
                    let $selectList = $this.closest('.selectList');

                    $selectLists_temp.not($selectList).removeClass('selectList_OPEN');
                    let $dropdown = $selectList.find('.selectList-dropdown');
                    let leftOffset = $dropdown.offset().left;
                    let rightOffset =$(window).outerWidth() -  ($dropdown.offset().left + $dropdown.outerWidth());
                    let dropdownOffset = 0;
                    if (leftOffset < 0) {
                        dropdownOffset = -(leftOffset - 10);
                    } else if (rightOffset < 0) {
                        dropdownOffset = -(rightOffset - 10);
                    }
                    if (dropdownOffset) {
                        $selectList.css({
                            '--dropdownOffset': dropdownOffset + 'px',
                        });
                    }

                    $selectList.toggleClass('selectList_OPEN');
                    if($selectList.is('.selectList_dropdown')) {
                        $selectList.find('.selectList-dropdownIns').css('overflow-y', 'hidden');
                        $selectList.find('.selectList-dropdown').on('transitionend', function () {
                            $selectList.find('.selectList-dropdownIns').css('overflow-y', 'auto');
                        });
                    }
                } else {
                    if (!$(e.target).closest('.selectList-dropdown').length){
                        $('.selectList').removeClass('selectList_OPEN');
                    }
                }
            });

            // Валидация полей
            $input.on('blur', function(){
                var $this = $(this),
                    validate = $this.data('validate'),
                    message = '',
                    error = false;
                if ($this.attr('data-validate')) {
                    validate = validate.split(' ');
                    validate.forEach(function(v){
                        switch (v){
                            case 'require':
                                if (!$this.val()) {
                                    message = 'Это поле обязательно для заполнения. ';
                                    error = true;
                                }
                                break;
                            case 'phone':
                                var val = $this.val().replace(' ', '');
                                val = val + '';
                                var resMatch = val.match(/[^\d()+]/);
                                if (resMatch && resMatch.length > 0) {
                                    message += 'Номер может содержать только цифры, символы пробела и скобки, а также знак "+". ';
                                    error = true;
                                }
                                break;
                            case 'pay':
                                var val = $this.val().replace(' ', '');
                                val = val + '';
                                if (parseFloat(val)%2!==0) {
                                    message += 'Номер должен быть четным. ';
                                    error = true;
                                }
                                break;

                        }
                        if (error) {
                            if ($this.hasClass('form-input')){
                                $this.addClass('form-input_error');
                            }
                            if ($this.hasClass('form-textarea')){
                                $this.addClass('form-textarea_error');
                            }
                            if (!$this.next('.form-error').length){
                                $this.after('<div class="form-error">'+message+'</div>');
                            }
                            $this.data('errorinput', true);
                        } else {
                            $this.next('.form-error').remove();
                            $this.removeClass('form-input_error');
                            $this.removeClass('form-textarea_error');
                            $this.data('errorinput', false);
                        }
                        message = '';

                    });
                }
            });
            $('[data-action="disabled_remove"]').on('change', function ({target}) {
                var $this = $(this);
                var $input = $(target).closest('.toggle').find('.toggle-check');
                if (!$input.length) {
                    $input = $(target).closest('.toggle').find('.toggle-radio');
                }
                var id = $input.closest('.toggle').attr('data-target');
                if ($input.is(':checked')){
                    $(id).removeAttr('disabled');
                } else {
                    $(id).attr('disabled', true);
                }
            });
            $('[data-action="toggle_block"]').find('.toggle-radio, .toggle-check').on('change', function ({target}) {
                var $this = $(this);
                var $input = $(target).closest('.toggle').find('.toggle-check');
                if (!$input.length) {
                    $input = $(target).closest('.toggle').find('.toggle-radio');
                }
                var state = $input.closest('.toggle').attr('data-state');
                var id = $input.closest('.toggle').attr('data-target');
                if (state) {
                    if (state === 'show') {
                        $(id).show(0);
                    } else if (state === 'hide') {
                        $(id).hide(0);
                    }
                } else {
                    if ($input.is(':checked')) {
                        $(id).show(0);
                    } else {
                        $(id).hide(0);
                    }
                }
            });
            $('[data-action="toggle_block"]').find('.toggle-radio:checked, .toggle-check:checked').trigger('change');
            $form.on('submit', function(e){
                var $this = $(this),
                    $validate = $this.find('[data-validate]'),
                    errors = false,
                    $reply = $this.closest('.BlockReply'),
                    $modal = $reply.closest('.modal');


                $validate.each(function(){
                    var $this = $(this);
                    $this.trigger('blur');
                    if ($this.data('errorinput')){
                        errors = true;
                        e.preventDefault();
                    }
                });
                if (!errors) {
                    e.preventDefault();
                    if ($this.hasClass('form_modal')) {
                        $reply.css('width', $reply.width());
                    }
                    if ($this.hasClass('form_request')) {
                        $reply.addClass('BlockReply_returned');
                        $modal.addClass('modal_returned');
                        if (!$reply.find('.BlockReply-message').length) {
                            $reply.append('<div class="BlockReply-message"><div class="BlockReply-check"></div><h2 class="BlockReply-title BlockReply-title_center">Заявка отправлена</h2>' +
                                '<p>Мы свяжемся с&nbsp;вами в&nbsp;ближайшее время.</p></div>');
                        }
                    }
                    const timerCloseModal = setTimeout(()=>{
                        $modal.trigger('click');
                        }, 200000);
                    $modal.one('closeModal', ()=>{
                        $modal.one('transitionend', ()=>{
                            $reply.removeClass('BlockReply_returned');
                            $modal.removeClass('modal_returned');
                            $this.find('input').val('');
                            clearTimeout(timerCloseModal);
                        })
                    });


                    // if (!$this.find('button.btn').next('.form-error').length){
                    //     $this.find('button.btn').after('<div class="form-error" style="margin-top:5px">Ошибка. Попробуйте снова позже</div>');
                    //     e.preventDefault();
                    // }
                }
            });
            $select.wrap('<div class="form-selectWrap"></div>');
            $('.form-selectWrap').each(function () {
                var $this = $(this);
                var $thisSelect = $this.find($select);
                var classes = $thisSelect.attr('class').replace(/form-select([^_]|$)|form-select_connected/g, '');
                $this.addClass(classes).append('<div class="form-selectArrow"></div>');
                $thisSelect.addClass('form-select_wrap').removeClass(classes);
            })

            $('[data-mask]').each(function(){
                var $this = $(this);
                $this.mask($this.data('mask'), {placeholder:'x'});
            });
        }
    };
};
form().init();
