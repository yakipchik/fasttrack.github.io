document.addEventListener("DOMContentLoaded", () => {
	const url = window.location.href + "./form/send.php";

	// async function sendFrm() {
	// 	let response = await fetch(url);
	// 	if (response.ok) {
	// 		let json = await response.json();
	// 	} else {
	// 		alert("Ошибка HTTP: " + response.status);
	// 	}
	// }

	async function sendForm(event, php) {
		let response = await fetch(url);
		if (response.ok) {
			let json = await response.json();
		} else {
			alert("Ошибка HTTP: " + response.status);
		}
		console.log(response);

		// event.preventDefault ? event.preventDefault() : (event.returnValue = false);
		// var req = new XMLHttpRequest();
		// req.open("POST", php, true);
		// req.onload = function () {
		// 	if (req.status >= 200 && req.status < 400) {
		// 		json = JSON.parse(this.response);
		// 		if (json.result == "success") {
		// 			event.reset();
		// 			// document.querySelector(".success-popup").classList.add("open");
		// 			event.querySelector("button").disabled = false;
		// 		} else {
		// 			alert("Ошибка. Сообщение не отправлено");
		// 			event.querySelector("button").disabled = false;
		// 		}
		// 	} else {
		// 		console.log(json);
		// 		alert("Ошибка сервера. Повторите отправку");
		// 		event.querySelector("button").disabled = false;
		// 	}
		// };
		// req.onerror = function () {
		// 	alert("Ошибка отправки запроса");
		// 	event.querySelector("button").disabled = false;
		// };
		// req.send(new FormData(event));
	}

	let forms = document.querySelectorAll("form");
	if (forms) {
		forms.forEach((form) => {
			form.addEventListener("submit", function (event) {
				event.preventDefault();
				sendForm(event.target, form.action);
			});
		});
	}
});
