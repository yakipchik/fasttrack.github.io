document.addEventListener("DOMContentLoaded", () => {
	gsap.registerPlugin(ScrollToPlugin);

	let disableScroll = function () {
		let sizeScrollbar =
			window.innerWidth - document.documentElement.clientWidth;
		let pagePosition = window.scrollY;
		document.body.classList.add("disable-scroll");
		document.body.dataset.position = pagePosition;
		document.body.style.top = -pagePosition + "px";
		document.body.style.paddingRight = sizeScrollbar + "px";
	};

	let enableScroll = function () {
		let pagePosition = parseInt(document.body.dataset.position, 10);
		document.body.style.top = "auto";
		document.body.classList.remove("disable-scroll");
		window.scroll({ top: pagePosition, left: 0 });
		document.body.removeAttribute("data-position");
		document.body.style.paddingRight = 0;
	};

	document.querySelectorAll(".btn-scroll__form").forEach((btn) => {
		btn.addEventListener("click", () => {
			let offHeader = 0;
			if (window.innerWidth <= 450) {
				offHeader = 90;
			}
			document.querySelector(".header-popup").classList.remove("open");
			enableScroll();
			gsap.to(window, {
				duration: 2,
				scrollTo: { y: ".contacts-form", offsetY: offHeader, autoKill: true },
				ease: "power2",
			});
		});
	});

	document.querySelectorAll(".burger").forEach((btn) => {
		btn.addEventListener("click", () => {
			if (btn.classList.contains("open")) {
				document.querySelector(".header-popup").classList.remove("open");
				enableScroll();
			} else {
				document.querySelector(".header-popup").classList.add("open");
				disableScroll();
			}
		});
	});
	document.querySelector(".header-popup").addEventListener("click", (e) => {
		if (e.target.classList.contains("header-popup")) {
			document.querySelector(".header-popup").classList.remove("open");
			enableScroll();
		}
	});

	if (document.querySelector(".gallery-swiper")) {
		let gallery = new Swiper(".gallery-swiper", {
			slidesPerView: "auto",
			breakpoints: {
				0: {
					spaceBetween: 10,
				},
				576: {
					spaceBetween: 40,
				},
			},
			navigation: {
				nextEl: ".gallery-btn__next",
				prevEl: ".gallery-btn__prev",
			},
		});

		let galleryPopup = new Swiper(".gallery-popup__swiper", {
			slidesPerView: 1,
			spaceBetween: 10,
			navigation: {
				nextEl: ".gallery-popup__btn-next",
				prevEl: ".gallery-popup__btn-prev",
			},
			observer: true,
			observeParents: true,
			observeSlideChildren: true,
		});
		document
			.querySelectorAll(".gallery-swiper__slide")
			.forEach((slide, index) => {
				slide.addEventListener("click", () => {
					galleryPopup.slideTo(index);
					document.querySelector(".gallery-popup").classList.add("open");
					disableScroll();
				});
			});
		document.querySelector(".gallery-popup").addEventListener("click", (e) => {
			const elem = e.target;
			if (
				elem.classList.contains("gallery-popup__close") ||
				elem.classList.contains("gallery-popup") ||
				elem.classList.contains("gallery-popup__body")
			) {
				document.querySelector(".gallery-popup").classList.remove("open");
				enableScroll();
			}
		});

		window.addEventListener("resize", () => {
			let cap = document.querySelector(".gallery-cap");
			let btns = document.querySelector(".gallery-btns");
			let gall = document.querySelector(".gallery-swiper");
			if (window.innerWidth <= 576) {
				document
					.querySelector(".gallery")
					.insertBefore(btns, gall.nextElementSibling);
			} else {
				cap.appendChild(btns);
			}
		});
	}

	var phoneInputs = document.querySelectorAll("input[data-tel-input]");
	var getInputNumbersValue = function (input) {
		return input.value.replace(/\D/g, "");
	};
	var onPhonePaste = function (e) {
		var input = e.target,
			inputNumbersValue = getInputNumbersValue(input);
		var pasted = e.clipboardData || window.clipboardData;
		if (pasted) {
			var pastedText = pasted.getData("Text");
			if (/\D/g.test(pastedText)) {
				input.value = inputNumbersValue;
				return;
			}
		}
	};
	var onPhoneInput = function (e) {
		var input = e.target,
			inputNumbersValue = getInputNumbersValue(input),
			selectionStart = input.selectionStart,
			formattedInputValue = "";

		if (!inputNumbersValue) {
			return (input.value = "");
		}
		if (input.value.length != selectionStart) {
			if (e.data && /\D/g.test(e.data)) {
				input.value = inputNumbersValue;
			}
			return;
		}
		if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
			if (inputNumbersValue[0] == "9")
				inputNumbersValue = "7" + inputNumbersValue;
			var firstSymbols = inputNumbersValue[0] == "8" ? "8" : "+7";
			formattedInputValue = input.value = firstSymbols + " ";
			if (inputNumbersValue.length > 1) {
				formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
			}
			if (inputNumbersValue.length >= 5) {
				formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
			}
			if (inputNumbersValue.length >= 8) {
				formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
			}
			if (inputNumbersValue.length >= 10) {
				formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
			}
		} else {
			formattedInputValue = "+" + inputNumbersValue.substring(0, 16);
		}
		input.value = formattedInputValue;
	};
	var onPhoneKeyDown = function (e) {
		var inputValue = e.target.value.replace(/\D/g, "");
		if (e.keyCode == 8 && inputValue.length == 1) {
			e.target.value = "";
		}
	};
	for (var phoneInput of phoneInputs) {
		phoneInput.addEventListener("keydown", onPhoneKeyDown);
		phoneInput.addEventListener("input", onPhoneInput, false);
		phoneInput.addEventListener("paste", onPhonePaste, false);
	}

	// Отправка формы
	function send(event, php) {
		event.preventDefault ? event.preventDefault() : (event.returnValue = false);
		var req = new XMLHttpRequest();
		req.open("POST", php, true);
		req.onload = function () {
			if (req.status >= 200 && req.status < 400) {
				json = JSON.parse(this.response);
				if (json.result == "success") {
					event.reset();
					document.querySelector(".success-popup").classList.add("open");
					event.querySelector("button").disabled = false;
				} else {
					alert("Ошибка. Сообщение не отправлено");
					event.querySelector("button").disabled = false;
				}
			} else {
				alert("Ошибка сервера. Повторите отправку");
				event.querySelector("button").disabled = false;
			}
		};
		req.onerror = function () {
			alert("Ошибка отправки запроса");
			event.querySelector("button").disabled = false;
		};
		req.send(new FormData(event));
	}

	let forms = document.querySelectorAll("form");
	if (forms) {
		forms.forEach((form) => {
			form.addEventListener("submit", function (event) {
				event.preventDefault();
				send(event, form.action);
			});
		});
	}
});
