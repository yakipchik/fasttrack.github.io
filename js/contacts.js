document.addEventListener("DOMContentLoaded", () => {
	function contactsBtn() {
		const btn = document.querySelector(".home-btn");
		if (btn) {
			const body = document.querySelector(".home-body");
			const info = document.querySelector(".home-info");
			if (window.innerWidth <= 1060) {
				body.appendChild(btn);
			} else {
				info.appendChild(btn);
			}
		}
	}
	contactsBtn();
	window.addEventListener("resize", () => {
		contactsBtn();
	});
});
