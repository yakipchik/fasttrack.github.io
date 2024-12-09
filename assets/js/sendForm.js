document.addEventListener("DOMContentLoaded", () => {
    function sendForm(event, php) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        let req = new XMLHttpRequest();
        req.open("POST", php, true);
        req.onload = function () {
            if (req.status >= 200 && req.status < 400) {
                json = JSON.parse(this.response);
                if (json.result === "success") {
                    event.reset();
                    // document.querySelector(".success-popup").classList.add("open");
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
                sendForm(event.target, form.action);
            });
        });
    }
});
