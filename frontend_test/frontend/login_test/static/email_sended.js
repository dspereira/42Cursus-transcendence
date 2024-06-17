console.log("email_sended.js is %cActive", 'color: #90EE90')

_401_html_body = '<div class="container text-center"><h1 class="display-1 text-danger">401</h1><h2 class="mb-4">Unauthorized</h2><p class="lead mb-4">Oops! You are not authorized to access this page.</p><a href="/2fa" class="btn btn-primary">Go Back to Homepage</a></div>'

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	let container = document.getElementById("container");
	let header = document.getElementById("header_1");
	let paragraph = document.getElementById("paragraph");
	let emailIcon = document.getElementById("email_icon");

	container.classList.remove("success-container");
	container.classList.remove("error-container");
	container.classList.add("resended-container");
	header.textContent = "Email Verification Sended";
	paragraph.textContent = "Verification email was sended. Please check your email box.";
	emailIcon.src = "/static/images/email_sended.png";

});
