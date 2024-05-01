console.log("email_verification.js is %cActive", 'color: #90EE90')

_401_html_body = '<div class="container text-center"><h1 class="display-1 text-danger">401</h1><h2 class="mb-4">Unauthorized</h2><p class="lead mb-4">Oops! You are not authorized to access this page.</p><a href="/2fa" class="btn btn-primary">Go Back to Homepage</a></div>'

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	let result = true;

	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get('email_token');

	function updatePage(result) {
		var container = document.getElementById("container");
		var header = document.getElementById("header_1");
		var paragraph = document.getElementById("paragraph");
		var link = document.getElementById("link");
		var emailIcon = document.getElementById("email_icon");

		if (result) {
			container.classList.add("success-container");
			container.classList.remove("error-container");
			header.textContent = "Email Verification Success";
			paragraph.textContent = "Your email has been successfully verified.";
			link.textContent = "Continue";
			link.href = "/"; // URL para redirecionar em caso de sucesso
			emailIcon.src = "/static/images/email_success.png"; // Troca a imagem de sucesso
		} else {
			container.classList.add("error-container");
			container.classList.remove("success-container");
			header.textContent = "Email Verification Failure";
			paragraph.textContent = "Sorry, we couldn't verify your email.";
			link.textContent = "Retry";
			link.href = "/"; // URL para redirecionar em caso de falha
			emailIcon.src = "/static/images/email_fail.png"; // Troca a imagem de falha
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

			if (data["validation_status"] === true)
				result = true
			else
				result = false

				updatePage(result);
		}
		else
			console.log("Data is Empty")
	}

	verify_email_token(token);
});
