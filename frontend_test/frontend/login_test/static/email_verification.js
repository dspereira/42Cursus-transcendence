console.log("email_verification.js is %cActive", 'color: #90EE90')

_401_html_body = '<div class="container text-center"><h1 class="display-1 text-danger">401</h1><h2 class="mb-4">Unauthorized</h2><p class="lead mb-4">Oops! You are not authorized to access this page.</p><a href="/2fa" class="btn btn-primary">Go Back to Homepage</a></div>'

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('email_token');
	let type = null

	let container = document.getElementById("container");
	let header = document.getElementById("header_1");
	let paragraph = document.getElementById("paragraph");
	let link = document.getElementById("link");
	let emailIcon = document.getElementById("email_icon");

	function updatePage(type)
	{
		if (type == "success")
		{
			container.classList.add("success-container");
			container.classList.remove("error-container");
			container.classList.remove("resended-container");
			header.textContent = "Email Verification Success";
			paragraph.textContent = "Your email has been successfully verified.";
			link.textContent = "Continue";
			link.href = "/";
			link.style.display = "block";
			emailIcon.src = "/static/images/email_success.png";
		}
		else
		{
			container.classList.remove("success-container");
			container.classList.add("error-container");
			container.classList.remove("resended-container");
			header.textContent = "Email Verification Failure";
			paragraph.textContent = "Sorry, we couldn't verify your email.";
			link.textContent = "Retry";
			link.href = "/resend_email_verification";
			link.style.display = "block";
			emailIcon.src = "/static/images/email_fail.png";
		}
	}

	async function verify_email_token(token)
	{
		const jsonData = {
			"email_token": token
		}

		const response = await fetch("http://127.0.0.1:8000/api/auth/validate_email", {
			credentials: 'include',
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(jsonData)
		})
		const data = await response.json()
		if (data)
		{
			console.log(data)

			if (data["validation_status"] === "validated")
				type = "success"
			else if (data["validation_status"] === "active")
				window.location.href = "/email_already_verified"
			else
				type = "fail"

			if (type)
				updatePage(type);
		}
		else
			console.log("Data is Empty")
	}

	verify_email_token(token);
});
