var FileInsert = function(){
    return {
        init: function(){
            var $title = $('.FileInsert-title');
            var $ProductBlock = $('.FileInsert-ProductBlock');
            $title.each(function (){
                var $this = $(this);
                $this.attr('data-text', $this.text());
            });
            $('.FileInsert-input').on('change', function (e) {
                var $this = $(this);
                var files = e.target.files;
                var $parent = $this.closest('.FileInsert');
                $parent.find($ProductBlock).empty();
                var reader = [];

                if (files.length) {
                    for (var i=0; i < files.length; i++){
                        reader[i]  = new FileReader();

                        reader[i].onloadend = function () {
                            let src = '';
                            src = this.result;
                            $parent.find($ProductBlock)
                                .append(
                                    '<div class="ProductBlock-file">' +
                                    '<div class="ProductBlock-pict">' +
                                    '<img src="' + src + '" class="ProductBlock-img">' +
                                    '</div>' +
                                    '<span class="ProductBlock-actionFile ProductBlock-actionFile_load ProductBlock-actionFile_disable">' +
                                    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                                    '<path d="M15.1667 0.999756L15.7646 2.11753C16.1689 2.87322 16.371 3.25107 16.2374 3.41289C16.1037 3.57471 15.6635 3.44402 14.7831 3.18264C13.9029 2.92131 12.9684 2.78071 12 2.78071C6.75329 2.78071 2.5 6.90822 2.5 11.9998C2.5 13.6789 2.96262 15.2533 3.77093 16.6093M8.83333 22.9998L8.23536 21.882C7.83108 21.1263 7.62894 20.7484 7.7626 20.5866C7.89627 20.4248 8.33649 20.5555 9.21689 20.8169C10.0971 21.0782 11.0316 21.2188 12 21.2188C17.2467 21.2188 21.5 17.0913 21.5 11.9998C21.5 10.3206 21.0374 8.74623 20.2291 7.39023" stroke="#12B76A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>\n' +
                                    '</svg>' +
                                    '</span>' +
                                    '</div>');
                        }
                        reader[i].readAsDataURL(files[i]);
                    }
                    $parent.find($title).empty().append('Изображение добавлено');
                } else {
                    $parent.find($title).empty().append($parent.find($title).attr('data-text'));
                }
            })
        }
    };
};
FileInsert().init();
