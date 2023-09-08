document.addEventListener("DOMContentLoaded", () => {
	gsap.registerPlugin(ScrollToPlugin);

	document.querySelectorAll(".btn-scroll__form").forEach((btn) => {
		btn.addEventListener("click", () => {
			let offHeader = 0;
			if (window.innerWidth < 576) {
				offHeader = 40;
			}
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
			} else {
				document.querySelector(".header-popup").classList.add("open");
			}
		});
	});
	document.querySelector(".header-popup").addEventListener("click", (e) => {
		if (e.target.classList.contains("header-popup")) {
			document.querySelector(".header-popup").classList.remove("open");
		}
	});

	new Swiper(".gallery-swiper", {
		slidesPerView: "auto",
		loop: true,
		centeredSlides: true,
		breakpoints: {
			0: {
				spaceBetween: 10,
			},
			576: {
				spaceBetween: 40,
			},
		},
	});

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

	let forms = document.querySelectorAll("form");
	forms.forEach((form) => {
		form.addEventListener("submit", function (event) {
			event.preventDefault();
			fetch(form.action, {
				method: "post",
				body: new URLSearchParams(new FormData(form)), // for application/x-www-form-urlencoded
				// body: new FormData(form) // for multipart/form-data
			});
		});
	});
});
