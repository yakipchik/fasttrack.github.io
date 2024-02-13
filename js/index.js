document.addEventListener("DOMContentLoaded", () => {
	document.querySelectorAll(".popup").forEach((popup) => {
		const el = popup.querySelector(".popup-scroll");
		new SimpleBar(el, { autoHide: false });
	});

	let disableScroll = function () {
		let pagePosition = window.scrollY;
		document.body.classList.add("disable-scroll");
		document.body.dataset.position = pagePosition;
		document.body.style.top = -pagePosition + "px";
	};
	let enableScroll = function () {
		let pagePosition = parseInt(document.body.dataset.position, 10);
		document.body.style.top = "auto";
		document.body.classList.remove("disable-scroll");
		window.scroll({ top: pagePosition, left: 0 });
		document.body.removeAttribute("data-position");
	};

	document.querySelectorAll(".home-card").forEach((card) => {
		card.addEventListener("click", () => {
			let prof = card.getAttribute("data-card");
			document.querySelector(`[data-popup="${prof}"]`).classList.add("show");
			disableScroll();
		});
	});

	document.querySelectorAll(".popup").forEach((el) => {
		const close = el.querySelector(".popup-close");
		const wrapper = el.querySelector(".popup-wrapper");
		const body = el.querySelector(".popup-body");
		function closePopup() {
			el.classList.remove("show");
			enableScroll();
		}
		close.addEventListener("click", closePopup);
		wrapper.addEventListener("click", closePopup);
		body.addEventListener("click", (e) => {
			e.stopPropagation();
		});
	});
});
