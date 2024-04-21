console.log("configuration.js is %cActive", 'color: #90EE90')

_401_html_body = '<div class="container text-center"><h1 class="display-1 text-danger">401</h1><h2 class="mb-4">Unauthorized</h2><p class="lead mb-4">Oops! You are not authorized to access this page.</p><a href="/2fa" class="btn btn-primary">Go Back to Homepage</a></div>'

_data_is_empty_html_body = '<div class="container text-center"><h1 class="display-4 text-danger">Data is Empty</h1><p class="lead">Oops! Não há dados disponíveis no momento.</p><a href="#" class="btn btn-primary">Voltar</a></div>'

_need_configuration_html_body = '<div class="container text-center"><h1 class="display-4 text-warning">Need Configurations</h1><p class="lead">Oops! It seems your settings need configurations.</p><p class="lead">Would you like to configure your settings?</p><a href="/2fa/configuration" class="btn btn-primary">Configure Now</a></div>'

_config_needed = 'QR Code'

_need_specific_configuration_html_body = '<div class="container text-center"><h1 class="display-4 text-warning">Need ' + _config_needed + ' Configuration</h1><p class="lead">Oops! It seems your settings need configurations for ' + _config_needed + ' authentication.</p><p class="lead">Would you like to configure your settings now?</p><a href="/2fa/update_configuration" class="btn btn-primary">Configure Now</a></div>'

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	const body_class = ".two_factor_auth_with_qrcode";

	const qr_code_image_element = document.getElementById('qrCodeImg')

	async function generate_user_qr_code()
	{
		const response = await fetch("http://127.0.0.1:8000/api/two_factor_auth/generate_qr_code", {
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
				if (data['qr_code'])
					qr_code_image_element.src = 'data:image/png;base64,' + data['qr_code']
			}
			else
				document.querySelector(body_class).innerHTML = _data_is_empty_html_body;
		}
	}

	async function is_qr_code_configured()
	{
		const response = await fetch("http://127.0.0.1:8000/api/two_factor_auth/is_qr_code_configured", {
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
				if (data["config_status"] != true)
					document.querySelector(body_class).innerHTML = _need_specific_configuration_html_body;
				generate_user_qr_code();
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
					if (is_qr_code_configured())
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

	is_already_configured()

});
