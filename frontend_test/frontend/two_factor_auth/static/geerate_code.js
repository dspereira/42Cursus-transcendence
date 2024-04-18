console.log("configure_2fa.js is %cActive", 'color: #90EE90')

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	async function generate_otp()
	{
		const response = await fetch("http://127.0.0.1:8000/api/two_factor_auth/generate_otp", {
			credentials: 'include',
			method: 'POST'
		});
		const data = await response.json();

		if (data && data['message'] && data['code'])
		{

			console.log("::::::::::::::::::::::::::::::::::::::::::::::::")
			console.log("message:" + data['message']);
			console.log("code:" + data['code']);
			console.log("::::::::::::::::::::::::::::::::::::::::::::::::")

			document.querySelector(".generated_code_label").innerHTML = "Code > " + data['code'];

		}
		else
			document.querySelector(".generated_code_label").innerHTML = "Data is";
	}

	async function validate_otp(otp)
	{

		console.log("OTP Value > " + otp)
		let jsonData = {
			"code": otp
		};

		const response = await fetch("http://127.0.0.1:8000/api/two_factor_auth/validate_otp", {
			credentials: 'include',
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(jsonData)
		});
		const data = await response.json();

		if (data && data['message'])
		{

			console.log("::::::::::::::::::::::::::::::::::::::::::::::::")
			console.log("message:" + data['message']);
			console.log("::::::::::::::::::::::::::::::::::::::::::::::::")
			document.querySelector(".validation_label").innerHTML = data['message'];
		}
		else
			document.querySelector(".validation_label").innerHTML = "Empty Data";

	}

	function verification_form()
	{
		const selectElement = document.getElementById('check_code_form');

		selectElement.addEventListener('submit', function(event)
		{
			event.preventDefault();

			const formData = new FormData(check_code_form);
			const jsonData = {};
			formData.forEach((value, key) => {
				jsonData[key] = value;
			});

			if (jsonData["code"])
				validate_otp(jsonData["code"])
		});
	}

	function generate_button()
	{
		const selectElement = document.getElementById('generate_code_btn');

		selectElement.addEventListener('click', function()
		{
			console.log("Carreguei no bot\ao de generate.");
			generate_otp();
		});
	}

	generate_button();
	verification_form();
});
