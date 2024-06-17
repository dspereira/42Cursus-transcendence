console.log("2fa_with_phone.js is %cActive", 'color: #90EE90')

_401_html_body = '<div class="container text-center"><h1 class="display-1 text-danger">401</h1><h2 class="mb-4">Unauthorized</h2><p class="lead mb-4">Oops! You are not authorized to access this page.</p><a href="/2fa" class="btn btn-primary">Go Back to Homepage</a></div>'

_data_is_empty_html_body = '<div class="container text-center"><h1 class="display-4 text-danger">Data is Empty</h1><p class="lead">Oops! Não há dados disponíveis no momento.</p><a href="#" class="btn btn-primary">Voltar</a></div>'

_need_configuration_html_body = '<div class="container text-center"><h1 class="display-4 text-warning">Need Configurations</h1><p class="lead">Oops! It seems your settings need configurations.</p><p class="lead">Would you like to configure your settings?</p><a href="/2fa/configuration" class="btn btn-primary">Configure Now</a></div>'

_config_needed = 'Email'

_need_specific_configuration_html_body = '<div class="container text-center"><h1 class="display-4 text-warning">Need ' + _config_needed + ' Configuration</h1><p class="lead">Oops! It seems your settings need configurations for ' + _config_needed + ' authentication.</p><p class="lead">Would you like to configure your settings now?</p><a href="/2fa/update_configuration" class="btn btn-primary">Configure Now</a></div>'

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	const body_class = ".two_factor_auth_with_phone";

	const generate_new_code_btn = document.getElementById("generate_new_code")
	const check_code_form = document.getElementById('check_code_form');

	async function generate_user_email_code()
	{
		const response = await fetch("http://127.0.0.1:8000/api/two_factor_auth/generate_user_email_code", {
			credentials: 'include',
			method: 'GET'
		});

		if (response.status === 401)
			document.querySelector(body_class).innerHTML = _401_html_body;
		else
		{
			const data = await response.json();

			if (data)
			{
				console.log(data)
			}
			else
				document.querySelector(body_class).innerHTML = _data_is_empty_html_body;
		}
	}

	async function is_email_configured()
	{
		const response = await fetch("http://127.0.0.1:8000/api/two_factor_auth/is_email_configured", {
			credentials: 'include',
			method: 'GET'
		});

		if (response.status === 401)
			document.querySelector(body_class).innerHTML = _401_html_body;
		else
		{
			const data = await response.json();

			if (data)
			{
				console.log("Config Status = " + data["config_status"])
				if (data["config_status"] != true)
					document.querySelector(body_class).innerHTML = _need_specific_configuration_html_body;
			}
			else
				document.querySelector(body_class).innerHTML = _data_is_empty_html_body;
		}
	}

	async function is_already_configured()
	{
		const response = await fetch("http://127.0.0.1:8000/api/two_factor_auth/is_already_configured", {
			credentials: 'include',
			method: 'GET'
		});

		if (response.status === 401)
			document.querySelector(body_class).innerHTML = _401_html_body;
		else
		{
			const data = await response.json();

			if (data)
			{
				if (data["already_configured"] == true)
				{
					console.log("Entrei Aqui")
					if (is_email_configured())
					{
						console.log("All configured and good to Go")
					}
				}
				else
					document.querySelector(body_class).innerHTML = _need_configuration_html_body;
			}
			else
				document.querySelector(body_class).innerHTML = _data_is_empty_html_body;
		}
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
			if (data['valid'] === false || data['valid'] === true)
				document.querySelector(".validation_message").innerHTML = "Is Valid -> " + data['valid'];
		}
		else
			document.querySelector(".validation_message").innerHTML = "Empty Data";
	}

	function verification_form()
	{
		check_code_form.addEventListener('submit', function(event)
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

	is_already_configured()
	verification_form()

	generate_new_code_btn.addEventListener("click", function() {
		generate_user_email_code();
	});

});
