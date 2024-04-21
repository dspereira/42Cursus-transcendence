console.log("update_configuration.js is %cActive", 'color: #90EE90')

_401_html_body = '<div class="container text-center"><h1 class="display-1 text-danger">401</h1><h2 class="mb-4">Unauthorized</h2><p class="lead mb-4">Oops! You are not authorized to access this page.</p><a href="/2fa" class="btn btn-primary">Go Back to Homepage</a></div>'

_data_is_empty_html_body = '<div class="container text-center"><h1 class="display-4 text-danger">Data is Empty</h1><p class="lead">Oops! Não há dados disponíveis no momento.</p><a href="#" class="btn btn-primary">Voltar</a></div>'

_need_configuration_html_body = '<div class="container text-center"><h1 class="display-4 text-warning">Need Configurations</h1><p class="lead">Oops! It seems your settings need configurations.</p><p class="lead">Would you like to configure your settings?</p><a href="/2fa/configuration" class="btn btn-primary">Configure Now</a></div>'

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	const qr_code_switch = document.getElementById('switch_1');
	const email_switch = document.getElementById('switch_2');
	const phone_switch = document.getElementById('switch_3');
	const countryCodeSelect = document.getElementById("countryCode");
	const phoneInput = document.getElementById('phone');
	const update_configs_btn = document.getElementById('update_configs_btn');

	let default_values = {}

	const formElements = document.querySelectorAll("#update_configuration_form input, #update_configuration_form select");
	const update_config_form = document.getElementById("update_configuration_form")

	function objects_are_equal(obj1, obj2)
	{
		
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) {
			return false;
		}
		
		for (let key of keys1) {
			if (obj1[key] !== obj2[key]) {
				
				return false;
			}
		}
		
		return true;
	}

	function change_update_settings_button()
	{
		let formValues = {};

		formElements.forEach(element => {
			if (element.type === "checkbox") {
				formValues[element.id] = element.checked;
			} else {
				formValues[element.id] = element.value;
			}
		});

		const isDifferent = !objects_are_equal(formValues, default_values);

		update_configs_btn.disabled = !isDifferent;
	}

	async function showCurrentSettings()
	{
		const response = await fetch("http://127.0.0.1:8000/api/two_factor_auth/get_current_configuration", {
			credentials: 'include',
			method: 'GET'
		});

		if (response.status === 401)
			document.querySelector(".update_configuration_2fa_body").innerHTML = _401_html_body;
		else
		{
			const data = await response.json();

			if (data && data["message"])
			{

				if (data["user_settings"])
				{
					user_settings = data["user_settings"]

					qr_code_switch.checked = user_settings['qr_code']
					email_switch.checked = user_settings['email']

					if (user_settings['phone'])
					{
						phone_switch.checked = true
						phoneInput.disabled = false;
						phoneInput.value = user_settings['phone'];
						countryCodeSelect.value = user_settings['country_code']
					}
					else
					{
						phone_switch.checked = false
						phoneInput.disabled = true;
						phoneInput.value = '';
					}

					default_values = {
						'switch_1': qr_code_switch.checked,
						'switch_2': email_switch.checked,
						'switch_3': phone_switch.checked,
						'countryCode': countryCodeSelect.value,
						'phone': phoneInput.value
					}

					change_update_settings_button();
				}
				else
					document.querySelector(".update_configuration_2fa_body").innerHTML = _need_configuration_html_body;
			}
			else
				document.querySelector(".update_configuration_2fa_body").innerHTML = _data_is_empty_html_body;
		}
	}

	async function update_user_2fa_configs(new_settings)
	{
		const response = await fetch("http://127.0.0.1:8000/api/two_factor_auth/update_configurations", {
			credentials: 'include',
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(new_settings)
		});

		if (response.status === 401)
			document.querySelector(".update_configuration_2fa_body").innerHTML = _401_html_body;
		else
		{
			const data = await response.json();

			if (data && data["message"])
			{
				if (document.querySelector(".configuration_message_info") && data["message"])
					document.querySelector(".configuration_message_info").innerHTML = "Message -> " + data["message"];
				if (document.querySelector(".configuration_status_info") && data["status"])
					document.querySelector(".configuration_status_info").innerHTML = "Status  -> " + data["status"];
			}
			else
				document.querySelector(".update_configuration_2fa_body").innerHTML = _data_is_empty_html_body;
		}
	}

	function get_phone_value(country_code, phone)
	{
		let phone_number = null;
		if (country_code && phone)
			phone_number = country_code +  " " + phone.replace(/\s/g, "");
		return phone_number
	}

	function update_configs_form()
	{
		update_config_form.addEventListener('submit', function(event)
		{
			event.preventDefault();
		
			const formData = new FormData(update_config_form);
			const jsonData = {};
			formData.forEach((value, key) => {
				jsonData[key] = value;
			});

			let qr_code_status = qr_code_switch.checked
			let email_status = email_switch.checked
			let phone_status = phone_switch.checked
			let phone_value = get_phone_value(countryCodeSelect.value, phoneInput.value)

			new_settings = {
				'qr_code': qr_code_status,
				'email': email_status,
				'phone_status': phone_status,
				'phone_value': phone_value
			}

			update_user_2fa_configs(new_settings);
		});
	}

	showCurrentSettings();
	
	phone_switch.addEventListener('change', function() {
		phoneInput.disabled = !this.checked;
		if (!this.checked) {
			phoneInput.value = '';
		}
	});

	formElements.forEach(element => {
		element.addEventListener("change", change_update_settings_button);
	});

	update_configs_form()

});
