"use strict";
(function ($) {
	var px = ""; //'rt--'

	/**
	 * Функция для вывода набора jQuery по селектору, к селектору добавляются
	 * префиксы
	 *
	 * @param {string} selector Принимает селектор для формирования набора
	 * @return {jQuery} Возвращает новый jQuery набор по выбранным селекторам
	 */
	function $x(selector) {
		return $(x(selector));
	}

	/**
	 * Функция для автоматического добавления префиксов к селекторы
	 *
	 * @param {string} selector Принимает селектор для формирования набора
	 * @return {string} Возвращает новый jQuery набор по выбранным селекторам
	 */
	function x(selector) {
		var arraySelectors = selector.split("."),
			firstNotClass = !!arraySelectors[0];

		selector = "";

		for (var i = 0; i < arraySelectors.length; i++) {
			if (!i) {
				if (firstNotClass) selector += arraySelectors[i];
				continue;
			}
			selector += "." + px + arraySelectors[i];
		}

		return selector;
	}

	$(function () {
		//-=require plg/jquery.form.js
		//-=require plg/jquery.maskedinput.min.js
		var form = function () {
			var $selectList = $(".selectList");
			var $input = $(".form-input, .form-textarea");
			var $form = $(".form");
			var $select = $(".form-select");
			return {
				init: function () {
					$selectList.each(function () {
						var $this = $(this),
							$radio = $this.find(
								'input[type="radio"], input[type="checkbox"]'
							);
						function changeTitle($block, $element) {
							var $title = $block.find(".selectList-title");
							var title = "";
							var $toggle = $element.closest(".toggle");
							var $titleText = $title.find(".selectList-titleText");
							// $element.each(function (item) {
							//     if (item > 0) {
							//         title = title + ', ';
							//     };
							//     title = title +
							//         $(this).closest('.selectList-item')
							//             .find('.selectList-text').text();
							// });
							// $title.text(title);
							if (!$block.data("name")) {
								let afterIns, htmlIns;
								if ($toggle.data("name")) {
									afterIns =
										'<div class="selectList-text toggle-text selectList-titleText selectList-titleText_new">' +
										$toggle.data("name") +
										"</div>";
									htmlIns =
										'<div class="selectList-text toggle-text selectList-titleText">' +
										$toggle.data("name") +
										"</div>";
								} else {
									afterIns = $element
										.closest(".selectList-item")
										.find(".selectList-text")
										.clone()
										.addClass("selectList-titleText selectList-titleText_new");
									htmlIns = $element
										.closest(".selectList-item")
										.find(".selectList-text")
										.clone()
										.addClass("selectList-titleText");
								}
								if ($titleText.length > 0) {
									$titleText.eq(0).after(afterIns);
									$titleText.addClass("selectList-titleText_old");
									$title.closest($selectList).removeClass("selectList_OPEN");
									$titleText.on("transitionend", function () {
										$titleText
											.next(".selectList-titleText_new")
											.removeClass("selectList-titleText_new");
										$titleText.remove();
									});
								} else {
									$title.html(htmlIns);
									$title.closest($selectList).removeClass("selectList_OPEN");
								}
								if ($toggle.data("direction")) {
									if ($toggle.data("direction") === "asc") {
										$block.addClass("selectList_asc");
									} else {
										$block.removeClass("selectList_asc");
									}

									if ($toggle.data("direction") === "desc") {
										$block.addClass("selectList_desc");
									} else {
										$block.removeClass("selectList_desc");
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
						changeTitle($this, $radio.filter("[checked]"));
						$radio.on("change", function () {
							changeTitle(
								$this,
								$(this).closest($selectList).find($radio).filter(":checked")
							);
						});
					});
					let $selectLists_temp = $selectList;
					$(document).on("click", function (e) {
						var $this = $(e.target);
						if (!$this.hasClass("selectList-header")) {
							$this = $(e.target).closest(".selectList-header");
						}
						if ($this.length) {
							e.preventDefault();
							let $selectList = $this.closest(".selectList");

							$selectLists_temp.not($selectList).removeClass("selectList_OPEN");
							let $dropdown = $selectList.find(".selectList-dropdown");
							let leftOffset = $dropdown.offset().left;
							let rightOffset =
								$(window).outerWidth() -
								($dropdown.offset().left + $dropdown.outerWidth());
							let dropdownOffset = 0;
							if (leftOffset < 0) {
								dropdownOffset = -(leftOffset - 10);
							} else if (rightOffset < 0) {
								dropdownOffset = -(rightOffset - 10);
							}
							if (dropdownOffset) {
								$selectList.css({
									"--dropdownOffset": dropdownOffset + "px",
								});
							}

							$selectList.toggleClass("selectList_OPEN");
							if ($selectList.is(".selectList_dropdown")) {
								$selectList
									.find(".selectList-dropdownIns")
									.css("overflow-y", "hidden");
								$selectList
									.find(".selectList-dropdown")
									.on("transitionend", function () {
										$selectList
											.find(".selectList-dropdownIns")
											.css("overflow-y", "auto");
									});
							}
						} else {
							if (!$(e.target).closest(".selectList-dropdown").length) {
								$(".selectList").removeClass("selectList_OPEN");
							}
						}
					});

					// Валидация полей
					$input.on("blur", function () {
						var $this = $(this),
							validate = $this.data("validate"),
							message = "",
							error = false;
						if ($this.attr("data-validate")) {
							validate = validate.split(" ");
							validate.forEach(function (v) {
								switch (v) {
									case "require":
										if (!$this.val()) {
											message = "Это поле обязательно для заполнения. ";
											error = true;
										}
										break;
									case "phone":
										var val = $this.val().replace(" ", "");
										val = val + "";
										var resMatch = val.match(/[^\d()+]/);
										if (resMatch && resMatch.length > 0) {
											message +=
												'Номер может содержать только цифры, символы пробела и скобки, а также знак "+". ';
											error = true;
										}
										break;
									case "pay":
										var val = $this.val().replace(" ", "");
										val = val + "";
										if (parseFloat(val) % 2 !== 0) {
											message += "Номер должен быть четным. ";
											error = true;
										}
										break;
								}
								if (error) {
									if ($this.hasClass("form-input")) {
										$this.addClass("form-input_error");
									}
									if ($this.hasClass("form-textarea")) {
										$this.addClass("form-textarea_error");
									}
									if (!$this.next(".form-error").length) {
										$this.after(
											'<div class="form-error">' + message + "</div>"
										);
									}
									$this.data("errorinput", true);
								} else {
									$this.next(".form-error").remove();
									$this.removeClass("form-input_error");
									$this.removeClass("form-textarea_error");
									$this.data("errorinput", false);
								}
								message = "";
							});
						}
					});
					$('[data-action="disabled_remove"]').on(
						"change",
						function ({ target }) {
							var $this = $(this);
							var $input = $(target).closest(".toggle").find(".toggle-check");
							if (!$input.length) {
								$input = $(target).closest(".toggle").find(".toggle-radio");
							}
							var id = $input.closest(".toggle").attr("data-target");
							if ($input.is(":checked")) {
								$(id).removeAttr("disabled");
							} else {
								$(id).attr("disabled", true);
							}
						}
					);
					$('[data-action="toggle_block"]')
						.find(".toggle-radio, .toggle-check")
						.on("change", function ({ target }) {
							var $this = $(this);
							var $input = $(target).closest(".toggle").find(".toggle-check");
							if (!$input.length) {
								$input = $(target).closest(".toggle").find(".toggle-radio");
							}
							var state = $input.closest(".toggle").attr("data-state");
							var id = $input.closest(".toggle").attr("data-target");
							if (state) {
								if (state === "show") {
									$(id).show(0);
								} else if (state === "hide") {
									$(id).hide(0);
								}
							} else {
								if ($input.is(":checked")) {
									$(id).show(0);
								} else {
									$(id).hide(0);
								}
							}
						});
					$('[data-action="toggle_block"]')
						.find(".toggle-radio:checked, .toggle-check:checked")
						.trigger("change");
					$form.on("submit", function (e) {
						var $this = $(this),
							$validate = $this.find("[data-validate]"),
							errors = false,
							$reply = $this.closest(".BlockReply"),
							$modal = $reply.closest(".modal");

						$validate.each(function () {
							var $this = $(this);
							$this.trigger("blur");
							if ($this.data("errorinput")) {
								errors = true;
								e.preventDefault();
							}
						});
						if (!errors) {
							e.preventDefault();
							if ($this.hasClass("form_modal")) {
								$reply.css("width", $reply.width());
							}
							if ($this.hasClass("form_request")) {
								$reply.addClass("BlockReply_returned");
								$modal.addClass("modal_returned");
								if (!$reply.find(".BlockReply-message").length) {
									$reply.append(
										'<div class="BlockReply-message"><div class="BlockReply-check"></div><h2 class="BlockReply-title BlockReply-title_center">Заявка отправлена</h2>' +
											"<p>Мы свяжемся с&nbsp;вами в&nbsp;ближайшее время.</p></div>"
									);
								}
							}
							const timerCloseModal = setTimeout(() => {
								$modal.trigger("click");
							}, 200000);
							$modal.one("closeModal", () => {
								$modal.one("transitionend", () => {
									$reply.removeClass("BlockReply_returned");
									$modal.removeClass("modal_returned");
									$this.find("input").val("");
									clearTimeout(timerCloseModal);
								});
							});

							// if (!$this.find('button.btn').next('.form-error').length){
							//     $this.find('button.btn').after('<div class="form-error" style="margin-top:5px">Ошибка. Попробуйте снова позже</div>');
							//     e.preventDefault();
							// }
						}
					});
					$select.wrap('<div class="form-selectWrap"></div>');
					$(".form-selectWrap").each(function () {
						var $this = $(this);
						var $thisSelect = $this.find($select);
						var classes = $thisSelect
							.attr("class")
							.replace(/form-select([^_]|$)|form-select_connected/g, "");
						$this
							.addClass(classes)
							.append('<div class="form-selectArrow"></div>');
						$thisSelect.addClass("form-select_wrap").removeClass(classes);
					});

					$("[data-mask]").each(function () {
						var $this = $(this);
						$this.mask($this.data("mask"), { placeholder: "x" });
					});
				},
			};
		};
		form().init();

		var grid = function () {
			return {
				init: function () {},
			};
		};
		grid().init();

		var menu = function () {
			var $menuMain = $(".Header-menu > .menu");
			$menuMain.css("position", "absolute");
			var menuHeight = $menuMain.outerHeight();
			$menuMain.css("position", "static");
			var $body = $("body");
			function refresh() {
				if (window.innerWidth < 990) {
					// $('.menuModal').each(function(){
					//     var $this = $(this);
					//     setTimeout(function(){
					//         if ($this.attr('height') > 0) {
					//             $this.css('height', 0);
					//         }
					//     }, 100);
					// });
					// $('.menuModal').css('height', 0);
					$menuMain.css("position", "absolute");
					menuHeight = $menuMain.outerHeight();
					$menuMain.css("position", "static");
				} else {
					menuHeight = $menuMain.outerHeight();
					$(".menuModal").removeClass("menuModal_OPEN").css("height", "");
					$body.removeClass("Site_menuOPEN");
					$(".menuTrigger").removeClass("menuTrigger_OPEN");
				}
			}

			return {
				init: function () {
					if (window.innerWidth < 990) {
						$(".menuModal").css("height", menuHeight);
						// Меню для мобильных
						$(".menuTrigger").each(function () {
							$($(this).attr("href")).css("height", 0);
						});

						$menuMain.on("click", function (e) {
							if ($(e.target).is(".menu-item_parent")) {
								$(e.target)
									.children(".menu-subMenu")
									.toggleClass("menu-subMenu_OPEN");
							}
							setTimeout(function () {
								menuHeight = $menuMain.outerHeight();
								$(".menuModal").css({
									height: menuHeight,
								});
							}, 200);
						});
					}

					$(".menuTrigger").click(function (e) {
						var $this = $(this),
							href = $this.attr("href");

						if ($this.hasClass("menuTrigger_OPEN")) {
							$body.removeClass("Site_menuOPEN");
							$(href).removeClass("menuModal_OPEN").css("height", 0);
							$this.removeClass("menuTrigger_OPEN");
						} else {
							$body.addClass("Site_menuOPEN");
							$(href).addClass("menuModal_OPEN").css("height", menuHeight);
							$this.addClass("menuTrigger_OPEN");
						}
						e.preventDefault();
					});
					$(window).on("resize", refresh);
					var $menu_header = $(".ControlPanel-menu > .menu");
					$menu_header
						.find(".menu-item_parent > .menu-link")
						.after('<span class="menu-arrow"></span>');
					if (window.innerWidth < 990) {
						$(document).on("click", ".menuModal_OPEN", function ({ target }) {
							var $target = $(target);
							var $this = $(this);
							if ($target.is("a") || $target.closest("a")) {
								setTimeout(function () {
									$('.menuTrigger[href="#' + $this.attr("id") + '"]').trigger(
										"click"
									);
								}, 200);
							}
						});
					}
					if (window.innerWidth < 645) {
						$menu_header.find(".menu-arrow").on("click", function (e) {
							e.preventDefault();
							$(this).closest(".menu-item").trigger("click");
						});
					}
				},
			};
		};
		menu().init();

		let modal = function () {
			let $MobileControl = $(".MobileControl");
			let $Header = $(".Header");
			let $body = $("body");
			function setVh() {
				let vh = window.innerHeight * 0.01;

				$body.css({
					"--MobileControlHeight": $MobileControl.outerHeight() || 0 + "px",
					"--HeaderHeight": $Header.outerHeight() || 0 + "px",
				});
				document.documentElement.style.setProperty("--vh", `${vh}px`);

				if (
					"ontouchstart" in window ||
					navigator.maxTouchPoints > 0 ||
					navigator.msMaxTouchPoints > 0
				) {
					$(".Site").addClass("Site_touchscreen");
				} else {
					$(".Site").removeClass("Site_touchscreen");
				}
			}
			setVh();
			var doit;
			$(window).on("resize", function () {
				clearTimeout(doit);
				doit = setTimeout(setVh, 100);
			});

			let $trigger = $(".trigger"),
				$modal = $(".modal");

			let template = {
				img: (img) =>
					'<div class="modal modal_pict">' +
					'<div class="modal-window">' +
					'<a href="#" class="modal-close"><span></span><span></span></a>' +
					'<div class="modal-content">' +
					'<img src="' +
					img +
					'"  class="modal-img"/>' +
					"</div>" +
					"</div>" +
					"</div>",
			};

			return {
				refresh: function () {},
				trigger: function (href, type, $thisElem) {
					var $href = $(href);
					if ($thisElem.attr("data-href")) {
						$href = $($thisElem.attr("data-href"));
					} else if ($thisElem.attr("href")) {
						$href = $($thisElem.attr("href"));
					} else {
						$href = $thisElem.find(".modal");
					}
					function refreshData($thisModal) {
						if (
							$thisModal.data("direction") === "up" ||
							$thisModal.data("direction") === "down"
						) {
							var left = $thisModal.find(".modal-window").offset().left;
							var right = left + $thisModal.find(".modal-window").outerWidth();
							if (left < 0) {
								$thisModal.data("offsetHz", -left + 20);
							}
							if (right > $(document).width()) {
								$thisModal.data("offsetHz", $(document).width() - right - 20);
							}
							$thisModal.css({
								"margin-left": $thisModal.data("offsetHz") + "px",
								"--offsetTriangleHz": -$thisModal.data("offsetHz") + "px",
							});
						}
						if (
							$thisModal.data("direction") === "right" ||
							$thisModal.data("direction") === "left"
						) {
							var top = $thisModal.find(".modal-window").offset().top;
							var bottom = top + $thisModal.find(".modal-window").outerHeight();
							if (top < 0) {
								$thisModal.data("offsetVt", -top + 20);
							}
							if (bottom > $(document).width()) {
								$thisModal.data("offsetVt", $(document).width() - bottom - 20);
							}
							$thisModal.css({
								"margin-top": $thisModal.data("offsetVt") + "px",
								"--offsetTriangleVt": -$thisModal.data("offsetVt") + "px",
							});
						}
					}
					if ($thisElem && $thisElem.hasClass("trigger_dropdown")) {
						if (!$thisElem.hasClass("trigger_OPEN")) {
							var $thisModal = $href;
							$thisModal.addClass("modal_OPEN");
							var $document = $(document);
							$thisModal.data({
								offsetHz: 0,
								offsetVt: 0,
								direction: "down",
								top: $thisElem.offset().top,
								left: $thisElem.offset().left,
								right:
									$document.width() -
									$thisElem.offset().left -
									$thisElem.outerWidth(),
								bottom:
									$document.height() -
									$thisElem.offset().top -
									$thisElem.outerHeight(),
								type: "dropdown",
							});
							if ($thisModal.hasClass("modal_down")) {
								$thisModal.data("direction", "down");
							}
							if ($thisModal.hasClass("modal_up")) {
								$thisModal.data("direction", "up");
							}
							if ($thisModal.hasClass("modal_left")) {
								$thisModal.data("direction", "left");
							}
							if ($thisModal.hasClass("modal_right")) {
								$thisModal.data("direction", "right");
							}
							refreshData($thisModal);
							if (
								$thisModal.data("direction") === "left" &&
								$thisModal.outerWidth() > $thisModal.data("left")
							) {
								if ($thisModal.outerWidth() > $thisModal.data("right")) {
									$thisModal.removeClass("modal_left").addClass("modal_down");
									$thisModal.data("direction", "down");
								} else {
									$thisModal.removeClass("modal_left").addClass("modal_right");
									$thisModal.data("direction", "right");
								}
							}
							if (
								$thisModal.data("direction") === "right" &&
								$thisModal.outerWidth() > $thisModal.data("right")
							) {
								if ($thisModal.outerWidth() > $thisModal.data("left")) {
									$thisModal.removeClass("modal_right").addClass("modal_down");
									$thisModal.data("direction", "down");
								} else {
									$thisModal.removeClass("modal_right").addClass("modal_left");
									$thisModal.data("direction", "left");
								}
							}
							if (
								$thisModal.data("direction") === "down" &&
								$thisModal.outerHeight() > $thisModal.data("bottom")
							) {
								$thisModal.removeClass("modal_down").addClass("modal_up");
								$thisModal.data("direction", "up");
							}
							if (
								$thisModal.data("direction") === "up" &&
								$thisModal.outerHeight() > $thisModal.data("top")
							) {
								$thisModal.removeClass("modal_up").addClass("modal_down");
								$thisModal.data("direction", "down");
							}

							refreshData($thisModal);
							$thisElem.addClass("trigger_OPEN");
						}
					} else {
						let $modals = $(".modal_OPEN");
						let zIndex = 0;
						if ($modals.length > 0) {
							$modals.each(function () {
								let $this = $(this);
								let thisZIndex = parseFloat($this.css("z-index"));
								if (thisZIndex > zIndex) {
									zIndex = thisZIndex + 1;
								}
							});
							$href.css("z-index", zIndex);
						}
						$href.addClass("modal_OPEN");
						if (type !== "scroll") {
							// var scrollTop = $('html').scrollTop();
							// $('.Site').css('margin-top', -scrollTop);
							$body.addClass("Site_modalOPEN");
							$body.css("overflow", "hidden");
							// $('html').css('overflow-y', 'scroll');
						}
						$thisElem.addClass("trigger_OPEN");
					}
				},
				init: function () {
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
					let $HeaderClone = $Header
						.clone()
						.addClass("modal-HeaderClone Header_clone");
					$HeaderClone.find(".Header-unit_menu").remove();
					$HeaderClone
						.find(".Header-unit_trigger")
						.empty()
						.prepend(
							'<div class="modal-close"><span></span><span></span></div>'
						);
					if ($HeaderClone.hasClass("Header_invert")) {
						let $logo = $HeaderClone.find(".logo-image");
						$logo.attr({
							src: $logo.attr("src").replace("logo", "logo_color"),
							srcset: $logo.attr("srcset").replace("logo", "logo_color"),
						});
					}
					$HeaderClone.find(".Contacts").removeClass("Contacts_invert");
					$HeaderClone.addClass("Site-header_clone");
					$HeaderClone.prependTo(".modal_menu > .modal-window > .modal-header");
					function modalClick(e, typeModal) {
						let $target = $(e.target),
							$this = $(this);

						if (
							$target.hasClass("modal-closeTrigger") ||
							$target.closest("a").hasClass("modal-closeTrigger") ||
							$target.hasClass("modal-close") ||
							$target.closest("a").hasClass("modal-close")
						) {
							$target = $this;
						}

						if ($this.is($target)) {
							e.preventDefault();
							$this.removeClass("modal_OPEN");
							if ($(".modal_OPEN").length === 0) {
								$body.removeClass("Site_modalOPEN");
								$body.css("overflow", "");
								$("html").css("overflow-y", "");
							} else {
								$this.css("z-index", "");
							}
							$this.trigger("closeModal");

							// var scrollTop = parseInt($('.Site').css('margin-top'));
							// if (typeof scrollTop === 'number') {
							//     $('.Site').css('margin-top','');
							//     $body.css('overflow', '');
							//     $('html').css('overflow-y', '');
							//     if (scrollTop < 0) {
							//         $('html').scrollTop(-scrollTop);
							//     }
							// }
							let $modalIns = $this.filter(".modal");
							if (!$modalIns.length) {
								$modalIns = $this.closest(".modal");
							}
							let hrefIns = $modalIns.attr("id");
							let $triggerIns = $(
								'[href="#' + hrefIns + '"], [data-href="#' + hrefIns + '"]'
							);
							if (!$triggerIns.length) {
								$triggerIns = $this.closest(".trigger");
							}
							if ($modalIns.length) {
								$modalIns.removeClass("modal_OPEN");
								$triggerIns.removeClass("trigger_OPEN");
								e.preventDefault();
								e.stopPropagation();
							}
						}
					}

					function triggerAction(e) {
						var $this = $(this);
						var href = $this.attr("href") || $this.attr("data-href");
						var $hint = "";
						var src = !$(href).length && $this.data("src");
						if (src) {
							let $img = $(template.img($this.data("src")));
							$img.attr("id", href.replace("#", ""));
							$body.append($img);
						}
						if (href) {
							$hint = $(href);
						} else {
							$hint = $this.find(".modal");
						}
						if (!$hint.hasClass("modal_OPEN")) {
							if ($hint.hasClass("modal_dropdown")) {
								$(".modal_dropdown.modal_OPEN").removeClass("modal_OPEN");
								$(".trigger_dropdown.trigger_OPEN").removeClass("trigger_OPEN");
							}
							if (src) {
								let $href = $(href);
								$modal = $modal.add($href);
								$href.click(modalClick);
								setTimeout(function () {
									actions.trigger(href, null, $this);
								}, 200);
							} else {
								if ($this.data("action") === "closeOther") {
									$(
										'.trigger_OPEN[data-group="' + $this.data("group") + '"]'
									).trigger("click");
								}
								actions.trigger(href, null, $this);
							}
						} else if (e.type !== "input") {
							$hint.removeClass("modal_OPEN");
							$this.removeClass("trigger_OPEN");
							var scrollTop = parseInt($(".Site").css("margin-top"));
							if (typeof scrollTop === "number") {
								// $('.Site').css('margin-top','');
								// $body.removeClass('Site_modalOPEN').css('overflow', '');
								$body.css("overflow", "");
								$("html").css("overflow-y", "");
								// if (scrollTop < 0) {
								//     $('html').scrollTop(-scrollTop);
								// }
							}
						}
					}
					if (
						"ontouchstart" in window ||
						navigator.maxTouchPoints > 0 ||
						navigator.msMaxTouchPoints > 0
					) {
						$(".Site").addClass("Site_touchscreen");
					}
					$trigger.filter('[data-event="click"]').on("click", triggerAction);
					$trigger.filter('[data-event="input"]').on("input", triggerAction);
					$(document).on("click", function (e) {
						var $this = $(e.target);
						if (
							$this.length &&
							!$this.closest(".modal_OPEN").length &&
							!$this.closest(".trigger_OPEN").length &&
							!$this.is(".trigger_OPEN")
						) {
							$(".modal.modal_OPEN").removeClass("modal_OPEN");
							$(".trigger.trigger_OPEN").removeClass("trigger_OPEN");
						}
					});

					$trigger
						.filter(".trigger_dropdown")
						.not('[data-event="click"], [data-event="input"]')
						.on("mouseover", function () {
							var $this = $(this);
							clearTimeout($this.data("timerId"));
							var $hint = "";
							var href = $this.attr("href") || $this.attr("data-href");
							if (href) {
								$hint = $(href);
							} else {
								$hint = $this.find(".modal");
							}
							$hint.css("z-index", "1020");
							if (!$hint.hasClass("modal_OPEN")) {
								actions.trigger(href, null, $this);
							}
						});
					$trigger
						.filter(".trigger_dropdown")
						.not('[data-event="click"], [data-event="input"]')
						.on("mouseleave", function () {
							var $this = $(this);
							var $hint = "";
							var href = $this.attr("href") || $this.attr("data-href");
							if (href) {
								$hint = $(href);
							} else {
								$hint = $this.find(".modal");
							}
							$hint.css("z-index", "");
							var timerId = setTimeout(function () {
								if ($hint.hasClass("modal_OPEN")) {
									$hint.removeClass("modal_OPEN");
									$this.removeClass("trigger_OPEN");
									return false;
								}
							}, 500);
							$this.data("timerId", timerId);
						});

					$modal.click(modalClick);
				},
			};
		};

		let modalAPI = modal();

		modalAPI.init();

		var table = function () {
			return {
				init: function () {
					let $table = $(".table");
					$table.wrap('<div class="tableWrap" />');
				},
			};
		};
		table().init();

		var tags = function () {
			let $wrap = $(".Site-wrap");
			let $body = $("body");
			let $html = $("html");
			return {
				init: function () {
					function reloadSideMg() {
						let leftWrapMg = $wrap.offset().left;
						let widthDocument = $html.outerWidth();
						$body.css({
							"--wrapMgSide": leftWrapMg + "px",
						});
						$html.css({
							"--htmlWidth": widthDocument,
						});
					}
					reloadSideMg();
					var doit;
					$(window).on("resize", function () {
						clearTimeout(doit);
						doit = setTimeout(reloadSideMg, 20);
					});
				},
			};
		};
		tags().init();

		var About = function () {
			return {
				init: function () {},
			};
		};
		About().init();

		var Banner = function () {
			return {
				init: function () {},
			};
		};
		Banner().init();

		var Benefits = function () {
			return {
				init: function () {},
			};
		};
		Benefits().init();

		var BlockReply = function () {
			return {
				init: function () {},
			};
		};
		BlockReply().init();

		var Directions = function () {
			return {
				init: function () {},
			};
		};
		Directions().init();

		var FileInsert = function () {
			return {
				init: function () {
					var $title = $(".FileInsert-title");
					var $ProductBlock = $(".FileInsert-ProductBlock");
					$title.each(function () {
						var $this = $(this);
						$this.attr("data-text", $this.text());
					});
					$(".FileInsert-input").on("change", function (e) {
						var $this = $(this);
						var files = e.target.files;
						var $parent = $this.closest(".FileInsert");
						$parent.find($ProductBlock).empty();
						var reader = [];

						if (files.length) {
							for (var i = 0; i < files.length; i++) {
								reader[i] = new FileReader();

								reader[i].onloadend = function () {
									let src = "";
									src = this.result;
									$parent
										.find($ProductBlock)
										.append(
											'<div class="ProductBlock-file">' +
												'<div class="ProductBlock-pict">' +
												'<img src="' +
												src +
												'" class="ProductBlock-img">' +
												"</div>" +
												'<span class="ProductBlock-actionFile ProductBlock-actionFile_load ProductBlock-actionFile_disable">' +
												'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
												'<path d="M15.1667 0.999756L15.7646 2.11753C16.1689 2.87322 16.371 3.25107 16.2374 3.41289C16.1037 3.57471 15.6635 3.44402 14.7831 3.18264C13.9029 2.92131 12.9684 2.78071 12 2.78071C6.75329 2.78071 2.5 6.90822 2.5 11.9998C2.5 13.6789 2.96262 15.2533 3.77093 16.6093M8.83333 22.9998L8.23536 21.882C7.83108 21.1263 7.62894 20.7484 7.7626 20.5866C7.89627 20.4248 8.33649 20.5555 9.21689 20.8169C10.0971 21.0782 11.0316 21.2188 12 21.2188C17.2467 21.2188 21.5 17.0913 21.5 11.9998C21.5 10.3206 21.0374 8.74623 20.2291 7.39023" stroke="#12B76A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>\n' +
												"</svg>" +
												"</span>" +
												"</div>"
										);
								};
								reader[i].readAsDataURL(files[i]);
							}
							$parent.find($title).empty().append("Изображение добавлено");
						} else {
							$parent
								.find($title)
								.empty()
								.append($parent.find($title).attr("data-text"));
						}
					});
				},
			};
		};
		FileInsert().init();

		var Goods = function () {
			return {
				init: function () {},
			};
		};
		Goods().init();

		var Middle = function () {
			let $middleTop = $(".Middle-top").eq(0);
			return {
				init: function () {
					function calcCQH(e) {
						$middleTop.css("--cqhMT", $middleTop.outerHeight() / 100);
					}
					calcCQH();
					$(window).on("resize", calcCQH);
				},
			};
		};
		Middle().init();

		var Promo = function () {
			return {
				init: function () {},
			};
		};
		Promo().init();

		var Request = function () {
			return {
				init: function () {},
			};
		};
		Request().init();

		var ScrollAnimate = function () {
			return {
				init: function () {},
			};
		};
		ScrollAnimate().init();

		var ScrollTo = function () {
			var $elements = $(".ScrollTo");
			return {
				init: function () {
					var heightHeader =
						$(".Header_scroll").outerHeight() || $(".Header").outerHeight();
					$(window).on("resize", function () {
						heightHeader =
							$(".Header_scroll").outerHeight() || $(".Header").outerHeight();
					});
					$elements.on("click", function (e) {
						e.preventDefault();
						var $this = $(this),
							href = $this.attr("href"),
							$href = $(href),
							zoom = parseFloat($(".Site").css("zoom"));
						var top = $href.get(0).getBoundingClientRect().top; // $href.get(0).offsetTop
						// var scrollTop = parseFloat($('html').get(0).scrollTop);
						window.scrollTo({
							top: top + (parseFloat($href.css("padding-top")) - 40) * zoom,
							behavior: "smooth",
						});
						$(".modal_menu.modal_OPEN .modal-close").trigger("click");
					});
				},
			};
		};
		ScrollTo().init();

		var Section = function () {
			return {
				init: function () {},
			};
		};
		Section().init();

		(function (factory) {
			"use strict";
			if (typeof define === "function" && define.amd) {
				define(["jquery"], factory);
			} else if (typeof exports !== "undefined") {
				module.exports = factory(require("jquery"));
			} else {
				factory(jQuery);
			}
		})(function ($) {
			"use strict";
			var Slick = window.Slick || {};
			Slick = (function () {
				var instanceUid = 0;
				function Slick(element, settings) {
					var _ = this,
						dataSettings;
					_.defaults = {
						accessibility: true,
						adaptiveHeight: false,
						appendArrows: $(element),
						appendDots: $(element),
						arrows: true,
						asNavFor: null,
						prevArrow:
							'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
						nextArrow:
							'<button class="slick-next" aria-label="Next" type="button">Next</button>',
						autoplay: false,
						autoplaySpeed: 3e3,
						centerMode: false,
						centerPadding: "50px",
						cssEase: "ease",
						customPaging: function (slider, i) {
							return $('<button type="button" />').text(i + 1);
						},
						dots: false,
						dotsClass: "slick-dots",
						draggable: true,
						easing: "linear",
						edgeFriction: 0.35,
						fade: false,
						focusOnSelect: false,
						focusOnChange: false,
						infinite: true,
						initialSlide: 0,
						lazyLoad: "ondemand",
						mobileFirst: false,
						pauseOnHover: true,
						pauseOnFocus: true,
						pauseOnDotsHover: false,
						respondTo: "window",
						responsive: null,
						rows: 1,
						rtl: false,
						slide: "",
						slidesPerRow: 1,
						slidesToShow: 1,
						slidesToScroll: 1,
						speed: 500,
						swipe: true,
						swipeToSlide: false,
						touchMove: true,
						touchThreshold: 5,
						useCSS: true,
						useTransform: true,
						variableWidth: false,
						vertical: false,
						verticalSwiping: false,
						waitForAnimate: true,
						zIndex: 1e3,
					};
					_.initials = {
						animating: false,
						dragging: false,
						autoPlayTimer: null,
						currentDirection: 0,
						currentLeft: null,
						currentSlide: 0,
						direction: 1,
						$dots: null,
						listWidth: null,
						listHeight: null,
						loadIndex: 0,
						$nextArrow: null,
						$prevArrow: null,
						scrolling: false,
						slideCount: null,
						slideWidth: null,
						$slideTrack: null,
						$slides: null,
						sliding: false,
						slideOffset: 0,
						swipeLeft: null,
						swiping: false,
						$list: null,
						touchObject: {},
						transformsEnabled: false,
						unslicked: false,
					};
					$.extend(_, _.initials);
					_.activeBreakpoint = null;
					_.animType = null;
					_.animProp = null;
					_.breakpoints = [];
					_.breakpointSettings = [];
					_.cssTransitions = false;
					_.focussed = false;
					_.interrupted = false;
					_.hidden = "hidden";
					_.paused = true;
					_.positionProp = null;
					_.respondTo = null;
					_.rowCount = 1;
					_.shouldClick = true;
					_.$slider = $(element);
					_.$slidesCache = null;
					_.transformType = null;
					_.transitionType = null;
					_.visibilityChange = "visibilitychange";
					_.windowWidth = 0;
					_.windowTimer = null;
					dataSettings = $(element).data("slick") || {};
					_.options = $.extend({}, _.defaults, settings, dataSettings);
					_.currentSlide = _.options.initialSlide;
					_.originalSettings = _.options;
					if (typeof document.mozHidden !== "undefined") {
						_.hidden = "mozHidden";
						_.visibilityChange = "mozvisibilitychange";
					} else if (typeof document.webkitHidden !== "undefined") {
						_.hidden = "webkitHidden";
						_.visibilityChange = "webkitvisibilitychange";
					}
					_.autoPlay = $.proxy(_.autoPlay, _);
					_.autoPlayClear = $.proxy(_.autoPlayClear, _);
					_.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
					_.changeSlide = $.proxy(_.changeSlide, _);
					_.clickHandler = $.proxy(_.clickHandler, _);
					_.selectHandler = $.proxy(_.selectHandler, _);
					_.setPosition = $.proxy(_.setPosition, _);
					_.swipeHandler = $.proxy(_.swipeHandler, _);
					_.dragHandler = $.proxy(_.dragHandler, _);
					_.keyHandler = $.proxy(_.keyHandler, _);
					_.instanceUid = instanceUid++;
					_.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
					_.registerBreakpoints();
					_.init(true);
				}
				return Slick;
			})();
			Slick.prototype.activateADA = function () {
				var _ = this;
				_.$slideTrack
					.find(".slick-active")
					.attr({ "aria-hidden": "false" })
					.find("a, input, button, select")
					.attr({ tabindex: "0" });
			};
			Slick.prototype.addSlide = Slick.prototype.slickAdd = function (
				markup,
				index,
				addBefore
			) {
				var _ = this;
				if (typeof index === "boolean") {
					addBefore = index;
					index = null;
				} else if (index < 0 || index >= _.slideCount) {
					return false;
				}
				_.unload();
				if (typeof index === "number") {
					if (index === 0 && _.$slides.length === 0) {
						$(markup).appendTo(_.$slideTrack);
					} else if (addBefore) {
						$(markup).insertBefore(_.$slides.eq(index));
					} else {
						$(markup).insertAfter(_.$slides.eq(index));
					}
				} else {
					if (addBefore === true) {
						$(markup).prependTo(_.$slideTrack);
					} else {
						$(markup).appendTo(_.$slideTrack);
					}
				}
				_.$slides = _.$slideTrack.children(this.options.slide);
				_.$slideTrack.children(this.options.slide).detach();
				_.$slideTrack.append(_.$slides);
				_.$slides.each(function (index, element) {
					$(element).attr("data-slick-index", index);
				});
				_.$slidesCache = _.$slides;
				_.reinit();
			};
			Slick.prototype.animateHeight = function () {
				var _ = this;
				if (
					_.options.slidesToShow === 1 &&
					_.options.adaptiveHeight === true &&
					_.options.vertical === false
				) {
					var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
					_.$list.animate({ height: targetHeight }, _.options.speed);
				}
			};
			Slick.prototype.animateSlide = function (targetLeft, callback) {
				var animProps = {},
					_ = this;
				_.animateHeight();
				if (_.options.rtl === true && _.options.vertical === false) {
					targetLeft = -targetLeft;
				}
				if (_.transformsEnabled === false) {
					if (_.options.vertical === false) {
						_.$slideTrack.animate(
							{ left: targetLeft },
							_.options.speed,
							_.options.easing,
							callback
						);
					} else {
						_.$slideTrack.animate(
							{ top: targetLeft },
							_.options.speed,
							_.options.easing,
							callback
						);
					}
				} else {
					if (_.cssTransitions === false) {
						if (_.options.rtl === true) {
							_.currentLeft = -_.currentLeft;
						}
						$({ animStart: _.currentLeft }).animate(
							{ animStart: targetLeft },
							{
								duration: _.options.speed,
								easing: _.options.easing,
								step: function (now) {
									now = Math.ceil(now);
									if (_.options.vertical === false) {
										animProps[_.animType] = "translate(" + now + "px, 0px)";
										_.$slideTrack.css(animProps);
									} else {
										animProps[_.animType] = "translate(0px," + now + "px)";
										_.$slideTrack.css(animProps);
									}
								},
								complete: function () {
									if (callback) {
										callback.call();
									}
								},
							}
						);
					} else {
						_.applyTransition();
						targetLeft = Math.ceil(targetLeft);
						if (_.options.vertical === false) {
							animProps[_.animType] =
								"translate3d(" + targetLeft + "px, 0px, 0px)";
						} else {
							animProps[_.animType] =
								"translate3d(0px," + targetLeft + "px, 0px)";
						}
						_.$slideTrack.css(animProps);
						if (callback) {
							setTimeout(function () {
								_.disableTransition();
								callback.call();
							}, _.options.speed);
						}
					}
				}
			};
			Slick.prototype.getNavTarget = function () {
				var _ = this,
					asNavFor = _.options.asNavFor;
				if (asNavFor && asNavFor !== null) {
					asNavFor = $(asNavFor).not(_.$slider);
				}
				return asNavFor;
			};
			Slick.prototype.asNavFor = function (index) {
				var _ = this,
					asNavFor = _.getNavTarget();
				if (asNavFor !== null && typeof asNavFor === "object") {
					asNavFor.each(function () {
						var target = $(this).slick("getSlick");
						if (!target.unslicked) {
							target.slideHandler(index, true);
						}
					});
				}
			};
			Slick.prototype.applyTransition = function (slide) {
				var _ = this,
					transition = {};
				if (_.options.fade === false) {
					transition[_.transitionType] =
						_.transformType + " " + _.options.speed + "ms " + _.options.cssEase;
				} else {
					transition[_.transitionType] =
						"opacity " + _.options.speed + "ms " + _.options.cssEase;
				}
				if (_.options.fade === false) {
					_.$slideTrack.css(transition);
				} else {
					_.$slides.eq(slide).css(transition);
				}
			};
			Slick.prototype.autoPlay = function () {
				var _ = this;
				_.autoPlayClear();
				if (_.slideCount > _.options.slidesToShow) {
					_.autoPlayTimer = setInterval(
						_.autoPlayIterator,
						_.options.autoplaySpeed
					);
				}
			};
			Slick.prototype.autoPlayClear = function () {
				var _ = this;
				if (_.autoPlayTimer) {
					clearInterval(_.autoPlayTimer);
				}
			};
			Slick.prototype.autoPlayIterator = function () {
				var _ = this,
					slideTo = _.currentSlide + _.options.slidesToScroll;
				if (!_.paused && !_.interrupted && !_.focussed) {
					if (_.options.infinite === false) {
						if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
							_.direction = 0;
						} else if (_.direction === 0) {
							slideTo = _.currentSlide - _.options.slidesToScroll;
							if (_.currentSlide - 1 === 0) {
								_.direction = 1;
							}
						}
					}
					_.slideHandler(slideTo);
				}
			};
			Slick.prototype.buildArrows = function () {
				var _ = this;
				if (_.options.arrows === true) {
					_.$prevArrow = $(_.options.prevArrow).addClass("slick-arrow");
					_.$nextArrow = $(_.options.nextArrow).addClass("slick-arrow");
					if (_.slideCount > _.options.slidesToShow) {
						_.$prevArrow
							.removeClass("slick-hidden")
							.removeAttr("aria-hidden tabindex");
						_.$nextArrow
							.removeClass("slick-hidden")
							.removeAttr("aria-hidden tabindex");
						if (_.htmlExpr.test(_.options.prevArrow)) {
							_.$prevArrow.prependTo(_.options.appendArrows);
						}
						if (_.htmlExpr.test(_.options.nextArrow)) {
							_.$nextArrow.appendTo(_.options.appendArrows);
						}
						if (_.options.infinite !== true) {
							_.$prevArrow
								.addClass("slick-disabled")
								.attr("aria-disabled", "true");
						}
					} else {
						_.$prevArrow
							.add(_.$nextArrow)
							.addClass("slick-hidden")
							.attr({ "aria-disabled": "true", tabindex: "-1" });
					}
				}
			};
			Slick.prototype.buildDots = function () {
				var _ = this,
					i,
					dot;
				if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
					_.$slider.addClass("slick-dotted");
					dot = $("<ul />").addClass(_.options.dotsClass);
					for (i = 0; i <= _.getDotCount(); i += 1) {
						dot.append(
							$("<li />").append(_.options.customPaging.call(this, _, i))
						);
					}
					_.$dots = dot.appendTo(_.options.appendDots);
					_.$dots.find("li").first().addClass("slick-active");
				}
			};
			Slick.prototype.buildOut = function () {
				var _ = this;
				_.$slides = _.$slider
					.children(_.options.slide + ":not(.slick-cloned)")
					.addClass("slick-slide");
				_.slideCount = _.$slides.length;
				_.$slides.each(function (index, element) {
					$(element)
						.attr("data-slick-index", index)
						.data("originalStyling", $(element).attr("style") || "");
				});
				_.$slider.addClass("slick-slider");
				_.$slideTrack =
					_.slideCount === 0
						? $('<div class="slick-track"/>').appendTo(_.$slider)
						: _.$slides.wrapAll('<div class="slick-track"/>').parent();
				_.$list = _.$slideTrack.wrap('<div class="slick-list"/>').parent();
				_.$slideTrack.css("opacity", 0);
				if (_.options.centerMode === true || _.options.swipeToSlide === true) {
					_.options.slidesToScroll = 1;
				}
				$("img[data-lazy]", _.$slider).not("[src]").addClass("slick-loading");
				_.setupInfinite();
				_.buildArrows();
				_.buildDots();
				_.updateDots();
				_.setSlideClasses(
					typeof _.currentSlide === "number" ? _.currentSlide : 0
				);
				if (_.options.draggable === true) {
					_.$list.addClass("draggable");
				}
			};
			Slick.prototype.buildRows = function () {
				var _ = this,
					a,
					b,
					c,
					newSlides,
					numOfSlides,
					originalSlides,
					slidesPerSection;
				newSlides = document.createDocumentFragment();
				originalSlides = _.$slider.children();
				if (_.options.rows > 0) {
					slidesPerSection = _.options.slidesPerRow * _.options.rows;
					numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);
					for (a = 0; a < numOfSlides; a++) {
						var slide = document.createElement("div");
						for (b = 0; b < _.options.rows; b++) {
							var row = document.createElement("div");
							for (c = 0; c < _.options.slidesPerRow; c++) {
								var target =
									a * slidesPerSection + (b * _.options.slidesPerRow + c);
								if (originalSlides.get(target)) {
									row.appendChild(originalSlides.get(target));
								}
							}
							slide.appendChild(row);
						}
						newSlides.appendChild(slide);
					}
					_.$slider.empty().append(newSlides);
					_.$slider
						.children()
						.children()
						.children()
						.css({
							width: 100 / _.options.slidesPerRow + "%",
							display: "inline-block",
						});
				}
			};
			Slick.prototype.checkResponsive = function (initial, forceUpdate) {
				var _ = this,
					breakpoint,
					targetBreakpoint,
					respondToWidth,
					triggerBreakpoint = false;
				var sliderWidth = _.$slider.width();
				var windowWidth = window.innerWidth || $(window).width();
				if (_.respondTo === "window") {
					respondToWidth = windowWidth;
				} else if (_.respondTo === "slider") {
					respondToWidth = sliderWidth;
				} else if (_.respondTo === "min") {
					respondToWidth = Math.min(windowWidth, sliderWidth);
				}
				if (
					_.options.responsive &&
					_.options.responsive.length &&
					_.options.responsive !== null
				) {
					targetBreakpoint = null;
					for (breakpoint in _.breakpoints) {
						if (_.breakpoints.hasOwnProperty(breakpoint)) {
							if (_.originalSettings.mobileFirst === false) {
								if (respondToWidth < _.breakpoints[breakpoint]) {
									targetBreakpoint = _.breakpoints[breakpoint];
								}
							} else {
								if (respondToWidth > _.breakpoints[breakpoint]) {
									targetBreakpoint = _.breakpoints[breakpoint];
								}
							}
						}
					}
					if (targetBreakpoint !== null) {
						if (_.activeBreakpoint !== null) {
							if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
								_.activeBreakpoint = targetBreakpoint;
								if (_.breakpointSettings[targetBreakpoint] === "unslick") {
									_.unslick(targetBreakpoint);
								} else {
									_.options = $.extend(
										{},
										_.originalSettings,
										_.breakpointSettings[targetBreakpoint]
									);
									if (initial === true) {
										_.currentSlide = _.options.initialSlide;
									}
									_.refresh(initial);
								}
								triggerBreakpoint = targetBreakpoint;
							}
						} else {
							_.activeBreakpoint = targetBreakpoint;
							if (_.breakpointSettings[targetBreakpoint] === "unslick") {
								_.unslick(targetBreakpoint);
							} else {
								_.options = $.extend(
									{},
									_.originalSettings,
									_.breakpointSettings[targetBreakpoint]
								);
								if (initial === true) {
									_.currentSlide = _.options.initialSlide;
								}
								_.refresh(initial);
							}
							triggerBreakpoint = targetBreakpoint;
						}
					} else {
						if (_.activeBreakpoint !== null) {
							_.activeBreakpoint = null;
							_.options = _.originalSettings;
							if (initial === true) {
								_.currentSlide = _.options.initialSlide;
							}
							_.refresh(initial);
							triggerBreakpoint = targetBreakpoint;
						}
					}
					if (!initial && triggerBreakpoint !== false) {
						_.$slider.trigger("breakpoint", [_, triggerBreakpoint]);
					}
				}
			};
			Slick.prototype.changeSlide = function (event, dontAnimate) {
				var _ = this,
					$target = $(event.currentTarget),
					indexOffset,
					slideOffset,
					unevenOffset;
				if ($target.is("a")) {
					event.preventDefault();
				}
				if (!$target.is("li")) {
					$target = $target.closest("li");
				}
				unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
				indexOffset = unevenOffset
					? 0
					: (_.slideCount - _.currentSlide) % _.options.slidesToScroll;
				switch (event.data.message) {
					case "previous":
						slideOffset =
							indexOffset === 0
								? _.options.slidesToScroll
								: _.options.slidesToShow - indexOffset;
						if (_.slideCount > _.options.slidesToShow) {
							_.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
						}
						break;
					case "next":
						slideOffset =
							indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
						if (_.slideCount > _.options.slidesToShow) {
							_.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
						}
						break;
					case "index":
						var index =
							event.data.index === 0
								? 0
								: event.data.index ||
								  $target.index() * _.options.slidesToScroll;
						_.slideHandler(_.checkNavigable(index), false, dontAnimate);
						$target.children().trigger("focus");
						break;
					default:
						return;
				}
			};
			Slick.prototype.checkNavigable = function (index) {
				var _ = this,
					navigables,
					prevNavigable;
				navigables = _.getNavigableIndexes();
				prevNavigable = 0;
				if (index > navigables[navigables.length - 1]) {
					index = navigables[navigables.length - 1];
				} else {
					for (var n in navigables) {
						if (index < navigables[n]) {
							index = prevNavigable;
							break;
						}
						prevNavigable = navigables[n];
					}
				}
				return index;
			};
			Slick.prototype.cleanUpEvents = function () {
				var _ = this;
				if (_.options.dots && _.$dots !== null) {
					$("li", _.$dots)
						.off("click.slick", _.changeSlide)
						.off("mouseenter.slick", $.proxy(_.interrupt, _, true))
						.off("mouseleave.slick", $.proxy(_.interrupt, _, false));
					if (_.options.accessibility === true) {
						_.$dots.off("keydown.slick", _.keyHandler);
					}
				}
				_.$slider.off("focus.slick blur.slick");
				if (
					_.options.arrows === true &&
					_.slideCount > _.options.slidesToShow
				) {
					_.$prevArrow && _.$prevArrow.off("click.slick", _.changeSlide);
					_.$nextArrow && _.$nextArrow.off("click.slick", _.changeSlide);
					if (_.options.accessibility === true) {
						_.$prevArrow && _.$prevArrow.off("keydown.slick", _.keyHandler);
						_.$nextArrow && _.$nextArrow.off("keydown.slick", _.keyHandler);
					}
				}
				_.$list.off("touchstart.slick mousedown.slick", _.swipeHandler);
				_.$list.off("touchmove.slick mousemove.slick", _.swipeHandler);
				_.$list.off("touchend.slick mouseup.slick", _.swipeHandler);
				_.$list.off("touchcancel.slick mouseleave.slick", _.swipeHandler);
				_.$list.off("click.slick", _.clickHandler);
				$(document).off(_.visibilityChange, _.visibility);
				_.cleanUpSlideEvents();
				if (_.options.accessibility === true) {
					_.$list.off("keydown.slick", _.keyHandler);
				}
				if (_.options.focusOnSelect === true) {
					$(_.$slideTrack).children().off("click.slick", _.selectHandler);
				}
				$(window).off(
					"orientationchange.slick.slick-" + _.instanceUid,
					_.orientationChange
				);
				$(window).off("resize.slick.slick-" + _.instanceUid, _.resize);
				$("[draggable!=true]", _.$slideTrack).off(
					"dragstart",
					_.preventDefault
				);
				$(window).off("load.slick.slick-" + _.instanceUid, _.setPosition);
			};
			Slick.prototype.cleanUpSlideEvents = function () {
				var _ = this;
				_.$list.off("mouseenter.slick", $.proxy(_.interrupt, _, true));
				_.$list.off("mouseleave.slick", $.proxy(_.interrupt, _, false));
			};
			Slick.prototype.cleanUpRows = function () {
				var _ = this,
					originalSlides;
				if (_.options.rows > 0) {
					originalSlides = _.$slides.children().children();
					originalSlides.removeAttr("style");
					_.$slider.empty().append(originalSlides);
				}
			};
			Slick.prototype.clickHandler = function (event) {
				var _ = this;
				if (_.shouldClick === false) {
					event.stopImmediatePropagation();
					event.stopPropagation();
					event.preventDefault();
				}
			};
			Slick.prototype.destroy = function (refresh) {
				var _ = this;
				_.autoPlayClear();
				_.touchObject = {};
				_.cleanUpEvents();
				$(".slick-cloned", _.$slider).detach();
				if (_.$dots) {
					_.$dots.remove();
				}
				if (_.$prevArrow && _.$prevArrow.length) {
					_.$prevArrow
						.removeClass("slick-disabled slick-arrow slick-hidden")
						.removeAttr("aria-hidden aria-disabled tabindex")
						.css("display", "");
					if (_.htmlExpr.test(_.options.prevArrow)) {
						_.$prevArrow.remove();
					}
				}
				if (_.$nextArrow && _.$nextArrow.length) {
					_.$nextArrow
						.removeClass("slick-disabled slick-arrow slick-hidden")
						.removeAttr("aria-hidden aria-disabled tabindex")
						.css("display", "");
					if (_.htmlExpr.test(_.options.nextArrow)) {
						_.$nextArrow.remove();
					}
				}
				if (_.$slides) {
					_.$slides
						.removeClass(
							"slick-slide slick-active slick-center slick-visible slick-current"
						)
						.removeAttr("aria-hidden")
						.removeAttr("data-slick-index")
						.each(function () {
							$(this).attr("style", $(this).data("originalStyling"));
						});
					_.$slideTrack.children(this.options.slide).detach();
					_.$slideTrack.detach();
					_.$list.detach();
					_.$slider.append(_.$slides);
				}
				_.cleanUpRows();
				_.$slider.removeClass("slick-slider");
				_.$slider.removeClass("slick-initialized");
				_.$slider.removeClass("slick-dotted");
				_.unslicked = true;
				if (!refresh) {
					_.$slider.trigger("destroy", [_]);
				}
			};
			Slick.prototype.disableTransition = function (slide) {
				var _ = this,
					transition = {};
				transition[_.transitionType] = "";
				if (_.options.fade === false) {
					_.$slideTrack.css(transition);
				} else {
					_.$slides.eq(slide).css(transition);
				}
			};
			Slick.prototype.fadeSlide = function (slideIndex, callback) {
				var _ = this;
				if (_.cssTransitions === false) {
					_.$slides.eq(slideIndex).css({ zIndex: _.options.zIndex });
					_.$slides
						.eq(slideIndex)
						.animate(
							{ opacity: 1 },
							_.options.speed,
							_.options.easing,
							callback
						);
				} else {
					_.applyTransition(slideIndex);
					_.$slides
						.eq(slideIndex)
						.css({ opacity: 1, zIndex: _.options.zIndex });
					if (callback) {
						setTimeout(function () {
							_.disableTransition(slideIndex);
							callback.call();
						}, _.options.speed);
					}
				}
			};
			Slick.prototype.fadeSlideOut = function (slideIndex) {
				var _ = this;
				if (_.cssTransitions === false) {
					_.$slides
						.eq(slideIndex)
						.animate(
							{ opacity: 0, zIndex: _.options.zIndex - 2 },
							_.options.speed,
							_.options.easing
						);
				} else {
					_.applyTransition(slideIndex);
					_.$slides
						.eq(slideIndex)
						.css({ opacity: 0, zIndex: _.options.zIndex - 2 });
				}
			};
			Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (
				filter
			) {
				var _ = this;
				if (filter !== null) {
					_.$slidesCache = _.$slides;
					_.unload();
					_.$slideTrack.children(this.options.slide).detach();
					_.$slidesCache.filter(filter).appendTo(_.$slideTrack);
					_.reinit();
				}
			};
			Slick.prototype.focusHandler = function () {
				var _ = this;
				_.$slider
					.off("focus.slick blur.slick")
					.on("focus.slick", "*", function (event) {
						var $sf = $(this);
						setTimeout(function () {
							if (_.options.pauseOnFocus) {
								if ($sf.is(":focus")) {
									_.focussed = true;
									_.autoPlay();
								}
							}
						}, 0);
					})
					.on("blur.slick", "*", function (event) {
						var $sf = $(this);
						if (_.options.pauseOnFocus) {
							_.focussed = false;
							_.autoPlay();
						}
					});
			};
			Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide =
				function () {
					var _ = this;
					return _.currentSlide;
				};
			Slick.prototype.getDotCount = function () {
				var _ = this;
				var breakPoint = 0;
				var counter = 0;
				var pagerQty = 0;
				if (_.options.infinite === true) {
					if (_.slideCount <= _.options.slidesToShow) {
						++pagerQty;
					} else {
						while (breakPoint < _.slideCount) {
							++pagerQty;
							breakPoint = counter + _.options.slidesToScroll;
							counter +=
								_.options.slidesToScroll <= _.options.slidesToShow
									? _.options.slidesToScroll
									: _.options.slidesToShow;
						}
					}
				} else if (_.options.centerMode === true) {
					pagerQty = _.slideCount;
				} else if (!_.options.asNavFor) {
					pagerQty =
						1 +
						Math.ceil(
							(_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll
						);
				} else {
					while (breakPoint < _.slideCount) {
						++pagerQty;
						breakPoint = counter + _.options.slidesToScroll;
						counter +=
							_.options.slidesToScroll <= _.options.slidesToShow
								? _.options.slidesToScroll
								: _.options.slidesToShow;
					}
				}
				return pagerQty - 1;
			};
			Slick.prototype.getLeft = function (slideIndex) {
				var _ = this,
					targetLeft,
					verticalHeight,
					verticalOffset = 0,
					targetSlide,
					coef;
				_.slideOffset = 0;
				verticalHeight = _.$slides.first().outerHeight(true);
				if (_.options.infinite === true) {
					if (_.slideCount > _.options.slidesToShow) {
						_.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
						coef = -1;
						if (_.options.vertical === true && _.options.centerMode === true) {
							if (_.options.slidesToShow === 2) {
								coef = -1.5;
							} else if (_.options.slidesToShow === 1) {
								coef = -2;
							}
						}
						verticalOffset = verticalHeight * _.options.slidesToShow * coef;
					}
					if (_.slideCount % _.options.slidesToScroll !== 0) {
						if (
							slideIndex + _.options.slidesToScroll > _.slideCount &&
							_.slideCount > _.options.slidesToShow
						) {
							if (slideIndex > _.slideCount) {
								_.slideOffset =
									(_.options.slidesToShow - (slideIndex - _.slideCount)) *
									_.slideWidth *
									-1;
								verticalOffset =
									(_.options.slidesToShow - (slideIndex - _.slideCount)) *
									verticalHeight *
									-1;
							} else {
								_.slideOffset =
									(_.slideCount % _.options.slidesToScroll) * _.slideWidth * -1;
								verticalOffset =
									(_.slideCount % _.options.slidesToScroll) *
									verticalHeight *
									-1;
							}
						}
					}
				} else {
					if (slideIndex + _.options.slidesToShow > _.slideCount) {
						_.slideOffset =
							(slideIndex + _.options.slidesToShow - _.slideCount) *
							_.slideWidth;
						verticalOffset =
							(slideIndex + _.options.slidesToShow - _.slideCount) *
							verticalHeight;
					}
				}
				if (_.slideCount <= _.options.slidesToShow) {
					_.slideOffset = 0;
					verticalOffset = 0;
				}
				if (
					_.options.centerMode === true &&
					_.slideCount <= _.options.slidesToShow
				) {
					_.slideOffset =
						(_.slideWidth * Math.floor(_.options.slidesToShow)) / 2 -
						(_.slideWidth * _.slideCount) / 2;
				} else if (
					_.options.centerMode === true &&
					_.options.infinite === true
				) {
					_.slideOffset +=
						_.slideWidth * Math.floor(_.options.slidesToShow / 2) -
						_.slideWidth;
				} else if (_.options.centerMode === true) {
					_.slideOffset = 0;
					_.slideOffset +=
						_.slideWidth * Math.floor(_.options.slidesToShow / 2);
				}
				if (_.options.vertical === false) {
					targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
				} else {
					targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
				}
				if (_.options.variableWidth === true) {
					if (
						_.slideCount <= _.options.slidesToShow ||
						_.options.infinite === false
					) {
						targetSlide = _.$slideTrack.children(".slick-slide").eq(slideIndex);
					} else {
						targetSlide = _.$slideTrack
							.children(".slick-slide")
							.eq(slideIndex + _.options.slidesToShow);
					}
					if (_.options.rtl === true) {
						if (targetSlide[0]) {
							targetLeft =
								(_.$slideTrack.width() -
									targetSlide[0].offsetLeft -
									targetSlide.width()) *
								-1;
						} else {
							targetLeft = 0;
						}
					} else {
						targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
					}
					if (_.options.centerMode === true) {
						if (
							_.slideCount <= _.options.slidesToShow ||
							_.options.infinite === false
						) {
							targetSlide = _.$slideTrack
								.children(".slick-slide")
								.eq(slideIndex);
						} else {
							targetSlide = _.$slideTrack
								.children(".slick-slide")
								.eq(slideIndex + _.options.slidesToShow + 1);
						}
						if (_.options.rtl === true) {
							if (targetSlide[0]) {
								targetLeft =
									(_.$slideTrack.width() -
										targetSlide[0].offsetLeft -
										targetSlide.width()) *
									-1;
							} else {
								targetLeft = 0;
							}
						} else {
							targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
						}
						targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
					}
				}
				return targetLeft;
			};
			Slick.prototype.getOption = Slick.prototype.slickGetOption = function (
				option
			) {
				var _ = this;
				return _.options[option];
			};
			Slick.prototype.getNavigableIndexes = function () {
				var _ = this,
					breakPoint = 0,
					counter = 0,
					indexes = [],
					max;
				if (_.options.infinite === false) {
					max = _.slideCount;
				} else {
					breakPoint = _.options.slidesToScroll * -1;
					counter = _.options.slidesToScroll * -1;
					max = _.slideCount * 2;
				}
				while (breakPoint < max) {
					indexes.push(breakPoint);
					breakPoint = counter + _.options.slidesToScroll;
					counter +=
						_.options.slidesToScroll <= _.options.slidesToShow
							? _.options.slidesToScroll
							: _.options.slidesToShow;
				}
				return indexes;
			};
			Slick.prototype.getSlick = function () {
				return this;
			};
			Slick.prototype.getSlideCount = function () {
				var _ = this,
					slidesTraversed,
					swipedSlide,
					swipeTarget,
					centerOffset;
				centerOffset =
					_.options.centerMode === true ? Math.floor(_.$list.width() / 2) : 0;
				swipeTarget = _.swipeLeft * -1 + centerOffset;
				if (_.options.swipeToSlide === true) {
					_.$slideTrack.find(".slick-slide").each(function (index, slide) {
						var slideOuterWidth, slideOffset, slideRightBoundary;
						slideOuterWidth = $(slide).outerWidth();
						slideOffset = slide.offsetLeft;
						if (_.options.centerMode !== true) {
							slideOffset += slideOuterWidth / 2;
						}
						slideRightBoundary = slideOffset + slideOuterWidth;
						if (swipeTarget < slideRightBoundary) {
							swipedSlide = slide;
							return false;
						}
					});
					slidesTraversed =
						Math.abs(
							$(swipedSlide).attr("data-slick-index") - _.currentSlide
						) || 1;
					return slidesTraversed;
				} else {
					return _.options.slidesToScroll;
				}
			};
			Slick.prototype.goTo = Slick.prototype.slickGoTo = function (
				slide,
				dontAnimate
			) {
				var _ = this;
				_.changeSlide(
					{ data: { message: "index", index: parseInt(slide) } },
					dontAnimate
				);
			};
			Slick.prototype.init = function (creation) {
				var _ = this;
				if (!$(_.$slider).hasClass("slick-initialized")) {
					$(_.$slider).addClass("slick-initialized");
					_.buildRows();
					_.buildOut();
					_.setProps();
					_.startLoad();
					_.loadSlider();
					_.initializeEvents();
					_.updateArrows();
					_.updateDots();
					_.checkResponsive(true);
					_.focusHandler();
				}
				if (creation) {
					_.$slider.trigger("init", [_]);
				}
				if (_.options.accessibility === true) {
					_.initADA();
				}
				if (_.options.autoplay) {
					_.paused = false;
					_.autoPlay();
				}
			};
			Slick.prototype.initADA = function () {
				var _ = this,
					numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
					tabControlIndexes = _.getNavigableIndexes().filter(function (val) {
						return val >= 0 && val < _.slideCount;
					});
				_.$slides
					.add(_.$slideTrack.find(".slick-cloned"))
					.attr({ "aria-hidden": "true", tabindex: "-1" })
					.find("a, input, button, select")
					.attr({ tabindex: "-1" });
				if (_.$dots !== null) {
					_.$slides.not(_.$slideTrack.find(".slick-cloned")).each(function (i) {
						var slideControlIndex = tabControlIndexes.indexOf(i);
						$(this).attr({
							role: "tabpanel",
							id: "slick-slide" + _.instanceUid + i,
							tabindex: -1,
						});
						if (slideControlIndex !== -1) {
							var ariaButtonControl =
								"slick-slide-control" + _.instanceUid + slideControlIndex;
							if ($("#" + ariaButtonControl).length) {
								$(this).attr({ "aria-describedby": ariaButtonControl });
							}
						}
					});
					_.$dots
						.attr("role", "tablist")
						.find("li")
						.each(function (i) {
							var mappedSlideIndex = tabControlIndexes[i];
							$(this).attr({ role: "presentation" });
							$(this)
								.find("button")
								.first()
								.attr({
									role: "tab",
									id: "slick-slide-control" + _.instanceUid + i,
									"aria-controls":
										"slick-slide" + _.instanceUid + mappedSlideIndex,
									"aria-label": i + 1 + " of " + numDotGroups,
									"aria-selected": null,
									tabindex: "-1",
								});
						})
						.eq(_.currentSlide)
						.find("button")
						.attr({ "aria-selected": "true", tabindex: "0" })
						.end();
				}
				for (
					var i = _.currentSlide, max = i + _.options.slidesToShow;
					i < max;
					i++
				) {
					if (_.options.focusOnChange) {
						_.$slides.eq(i).attr({ tabindex: "0" });
					} else {
						_.$slides.eq(i).removeAttr("tabindex");
					}
				}
				_.activateADA();
			};
			Slick.prototype.initArrowEvents = function () {
				var _ = this;
				if (
					_.options.arrows === true &&
					_.slideCount > _.options.slidesToShow
				) {
					_.$prevArrow
						.off("click.slick")
						.on("click.slick", { message: "previous" }, _.changeSlide);
					_.$nextArrow
						.off("click.slick")
						.on("click.slick", { message: "next" }, _.changeSlide);
					if (_.options.accessibility === true) {
						_.$prevArrow.on("keydown.slick", _.keyHandler);
						_.$nextArrow.on("keydown.slick", _.keyHandler);
					}
				}
			};
			Slick.prototype.initDotEvents = function () {
				var _ = this;
				if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
					$("li", _.$dots).on(
						"click.slick",
						{ message: "index" },
						_.changeSlide
					);
					if (_.options.accessibility === true) {
						_.$dots.on("keydown.slick", _.keyHandler);
					}
				}
				if (
					_.options.dots === true &&
					_.options.pauseOnDotsHover === true &&
					_.slideCount > _.options.slidesToShow
				) {
					$("li", _.$dots)
						.on("mouseenter.slick", $.proxy(_.interrupt, _, true))
						.on("mouseleave.slick", $.proxy(_.interrupt, _, false));
				}
			};
			Slick.prototype.initSlideEvents = function () {
				var _ = this;
				if (_.options.pauseOnHover) {
					_.$list.on("mouseenter.slick", $.proxy(_.interrupt, _, true));
					_.$list.on("mouseleave.slick", $.proxy(_.interrupt, _, false));
				}
			};
			Slick.prototype.initializeEvents = function () {
				var _ = this;
				_.initArrowEvents();
				_.initDotEvents();
				_.initSlideEvents();
				_.$list.on(
					"touchstart.slick mousedown.slick",
					{ action: "start" },
					_.swipeHandler
				);
				_.$list.on(
					"touchmove.slick mousemove.slick",
					{ action: "move" },
					_.swipeHandler
				);
				_.$list.on(
					"touchend.slick mouseup.slick",
					{ action: "end" },
					_.swipeHandler
				);
				_.$list.on(
					"touchcancel.slick mouseleave.slick",
					{ action: "end" },
					_.swipeHandler
				);
				_.$list.on("click.slick", _.clickHandler);
				$(document).on(_.visibilityChange, $.proxy(_.visibility, _));
				if (_.options.accessibility === true) {
					_.$list.on("keydown.slick", _.keyHandler);
				}
				if (_.options.focusOnSelect === true) {
					$(_.$slideTrack).children().on("click.slick", _.selectHandler);
				}
				$(window).on(
					"orientationchange.slick.slick-" + _.instanceUid,
					$.proxy(_.orientationChange, _)
				);
				$(window).on(
					"resize.slick.slick-" + _.instanceUid,
					$.proxy(_.resize, _)
				);
				$("[draggable!=true]", _.$slideTrack).on("dragstart", _.preventDefault);
				$(window).on("load.slick.slick-" + _.instanceUid, _.setPosition);
				$(_.setPosition);
			};
			Slick.prototype.initUI = function () {
				var _ = this;
				if (
					_.options.arrows === true &&
					_.slideCount > _.options.slidesToShow
				) {
					_.$prevArrow.show();
					_.$nextArrow.show();
				}
				if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
					_.$dots.show();
				}
			};
			Slick.prototype.keyHandler = function (event) {
				var _ = this;
				if (!event.target.tagName.match("TEXTAREA|INPUT|SELECT")) {
					if (event.keyCode === 37 && _.options.accessibility === true) {
						_.changeSlide({
							data: { message: _.options.rtl === true ? "next" : "previous" },
						});
					} else if (event.keyCode === 39 && _.options.accessibility === true) {
						_.changeSlide({
							data: { message: _.options.rtl === true ? "previous" : "next" },
						});
					}
				}
			};
			Slick.prototype.lazyLoad = function () {
				var _ = this,
					loadRange,
					cloneRange,
					rangeStart,
					rangeEnd;
				function loadImages(imagesScope) {
					$("img[data-lazy]", imagesScope).each(function () {
						var image = $(this),
							imageSource = $(this).attr("data-lazy"),
							imageSrcSet = $(this).attr("data-srcset"),
							imageSizes =
								$(this).attr("data-sizes") || _.$slider.attr("data-sizes"),
							imageToLoad = document.createElement("img");
						imageToLoad.onload = function () {
							image.animate({ opacity: 0 }, 100, function () {
								if (imageSrcSet) {
									image.attr("srcset", imageSrcSet);
									if (imageSizes) {
										image.attr("sizes", imageSizes);
									}
								}
								image
									.attr("src", imageSource)
									.animate({ opacity: 1 }, 200, function () {
										image
											.removeAttr("data-lazy data-srcset data-sizes")
											.removeClass("slick-loading");
									});
								_.$slider.trigger("lazyLoaded", [_, image, imageSource]);
							});
						};
						imageToLoad.onerror = function () {
							image
								.removeAttr("data-lazy")
								.removeClass("slick-loading")
								.addClass("slick-lazyload-error");
							_.$slider.trigger("lazyLoadError", [_, image, imageSource]);
						};
						imageToLoad.src = imageSource;
					});
				}
				if (_.options.centerMode === true) {
					if (_.options.infinite === true) {
						rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
						rangeEnd = rangeStart + _.options.slidesToShow + 2;
					} else {
						rangeStart = Math.max(
							0,
							_.currentSlide - (_.options.slidesToShow / 2 + 1)
						);
						rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
					}
				} else {
					rangeStart = _.options.infinite
						? _.options.slidesToShow + _.currentSlide
						: _.currentSlide;
					rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
					if (_.options.fade === true) {
						if (rangeStart > 0) rangeStart--;
						if (rangeEnd <= _.slideCount) rangeEnd++;
					}
				}
				loadRange = _.$slider.find(".slick-slide").slice(rangeStart, rangeEnd);
				if (_.options.lazyLoad === "anticipated") {
					var prevSlide = rangeStart - 1,
						nextSlide = rangeEnd,
						$slides = _.$slider.find(".slick-slide");
					for (var i = 0; i < _.options.slidesToScroll; i++) {
						if (prevSlide < 0) prevSlide = _.slideCount - 1;
						loadRange = loadRange.add($slides.eq(prevSlide));
						loadRange = loadRange.add($slides.eq(nextSlide));
						prevSlide--;
						nextSlide++;
					}
				}
				loadImages(loadRange);
				if (_.slideCount <= _.options.slidesToShow) {
					cloneRange = _.$slider.find(".slick-slide");
					loadImages(cloneRange);
				} else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
					cloneRange = _.$slider
						.find(".slick-cloned")
						.slice(0, _.options.slidesToShow);
					loadImages(cloneRange);
				} else if (_.currentSlide === 0) {
					cloneRange = _.$slider
						.find(".slick-cloned")
						.slice(_.options.slidesToShow * -1);
					loadImages(cloneRange);
				}
			};
			Slick.prototype.loadSlider = function () {
				var _ = this;
				_.setPosition();
				_.$slideTrack.css({ opacity: 1 });
				_.$slider.removeClass("slick-loading");
				_.initUI();
				if (_.options.lazyLoad === "progressive") {
					_.progressiveLazyLoad();
				}
			};
			Slick.prototype.next = Slick.prototype.slickNext = function () {
				var _ = this;
				_.changeSlide({ data: { message: "next" } });
			};
			Slick.prototype.orientationChange = function () {
				var _ = this;
				_.checkResponsive();
				_.setPosition();
			};
			Slick.prototype.pause = Slick.prototype.slickPause = function () {
				var _ = this;
				_.autoPlayClear();
				_.paused = true;
			};
			Slick.prototype.play = Slick.prototype.slickPlay = function () {
				var _ = this;
				_.autoPlay();
				_.options.autoplay = true;
				_.paused = false;
				_.focussed = false;
				_.interrupted = false;
			};
			Slick.prototype.postSlide = function (index) {
				var _ = this;
				if (!_.unslicked) {
					_.$slider.trigger("afterChange", [_, index]);
					_.animating = false;
					if (_.slideCount > _.options.slidesToShow) {
						_.setPosition();
					}
					_.swipeLeft = null;
					if (_.options.autoplay) {
						_.autoPlay();
					}
					if (_.options.accessibility === true) {
						_.initADA();
						if (_.options.focusOnChange) {
							var $currentSlide = $(_.$slides.get(_.currentSlide));
							$currentSlide.attr("tabindex", 0).focus();
						}
					}
				}
			};
			Slick.prototype.prev = Slick.prototype.slickPrev = function () {
				var _ = this;
				_.changeSlide({ data: { message: "previous" } });
			};
			Slick.prototype.preventDefault = function (event) {
				event.preventDefault();
			};
			Slick.prototype.progressiveLazyLoad = function (tryCount) {
				tryCount = tryCount || 1;
				var _ = this,
					$imgsToLoad = $("img[data-lazy]", _.$slider),
					image,
					imageSource,
					imageSrcSet,
					imageSizes,
					imageToLoad;
				if ($imgsToLoad.length) {
					image = $imgsToLoad.first();
					imageSource = image.attr("data-lazy");
					imageSrcSet = image.attr("data-srcset");
					imageSizes = image.attr("data-sizes") || _.$slider.attr("data-sizes");
					imageToLoad = document.createElement("img");
					imageToLoad.onload = function () {
						if (imageSrcSet) {
							image.attr("srcset", imageSrcSet);
							if (imageSizes) {
								image.attr("sizes", imageSizes);
							}
						}
						image
							.attr("src", imageSource)
							.removeAttr("data-lazy data-srcset data-sizes")
							.removeClass("slick-loading");
						if (_.options.adaptiveHeight === true) {
							_.setPosition();
						}
						_.$slider.trigger("lazyLoaded", [_, image, imageSource]);
						_.progressiveLazyLoad();
					};
					imageToLoad.onerror = function () {
						if (tryCount < 3) {
							setTimeout(function () {
								_.progressiveLazyLoad(tryCount + 1);
							}, 500);
						} else {
							image
								.removeAttr("data-lazy")
								.removeClass("slick-loading")
								.addClass("slick-lazyload-error");
							_.$slider.trigger("lazyLoadError", [_, image, imageSource]);
							_.progressiveLazyLoad();
						}
					};
					imageToLoad.src = imageSource;
				} else {
					_.$slider.trigger("allImagesLoaded", [_]);
				}
			};
			Slick.prototype.refresh = function (initializing) {
				var _ = this,
					currentSlide,
					lastVisibleIndex;
				lastVisibleIndex = _.slideCount - _.options.slidesToShow;
				if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
					_.currentSlide = lastVisibleIndex;
				}
				if (_.slideCount <= _.options.slidesToShow) {
					_.currentSlide = 0;
				}
				currentSlide = _.currentSlide;
				_.destroy(true);
				$.extend(_, _.initials, { currentSlide: currentSlide });
				_.init();
				if (!initializing) {
					_.changeSlide(
						{ data: { message: "index", index: currentSlide } },
						false
					);
				}
			};
			Slick.prototype.registerBreakpoints = function () {
				var _ = this,
					breakpoint,
					currentBreakpoint,
					l,
					responsiveSettings = _.options.responsive || null;
				if (
					$.type(responsiveSettings) === "array" &&
					responsiveSettings.length
				) {
					_.respondTo = _.options.respondTo || "window";
					for (breakpoint in responsiveSettings) {
						l = _.breakpoints.length - 1;
						if (responsiveSettings.hasOwnProperty(breakpoint)) {
							currentBreakpoint = responsiveSettings[breakpoint].breakpoint;
							while (l >= 0) {
								if (
									_.breakpoints[l] &&
									_.breakpoints[l] === currentBreakpoint
								) {
									_.breakpoints.splice(l, 1);
								}
								l--;
							}
							_.breakpoints.push(currentBreakpoint);
							_.breakpointSettings[currentBreakpoint] =
								responsiveSettings[breakpoint].settings;
						}
					}
					_.breakpoints.sort(function (a, b) {
						return _.options.mobileFirst ? a - b : b - a;
					});
				}
			};
			Slick.prototype.reinit = function () {
				var _ = this;
				_.$slides = _.$slideTrack
					.children(_.options.slide)
					.addClass("slick-slide");
				_.slideCount = _.$slides.length;
				if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
					_.currentSlide = _.currentSlide - _.options.slidesToScroll;
				}
				if (_.slideCount <= _.options.slidesToShow) {
					_.currentSlide = 0;
				}
				_.registerBreakpoints();
				_.setProps();
				_.setupInfinite();
				_.buildArrows();
				_.updateArrows();
				_.initArrowEvents();
				_.buildDots();
				_.updateDots();
				_.initDotEvents();
				_.cleanUpSlideEvents();
				_.initSlideEvents();
				_.checkResponsive(false, true);
				if (_.options.focusOnSelect === true) {
					$(_.$slideTrack).children().on("click.slick", _.selectHandler);
				}
				_.setSlideClasses(
					typeof _.currentSlide === "number" ? _.currentSlide : 0
				);
				_.setPosition();
				_.focusHandler();
				_.paused = !_.options.autoplay;
				_.autoPlay();
				_.$slider.trigger("reInit", [_]);
			};
			Slick.prototype.resize = function () {
				var _ = this;
				if ($(window).width() !== _.windowWidth) {
					clearTimeout(_.windowDelay);
					_.windowDelay = window.setTimeout(function () {
						_.windowWidth = $(window).width();
						_.checkResponsive();
						if (!_.unslicked) {
							_.setPosition();
						}
					}, 50);
				}
			};
			Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (
				index,
				removeBefore,
				removeAll
			) {
				var _ = this;
				if (typeof index === "boolean") {
					removeBefore = index;
					index = removeBefore === true ? 0 : _.slideCount - 1;
				} else {
					index = removeBefore === true ? --index : index;
				}
				if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
					return false;
				}
				_.unload();
				if (removeAll === true) {
					_.$slideTrack.children().remove();
				} else {
					_.$slideTrack.children(this.options.slide).eq(index).remove();
				}
				_.$slides = _.$slideTrack.children(this.options.slide);
				_.$slideTrack.children(this.options.slide).detach();
				_.$slideTrack.append(_.$slides);
				_.$slidesCache = _.$slides;
				_.reinit();
			};
			Slick.prototype.setCSS = function (position) {
				var _ = this,
					positionProps = {},
					x,
					y;
				if (_.options.rtl === true) {
					position = -position;
				}
				x = _.positionProp == "left" ? Math.ceil(position) + "px" : "0px";
				y = _.positionProp == "top" ? Math.ceil(position) + "px" : "0px";
				positionProps[_.positionProp] = position;
				if (_.transformsEnabled === false) {
					_.$slideTrack.css(positionProps);
				} else {
					positionProps = {};
					if (_.cssTransitions === false) {
						positionProps[_.animType] = "translate(" + x + ", " + y + ")";
						_.$slideTrack.css(positionProps);
					} else {
						positionProps[_.animType] =
							"translate3d(" + x + ", " + y + ", 0px)";
						_.$slideTrack.css(positionProps);
					}
				}
			};
			Slick.prototype.setDimensions = function () {
				var _ = this;
				if (_.options.vertical === false) {
					if (_.options.centerMode === true) {
						_.$list.css({ padding: "0px " + _.options.centerPadding });
					}
				} else {
					_.$list.height(
						_.$slides.first().outerHeight(true) * _.options.slidesToShow
					);
					if (_.options.centerMode === true) {
						_.$list.css({ padding: _.options.centerPadding + " 0px" });
					}
				}
				_.listWidth = _.$list.width();
				_.listHeight = _.$list.height();
				if (_.options.vertical === false && _.options.variableWidth === false) {
					_.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
					_.$slideTrack.width(
						Math.ceil(
							_.slideWidth * _.$slideTrack.children(".slick-slide").length
						)
					);
				} else if (_.options.variableWidth === true) {
					_.$slideTrack.width(5e3 * _.slideCount);
				} else {
					_.slideWidth = Math.ceil(_.listWidth);
					_.$slideTrack.height(
						Math.ceil(
							_.$slides.first().outerHeight(true) *
								_.$slideTrack.children(".slick-slide").length
						)
					);
				}
				var offset =
					_.$slides.first().outerWidth(true) - _.$slides.first().width();
				if (_.options.variableWidth === false)
					_.$slideTrack.children(".slick-slide").width(_.slideWidth - offset);
			};
			Slick.prototype.setFade = function () {
				var _ = this,
					targetLeft;
				_.$slides.each(function (index, element) {
					targetLeft = _.slideWidth * index * -1;
					if (_.options.rtl === true) {
						$(element).css({
							position: "relative",
							right: targetLeft,
							top: 0,
							zIndex: _.options.zIndex - 2,
							opacity: 0,
						});
					} else {
						$(element).css({
							position: "relative",
							left: targetLeft,
							top: 0,
							zIndex: _.options.zIndex - 2,
							opacity: 0,
						});
					}
				});
				_.$slides
					.eq(_.currentSlide)
					.css({ zIndex: _.options.zIndex - 1, opacity: 1 });
			};
			Slick.prototype.setHeight = function () {
				var _ = this;
				if (
					_.options.slidesToShow === 1 &&
					_.options.adaptiveHeight === true &&
					_.options.vertical === false
				) {
					var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
					_.$list.css("height", targetHeight);
				}
			};
			Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {
				var _ = this,
					l,
					item,
					option,
					value,
					refresh = false,
					type;
				if ($.type(arguments[0]) === "object") {
					option = arguments[0];
					refresh = arguments[1];
					type = "multiple";
				} else if ($.type(arguments[0]) === "string") {
					option = arguments[0];
					value = arguments[1];
					refresh = arguments[2];
					if (
						arguments[0] === "responsive" &&
						$.type(arguments[1]) === "array"
					) {
						type = "responsive";
					} else if (typeof arguments[1] !== "undefined") {
						type = "single";
					}
				}
				if (type === "single") {
					_.options[option] = value;
				} else if (type === "multiple") {
					$.each(option, function (opt, val) {
						_.options[opt] = val;
					});
				} else if (type === "responsive") {
					for (item in value) {
						if ($.type(_.options.responsive) !== "array") {
							_.options.responsive = [value[item]];
						} else {
							l = _.options.responsive.length - 1;
							while (l >= 0) {
								if (
									_.options.responsive[l].breakpoint === value[item].breakpoint
								) {
									_.options.responsive.splice(l, 1);
								}
								l--;
							}
							_.options.responsive.push(value[item]);
						}
					}
				}
				if (refresh) {
					_.unload();
					_.reinit();
				}
			};
			Slick.prototype.setPosition = function () {
				var _ = this;
				_.setDimensions();
				_.setHeight();
				if (_.options.fade === false) {
					_.setCSS(_.getLeft(_.currentSlide));
				} else {
					_.setFade();
				}
				_.$slider.trigger("setPosition", [_]);
			};
			Slick.prototype.setProps = function () {
				var _ = this,
					bodyStyle = document.body.style;
				_.positionProp = _.options.vertical === true ? "top" : "left";
				if (_.positionProp === "top") {
					_.$slider.addClass("slick-vertical");
				} else {
					_.$slider.removeClass("slick-vertical");
				}
				if (
					bodyStyle.WebkitTransition !== undefined ||
					bodyStyle.MozTransition !== undefined ||
					bodyStyle.msTransition !== undefined
				) {
					if (_.options.useCSS === true) {
						_.cssTransitions = true;
					}
				}
				if (_.options.fade) {
					if (typeof _.options.zIndex === "number") {
						if (_.options.zIndex < 3) {
							_.options.zIndex = 3;
						}
					} else {
						_.options.zIndex = _.defaults.zIndex;
					}
				}
				if (bodyStyle.OTransform !== undefined) {
					_.animType = "OTransform";
					_.transformType = "-o-transform";
					_.transitionType = "OTransition";
					if (
						bodyStyle.perspectiveProperty === undefined &&
						bodyStyle.webkitPerspective === undefined
					)
						_.animType = false;
				}
				if (bodyStyle.MozTransform !== undefined) {
					_.animType = "MozTransform";
					_.transformType = "-moz-transform";
					_.transitionType = "MozTransition";
					if (
						bodyStyle.perspectiveProperty === undefined &&
						bodyStyle.MozPerspective === undefined
					)
						_.animType = false;
				}
				if (bodyStyle.webkitTransform !== undefined) {
					_.animType = "webkitTransform";
					_.transformType = "-webkit-transform";
					_.transitionType = "webkitTransition";
					if (
						bodyStyle.perspectiveProperty === undefined &&
						bodyStyle.webkitPerspective === undefined
					)
						_.animType = false;
				}
				if (bodyStyle.msTransform !== undefined) {
					_.animType = "msTransform";
					_.transformType = "-ms-transform";
					_.transitionType = "msTransition";
					if (bodyStyle.msTransform === undefined) _.animType = false;
				}
				if (bodyStyle.transform !== undefined && _.animType !== false) {
					_.animType = "transform";
					_.transformType = "transform";
					_.transitionType = "transition";
				}
				_.transformsEnabled =
					_.options.useTransform && _.animType !== null && _.animType !== false;
			};
			Slick.prototype.setSlideClasses = function (index) {
				var _ = this,
					centerOffset,
					allSlides,
					indexOffset,
					remainder;
				allSlides = _.$slider
					.find(".slick-slide")
					.removeClass("slick-active slick-center slick-current")
					.attr("aria-hidden", "true");
				_.$slides.eq(index).addClass("slick-current");
				if (_.options.centerMode === true) {
					var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;
					centerOffset = Math.floor(_.options.slidesToShow / 2);
					if (_.options.infinite === true) {
						if (
							index >= centerOffset &&
							index <= _.slideCount - 1 - centerOffset
						) {
							_.$slides
								.slice(
									index - centerOffset + evenCoef,
									index + centerOffset + 1
								)
								.addClass("slick-active")
								.attr("aria-hidden", "false");
						} else {
							indexOffset = _.options.slidesToShow + index;
							allSlides
								.slice(
									indexOffset - centerOffset + 1 + evenCoef,
									indexOffset + centerOffset + 2
								)
								.addClass("slick-active")
								.attr("aria-hidden", "false");
						}
						if (index === 0) {
							allSlides
								.eq(allSlides.length - 1 - _.options.slidesToShow)
								.addClass("slick-center");
						} else if (index === _.slideCount - 1) {
							allSlides.eq(_.options.slidesToShow).addClass("slick-center");
						}
					}
					_.$slides.eq(index).addClass("slick-center");
				} else {
					if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {
						_.$slides
							.slice(index, index + _.options.slidesToShow)
							.addClass("slick-active")
							.attr("aria-hidden", "false");
					} else if (allSlides.length <= _.options.slidesToShow) {
						allSlides.addClass("slick-active").attr("aria-hidden", "false");
					} else {
						remainder = _.slideCount % _.options.slidesToShow;
						indexOffset =
							_.options.infinite === true
								? _.options.slidesToShow + index
								: index;
						if (
							_.options.slidesToShow == _.options.slidesToScroll &&
							_.slideCount - index < _.options.slidesToShow
						) {
							allSlides
								.slice(
									indexOffset - (_.options.slidesToShow - remainder),
									indexOffset + remainder
								)
								.addClass("slick-active")
								.attr("aria-hidden", "false");
						} else {
							allSlides
								.slice(indexOffset, indexOffset + _.options.slidesToShow)
								.addClass("slick-active")
								.attr("aria-hidden", "false");
						}
					}
				}
				if (
					_.options.lazyLoad === "ondemand" ||
					_.options.lazyLoad === "anticipated"
				) {
					_.lazyLoad();
				}
			};
			Slick.prototype.setupInfinite = function () {
				var _ = this,
					i,
					slideIndex,
					infiniteCount;
				if (_.options.fade === true) {
					_.options.centerMode = false;
				}
				if (_.options.infinite === true && _.options.fade === false) {
					slideIndex = null;
					if (_.slideCount > _.options.slidesToShow) {
						if (_.options.centerMode === true) {
							infiniteCount = _.options.slidesToShow + 1;
						} else {
							infiniteCount = _.options.slidesToShow;
						}
						for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
							slideIndex = i - 1;
							$(_.$slides[slideIndex])
								.clone(true)
								.attr("id", "")
								.attr("data-slick-index", slideIndex - _.slideCount)
								.prependTo(_.$slideTrack)
								.addClass("slick-cloned");
						}
						for (i = 0; i < infiniteCount + _.slideCount; i += 1) {
							slideIndex = i;
							$(_.$slides[slideIndex])
								.clone(true)
								.attr("id", "")
								.attr("data-slick-index", slideIndex + _.slideCount)
								.appendTo(_.$slideTrack)
								.addClass("slick-cloned");
						}
						_.$slideTrack
							.find(".slick-cloned")
							.find("[id]")
							.each(function () {
								$(this).attr("id", "");
							});
					}
				}
			};
			Slick.prototype.interrupt = function (toggle) {
				var _ = this;
				if (!toggle) {
					_.autoPlay();
				}
				_.interrupted = toggle;
			};
			Slick.prototype.selectHandler = function (event) {
				var _ = this;
				var targetElement = $(event.target).is(".slick-slide")
					? $(event.target)
					: $(event.target).parents(".slick-slide");
				var index = parseInt(targetElement.attr("data-slick-index"));
				if (!index) index = 0;
				if (_.slideCount <= _.options.slidesToShow) {
					_.slideHandler(index, false, true);
					return;
				}
				_.slideHandler(index);
			};
			Slick.prototype.slideHandler = function (index, sync, dontAnimate) {
				var targetSlide,
					animSlide,
					oldSlide,
					slideLeft,
					targetLeft = null,
					_ = this,
					navTarget;
				sync = sync || false;
				if (_.animating === true && _.options.waitForAnimate === true) {
					return;
				}
				if (_.options.fade === true && _.currentSlide === index) {
					return;
				}
				if (sync === false) {
					_.asNavFor(index);
				}
				targetSlide = index;
				targetLeft = _.getLeft(targetSlide);
				slideLeft = _.getLeft(_.currentSlide);
				_.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;
				if (
					_.options.infinite === false &&
					_.options.centerMode === false &&
					(index < 0 || index > _.getDotCount() * _.options.slidesToScroll)
				) {
					if (_.options.fade === false) {
						targetSlide = _.currentSlide;
						if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
							_.animateSlide(slideLeft, function () {
								_.postSlide(targetSlide);
							});
						} else {
							_.postSlide(targetSlide);
						}
					}
					return;
				} else if (
					_.options.infinite === false &&
					_.options.centerMode === true &&
					(index < 0 || index > _.slideCount - _.options.slidesToScroll)
				) {
					if (_.options.fade === false) {
						targetSlide = _.currentSlide;
						if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
							_.animateSlide(slideLeft, function () {
								_.postSlide(targetSlide);
							});
						} else {
							_.postSlide(targetSlide);
						}
					}
					return;
				}
				if (_.options.autoplay) {
					clearInterval(_.autoPlayTimer);
				}
				if (targetSlide < 0) {
					if (_.slideCount % _.options.slidesToScroll !== 0) {
						animSlide =
							_.slideCount - (_.slideCount % _.options.slidesToScroll);
					} else {
						animSlide = _.slideCount + targetSlide;
					}
				} else if (targetSlide >= _.slideCount) {
					if (_.slideCount % _.options.slidesToScroll !== 0) {
						animSlide = 0;
					} else {
						animSlide = targetSlide - _.slideCount;
					}
				} else {
					animSlide = targetSlide;
				}
				_.animating = true;
				_.$slider.trigger("beforeChange", [_, _.currentSlide, animSlide]);
				oldSlide = _.currentSlide;
				_.currentSlide = animSlide;
				_.setSlideClasses(_.currentSlide);
				if (_.options.asNavFor) {
					navTarget = _.getNavTarget();
					navTarget = navTarget.slick("getSlick");
					if (navTarget.slideCount <= navTarget.options.slidesToShow) {
						navTarget.setSlideClasses(_.currentSlide);
					}
				}
				_.updateDots();
				_.updateArrows();
				if (_.options.fade === true) {
					if (dontAnimate !== true) {
						_.fadeSlideOut(oldSlide);
						_.fadeSlide(animSlide, function () {
							_.postSlide(animSlide);
						});
					} else {
						_.postSlide(animSlide);
					}
					_.animateHeight();
					return;
				}
				if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
					_.animateSlide(targetLeft, function () {
						_.postSlide(animSlide);
					});
				} else {
					_.postSlide(animSlide);
				}
			};
			Slick.prototype.startLoad = function () {
				var _ = this;
				if (
					_.options.arrows === true &&
					_.slideCount > _.options.slidesToShow
				) {
					_.$prevArrow.hide();
					_.$nextArrow.hide();
				}
				if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
					_.$dots.hide();
				}
				_.$slider.addClass("slick-loading");
			};
			Slick.prototype.swipeDirection = function () {
				var xDist,
					yDist,
					r,
					swipeAngle,
					_ = this;
				xDist = _.touchObject.startX - _.touchObject.curX;
				yDist = _.touchObject.startY - _.touchObject.curY;
				r = Math.atan2(yDist, xDist);
				swipeAngle = Math.round((r * 180) / Math.PI);
				if (swipeAngle < 0) {
					swipeAngle = 360 - Math.abs(swipeAngle);
				}
				if (swipeAngle <= 45 && swipeAngle >= 0) {
					return _.options.rtl === false ? "left" : "right";
				}
				if (swipeAngle <= 360 && swipeAngle >= 315) {
					return _.options.rtl === false ? "left" : "right";
				}
				if (swipeAngle >= 135 && swipeAngle <= 225) {
					return _.options.rtl === false ? "right" : "left";
				}
				if (_.options.verticalSwiping === true) {
					if (swipeAngle >= 35 && swipeAngle <= 135) {
						return "down";
					} else {
						return "up";
					}
				}
				return "vertical";
			};
			Slick.prototype.swipeEnd = function (event) {
				var _ = this,
					slideCount,
					direction;
				_.dragging = false;
				_.swiping = false;
				if (_.scrolling) {
					_.scrolling = false;
					return false;
				}
				_.interrupted = false;
				_.shouldClick = _.touchObject.swipeLength > 10 ? false : true;
				if (_.touchObject.curX === undefined) {
					return false;
				}
				if (_.touchObject.edgeHit === true) {
					_.$slider.trigger("edge", [_, _.swipeDirection()]);
				}
				if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
					direction = _.swipeDirection();
					switch (direction) {
						case "left":
						case "down":
							slideCount = _.options.swipeToSlide
								? _.checkNavigable(_.currentSlide + _.getSlideCount())
								: _.currentSlide + _.getSlideCount();
							_.currentDirection = 0;
							break;
						case "right":
						case "up":
							slideCount = _.options.swipeToSlide
								? _.checkNavigable(_.currentSlide - _.getSlideCount())
								: _.currentSlide - _.getSlideCount();
							_.currentDirection = 1;
							break;
						default:
					}
					if (direction != "vertical") {
						_.slideHandler(slideCount);
						_.touchObject = {};
						_.$slider.trigger("swipe", [_, direction]);
					}
				} else {
					if (_.touchObject.startX !== _.touchObject.curX) {
						_.slideHandler(_.currentSlide);
						_.touchObject = {};
					}
				}
			};
			Slick.prototype.swipeHandler = function (event) {
				var _ = this;
				if (
					_.options.swipe === false ||
					("ontouchend" in document && _.options.swipe === false)
				) {
					return;
				} else if (
					_.options.draggable === false &&
					event.type.indexOf("mouse") !== -1
				) {
					return;
				}
				_.touchObject.fingerCount =
					event.originalEvent && event.originalEvent.touches !== undefined
						? event.originalEvent.touches.length
						: 1;
				_.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;
				if (_.options.verticalSwiping === true) {
					_.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
				}
				switch (event.data.action) {
					case "start":
						_.swipeStart(event);
						break;
					case "move":
						_.swipeMove(event);
						break;
					case "end":
						_.swipeEnd(event);
						break;
				}
			};
			Slick.prototype.swipeMove = function (event) {
				var _ = this,
					edgeWasHit = false,
					curLeft,
					swipeDirection,
					swipeLength,
					positionOffset,
					touches,
					verticalSwipeLength;
				touches =
					event.originalEvent !== undefined
						? event.originalEvent.touches
						: null;
				if (!_.dragging || _.scrolling || (touches && touches.length !== 1)) {
					return false;
				}
				curLeft = _.getLeft(_.currentSlide);
				_.touchObject.curX =
					touches !== undefined ? touches[0].pageX : event.clientX;
				_.touchObject.curY =
					touches !== undefined ? touches[0].pageY : event.clientY;
				_.touchObject.swipeLength = Math.round(
					Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2))
				);
				verticalSwipeLength = Math.round(
					Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2))
				);
				if (
					!_.options.verticalSwiping &&
					!_.swiping &&
					verticalSwipeLength > 4
				) {
					_.scrolling = true;
					return false;
				}
				if (_.options.verticalSwiping === true) {
					_.touchObject.swipeLength = verticalSwipeLength;
				}
				swipeDirection = _.swipeDirection();
				if (
					event.originalEvent !== undefined &&
					_.touchObject.swipeLength > 4
				) {
					_.swiping = true;
					event.preventDefault();
				}
				positionOffset =
					(_.options.rtl === false ? 1 : -1) *
					(_.touchObject.curX > _.touchObject.startX ? 1 : -1);
				if (_.options.verticalSwiping === true) {
					positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
				}
				swipeLength = _.touchObject.swipeLength;
				_.touchObject.edgeHit = false;
				if (_.options.infinite === false) {
					if (
						(_.currentSlide === 0 && swipeDirection === "right") ||
						(_.currentSlide >= _.getDotCount() && swipeDirection === "left")
					) {
						swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
						_.touchObject.edgeHit = true;
					}
				}
				if (_.options.vertical === false) {
					_.swipeLeft = curLeft + swipeLength * positionOffset;
				} else {
					_.swipeLeft =
						curLeft +
						swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
				}
				if (_.options.verticalSwiping === true) {
					_.swipeLeft = curLeft + swipeLength * positionOffset;
				}
				if (_.options.fade === true || _.options.touchMove === false) {
					return false;
				}
				if (_.animating === true) {
					_.swipeLeft = null;
					return false;
				}
				_.setCSS(_.swipeLeft);
			};
			Slick.prototype.swipeStart = function (event) {
				var _ = this,
					touches;
				_.interrupted = true;
				if (
					_.touchObject.fingerCount !== 1 ||
					_.slideCount <= _.options.slidesToShow
				) {
					_.touchObject = {};
					return false;
				}
				if (
					event.originalEvent !== undefined &&
					event.originalEvent.touches !== undefined
				) {
					touches = event.originalEvent.touches[0];
				}
				_.touchObject.startX = _.touchObject.curX =
					touches !== undefined ? touches.pageX : event.clientX;
				_.touchObject.startY = _.touchObject.curY =
					touches !== undefined ? touches.pageY : event.clientY;
				_.dragging = true;
			};
			Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter =
				function () {
					var _ = this;
					if (_.$slidesCache !== null) {
						_.unload();
						_.$slideTrack.children(this.options.slide).detach();
						_.$slidesCache.appendTo(_.$slideTrack);
						_.reinit();
					}
				};
			Slick.prototype.unload = function () {
				var _ = this;
				$(".slick-cloned", _.$slider).remove();
				if (_.$dots) {
					_.$dots.remove();
				}
				if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
					_.$prevArrow.remove();
				}
				if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
					_.$nextArrow.remove();
				}
				_.$slides
					.removeClass("slick-slide slick-active slick-visible slick-current")
					.attr("aria-hidden", "true")
					.css("width", "");
			};
			Slick.prototype.unslick = function (fromBreakpoint) {
				var _ = this;
				_.$slider.trigger("unslick", [_, fromBreakpoint]);
				_.destroy();
			};
			Slick.prototype.updateArrows = function () {
				var _ = this,
					centerOffset;
				centerOffset = Math.floor(_.options.slidesToShow / 2);
				if (
					_.options.arrows === true &&
					_.slideCount > _.options.slidesToShow &&
					!_.options.infinite
				) {
					_.$prevArrow
						.removeClass("slick-disabled")
						.attr("aria-disabled", "false");
					_.$nextArrow
						.removeClass("slick-disabled")
						.attr("aria-disabled", "false");
					if (_.currentSlide === 0) {
						_.$prevArrow
							.addClass("slick-disabled")
							.attr("aria-disabled", "true");
						_.$nextArrow
							.removeClass("slick-disabled")
							.attr("aria-disabled", "false");
					} else if (
						_.currentSlide >= _.slideCount - _.options.slidesToShow &&
						_.options.centerMode === false
					) {
						_.$nextArrow
							.addClass("slick-disabled")
							.attr("aria-disabled", "true");
						_.$prevArrow
							.removeClass("slick-disabled")
							.attr("aria-disabled", "false");
					} else if (
						_.currentSlide >= _.slideCount - 1 &&
						_.options.centerMode === true
					) {
						_.$nextArrow
							.addClass("slick-disabled")
							.attr("aria-disabled", "true");
						_.$prevArrow
							.removeClass("slick-disabled")
							.attr("aria-disabled", "false");
					}
				}
			};
			Slick.prototype.updateDots = function () {
				var _ = this;
				if (_.$dots !== null) {
					_.$dots.find("li").removeClass("slick-active").end();
					_.$dots
						.find("li")
						.eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
						.addClass("slick-active");
				}
			};
			Slick.prototype.visibility = function () {
				var _ = this;
				if (_.options.autoplay) {
					if (document[_.hidden]) {
						_.interrupted = true;
					} else {
						_.interrupted = false;
					}
				}
			};
			$.fn.slick = function () {
				var _ = this,
					opt = arguments[0],
					args = Array.prototype.slice.call(arguments, 1),
					l = _.length,
					i,
					ret;
				for (i = 0; i < l; i++) {
					if (typeof opt == "object" || typeof opt == "undefined")
						_[i].slick = new Slick(_[i], opt);
					else ret = _[i].slick[opt].apply(_[i].slick, args);
					if (typeof ret != "undefined") return ret;
				}
				return _;
			};
		});

		var Slider = function () {
			let $block = $(".Slider").not(".Slider_carousel").not(".Slider_likes"),
				$likes = $(".Slider_likes .Slider-box"),
				$container = $block.children(".Slider-box"),
				$carousel = $(".Slider_carousel"),
				$containerCar = $carousel.children(".Slider-box");
			return {
				init: function () {
					$carousel.addClass("slick_carousel");
					$block.addClass("slick_slider");
					$container.each(function () {
						var $this = $(this);
						var $navigate = $this.closest($block).find(".Slider-navigate");
						if ($this.closest($block).hasClass("Slider_product")) {
							$this.slick({
								dots: true,
								arrows: false,
								autoplay: false,
								infinite: false,
								prevArrow: $navigate.find(".Slider-prev"),
								nextArrow: $navigate.find(".Slider-next"),
								appendArrows: $navigate,
								appendDots: $navigate,
								mobileFirst: true,
								dotsClass: "slick-dots Slider-pagination",
								fade: false,
								variableWidth: true,
								customPaging: function (slick, index) {
									var targetImage = slick.$slides
										.eq(index)
										.find(".Slider-item")
										.attr("data-page-img");
									return (
										'<button class="Slider-pagButton"><img src=" ' +
										targetImage +
										' " alt="Изображение товара ' +
										targetImage.replace(
											/.*([^\/\\]+)\.(webp|jpg|png).*/,
											"$1"
										) +
										'" /></button>'
									);
								},
								autoplaySpeed: 3000,
								responsive: [
									{
										breakpoint: 1025,
										settings: {
											fade: true,
											variableWidth: false,
										},
									},
								],
							});
						} else {
							$this.slick({
								dots: true,
								arrows: true,
								autoplay: true,
								infinite: false,
								prevArrow: $navigate.find(".Slider-prev"),
								nextArrow: $navigate.find(".Slider-next"),
								appendArrows: $navigate,
								dotsClass: "slick-dots Slider-pagination",
								appendDots: $navigate,
								mobileFirst: true,
								initialSlide: 0,
								fade: true,
								autoplaySpeed: 3000,
								adaptiveHeight: true,
								responsive: [
									{
										breakpoint: 1025,
										settings: {
											adaptiveHeight: false,
										},
									},
								],
							});

							let $navigateDots = $navigate.find(".slick-dots li");
							let $active = $navigateDots.filter(".slick-active");
							$navigateDots.removeClass("Slider-middleDots");
							$active.next("li").addClass("Slider-middleDots");
							$active.prev("li").addClass("Slider-middleDots");

							$navigate
								.find(".slick-dots li")
								.slice(0, 5)
								.addClass("Slider-visibleDot");
							$navigate
								.find(".slick-dots li")
								.eq(0)
								.addClass("Slider-visibleDot_cur");
							$navigate
								.find(".slick-dots li")
								.slice(1, 5)
								.addClass("Slider-visibleDot_right");

							if ($this.closest($block).is(".Slider_main")) {
								$this
									.find(".Slider-pict")
									.append('<div class="Slider-pictBg"></div>');
								let $slideActive = $this.find(".slick-slide.slick-active");
								$slideActive
									.find(".Slider-pictBg")
									.attr(
										"style",
										$slideActive.find(".Slider-pict").attr("data-style")
									);
							}
							$this.on("beforeChange", function (e, sld, cur, next) {
								let $navigateDots = $navigate.find(".slick-dots li");
								let $navigateDotsVisible =
									$navigateDots.filter(".Slider-visibleDot");
								let $active = $navigateDots.eq(next);
								let $activeSlide = $this.find(".Slider-item").eq(next);
								let $prevSlide = $this.find(".Slider-item").eq(cur);
								let $activePict = $activeSlide.find(".Slider-pictBg");
								$prevSlide
									.find(".Slider-pictBg")
									.removeClass("Slider-pictBg_go")
									.attr("style", "");
								$activePict.attr(
									"style",
									$prevSlide.find(".Slider-pict").attr("data-style")
								);
								setTimeout(function () {
									$activePict.addClass("Slider-pictBg_go");
									$activePict.attr(
										"style",
										$activeSlide.find(".Slider-pict").attr("data-style")
									);
								}, 50);
								$activePict.on("transitionend", function (e) {
									$activePict.removeClass("Slider-pictBg_go");
								});
								$navigateDots.removeClass("Slider-middleDots");
								$active.next("li").addClass("Slider-middleDots");
								$active.prev("li").addClass("Slider-middleDots");
								if ($navigateDotsVisible.index($active) > 2) {
									let $nextVisible = $navigateDots.filter(
										$navigateDotsVisible.last().next()
									);
									if ($nextVisible.length) {
										$nextVisible.addClass("Slider-visibleDot");
										$navigateDotsVisible.eq(0).removeClass("Slider-visibleDot");
									}
								}
								if ($navigateDotsVisible.index($active) < 2) {
									let $nextVisible = $navigateDots.filter(
										$navigateDotsVisible.first().prev()
									);
									if ($nextVisible.length) {
										$nextVisible.addClass("Slider-visibleDot");
										$navigateDotsVisible.eq(4).removeClass("Slider-visibleDot");
									}
								}
								$navigateDots.removeClass(
									"Slider-visibleDot_cur Slider-visibleDot_right Slider-visibleDot_left"
								);
								$active.addClass("Slider-visibleDot_cur");
								$active.nextAll("li").addClass("Slider-visibleDot_right");
								$active.prevAll("li").addClass("Slider-visibleDot_left");
							});
						}
					});
					function sliderMobileOnly() {
						//Образец реализицаии функции для формирования слайдера только в определённом разрешении
						$likes.each(function () {
							var $this = $(this);
							var $navigate = $this.closest($block).find(".Slider-navigate");
							if ($(window).width() < 1025 && !$this.hasClass("slick-slider")) {
								$this.slick({
									dots: false,
									arrows: false,
									autoplay: false,
									appendDots: $navigate,
									adaptiveHeight: true,
									mobileFirst: true,
									infinite: false,
									slidesToShow: 1,
									variableWidth: true,
									autoplaySpeed: 5000,
								});
							}
							if ($(window).width() >= 1025 && $this.hasClass("slick-slider")) {
								$this.slick("unslick");
							}
						});
					}
					sliderMobileOnly();
					$(window).on("resize", sliderMobileOnly);

					$containerCar.each(function () {
						var $this = $(this);
						var $navigate = $this.closest($carousel).find(".Slider-navigate");
						var $parent = $this.closest(".Slider");
						if ($this.hasClass("Cards")) {
							$this.slick({
								appendArrows: $navigate,
								appendDots: $navigate,
								dots: false,
								arrows: true,
								slidesToShow: 4,
								infinite: false,
								variableWidth: true,
								slidesToScroll: 1,
								mobileFirst: true,
								responsive: [
									{
										breakpoint: 990,
										settings: {
											slidesToShow: 3,
											slidesToScroll: 1,
										},
									},
									{
										breakpoint: 480,
										settings: {
											slidesToShow: 2,
											slidesToScroll: 1,
										},
									},
								],
							});
						} else {
							$this.slick({
								appendArrows: $navigate,
								appendDots: $navigate,
								prevArrow: $parent.find(".Slider-prev"),
								nextArrow: $parent.find(".Slider-next"),
								dots: true,
								arrows: true,
								swipeToSlide: true,
								slidesToShow: 1,
								infinite: false,
								slidesToScroll: 1,
								mobileFirst: true,
								variableWidth: true,
								centerMode: false,
								responsive: [
									{
										breakpoint: 1600,
										settings: {
											slidesToShow: 4,
										},
									},
									{
										breakpoint: 1025,
										settings: {
											slidesToShow: 3,
										},
									},
									{
										breakpoint: 480,
										settings: {
											slidesToShow: 2,
										},
									},
								],
							});
						}
					});
				},
			};
		};
		Slider().init();

		var Spoiler = function () {
			var $HideBlock = $(".Spoiler");
			var $trigger = $HideBlock.find(".Spoiler-trigger");
			$HideBlock.addClass("Spoiler_CLOSE");
			return {
				init: function () {
					$trigger.on("click", function (e) {
						e.preventDefault();
						var $this = $(this);
						var scroll = $(window).scrollTop();
						var $parent = $this.closest($HideBlock);
						if ($parent.hasClass("Spoiler_CLOSE")) {
							$parent.removeClass("Spoiler_CLOSE");
							$(window).scrollTop(scroll);
						} else {
							$parent.addClass("Spoiler_CLOSE");
							$(window).scrollTop(scroll);
						}
					});
				},
			};
		};
		Spoiler().init();

		var Tags = function () {
			return {
				init: function () {},
			};
		};
		Tags().init();
	});
})(jQuery);
