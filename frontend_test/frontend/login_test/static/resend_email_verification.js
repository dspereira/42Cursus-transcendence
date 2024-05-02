console.log("email_sended.js is %cActive", 'color: #90EE90')

_401_html_body = '<div class="container text-center"><h1 class="display-1 text-danger">401</h1><h2 class="mb-4">Unauthorized</h2><p class="lead mb-4">Oops! You are not authorized to access this page.</p><a href="/2fa" class="btn btn-primary">Go Back to Homepage</a></div>'

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	let container = document.getElementById("container");
	let header = document.getElementById("header_1");
	let paragraph = document.getElementById("paragraph");
	let emailIcon = document.getElementById("email_icon");
	let invalid_email_message = document.getElementById("invalid_email_message");

	container.classList.remove("success-container");
	container.classList.remove("error-container");
	container.classList.add("resended-container");
	header.textContent = "Email Verification";
	paragraph.textContent = "Please enter your email.";
	emailIcon.src = "/static/images/email_resend.png";
	invalid_email_message.style.display = "none";

	async function send_verification_email(json_data)
	{
		const response = await fetch("http://127.0.0.1:8000/api/auth/send_verification_email", {
			credentials: 'include',
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(json_data)
		})
		const data = await response.json();
		if (data)
		{
			if (data.status === "sended")
				window.location.href = "/email_sended";
			else if (data.status === "verified")
				window.location.href = "/email_already_verified";
			else
				invalid_email_message.style.display = "block";
		}
		else
			console.log("Data is Empty")
	}

	let form = document.getElementById("email_form");
	form.addEventListener("submit", function(event) {
		event.preventDefault();

		const formData = new FormData(form);
		const jsonData = {};
		formData.forEach((value, key) => {
			jsonData[key] = value;
		});

		send_verification_email(jsonData);
	});

});
