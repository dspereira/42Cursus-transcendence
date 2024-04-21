console.log("configuration.js is %cActive", 'color: #90EE90')

_401_html_body = '<div class="container text-center"><h1 class="display-1 text-danger">401</h1><h2 class="mb-4">Unauthorized</h2><p class="lead mb-4">Oops! You are not authorized to access this page.</p><a href="/2fa" class="btn btn-primary">Go Back to Homepage</a></div>'

_data_is_empty_html_body = '<div class="container text-center"><h1 class="display-4 text-danger">Data is Empty</h1><p class="lead">Oops! Não há dados disponíveis no momento.</p><a href="#" class="btn btn-primary">Voltar</a></div>'

_already_configured_html_body = '<div class="container text-center"><h1 class="display-4 text-success">Already Configured</h1><p class="lead">Great! Your settings are already configured.</p><p class="lead">Would you like to update your configurations?</p><a href="/2fa/update_configuration" class="btn btn-primary">Update Configurations</a></div>'

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	async function is_already_configured()
	{
		const response = await fetch("http://127.0.0.1:8000/api/two_factor_auth/is_already_configured", {
			credentials: 'include',
			method: 'GET'
		});

		if (response.status === 401)
			document.querySelector(".configuration_2fa_body").innerHTML = _401_html_body;
		else
		{
			const data = await response.json();

			if (data)
			{
				if (data["already_configured"] == true)
					document.querySelector(".configuration_2fa_body").innerHTML = _already_configured_html_body;
			}
			else
				document.querySelector(".configuration_2fa_body").innerHTML = _data_is_empty_html_body;
		}
	}

	async function configuration(qr_code, email, phone)
	{
		jsonData = {
			"qr_code": qr_code,
			"email": email,
			"phone": phone,
		}

		const response = await fetch("http://127.0.0.1:8000/api/two_factor_auth/configuration", {
			credentials: 'include',
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(jsonData)
		});

		if (response.status === 401)
			document.querySelector(".configuration_2fa_body").innerHTML = _401_html_body;
		else
		{
			const data = await response.json();

			if (data)
			{
				if (data["message"] != "Already Configured")
				{
					if (document.querySelector(".configuration_message_info") && data["message"])
						document.querySelector(".configuration_message_info").innerHTML = "Message -> " + data["message"];
					if (document.querySelector(".configuration_valid_info") && data["valid_input"])
						document.querySelector(".configuration_valid_info").innerHTML = "Valid   -> " + data["valid_input"];
				}
				else
					document.querySelector(".configuration_2fa_body").innerHTML = _already_configured_html_body;
			}
			else
				document.querySelector(".configuration_2fa_body").innerHTML = _data_is_empty_html_body;
		}
	}

	function get_phone_number(country_code, phone)
	{
		let phone_number = country_code +  " " + phone.replace(/\s/g, "");
		return phone_number
	}

	const qr_code_switch = document.getElementById('switch_1');
	const email_switch = document.getElementById('switch_2');
	const phone_switch = document.getElementById('switch_3');
	const phoneInput = document.getElementById('phone');
	const countryCodeSelect = document.getElementById("countryCode");

	qr_code_switch.checked = false
	email_switch.checked = false
	phone_switch.checked = false
	phoneInput.disabled = true;
	phoneInput.value = '';
	countryCodeSelect.value = '+351'

	function configuration_form()
	{
		let phone_switch = document.getElementById('switch_3');
		phone_switch.addEventListener('change', function() {
			phoneInput.disabled = !this.checked;
			if (!this.checked) {
				phoneInput.value = '';
			}
		});

		const selectElement = document.getElementById('configuration_form');
		selectElement.addEventListener('submit', function(event)
		{
			event.preventDefault();

			const formData = new FormData(selectElement);
			const jsonData = {};
			formData.forEach((value, key) => {
				jsonData[key] = value;
			});

			let qr_code_switch_value = qr_code_switch.checked;
			let email_switch_value = email_switch.checked;
			let phone_switch_value = phone_switch.checked;

			let phone_number = null

			if (jsonData)
			{
				console.log("---------- Json Data ----------")
				console.log(jsonData)
				console.log("Switch 1: " + qr_code_switch_value)
				console.log("Switch 2: " + email_switch_value)
				console.log("Switch 3: " + phone_switch_value)
				console.log("-------------------------------")
				if (phone_switch_value === true && jsonData["country_code"] && jsonData["phone"])
					phone_number = get_phone_number(jsonData["country_code"], jsonData["phone"])
				console.log("Phone Number: " + phone_number)
				configuration(qr_code_switch_value, email_switch_value, phone_number);
			}
		});
	}

	configuration_form();
	is_already_configured();
});
