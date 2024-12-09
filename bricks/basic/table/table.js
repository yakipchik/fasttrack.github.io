var table = function(){
    return {
        init: function(){
            let $table = $('.table');
            $table.wrap('<div class="tableWrap" />');
        }
    };
};
table().init();
