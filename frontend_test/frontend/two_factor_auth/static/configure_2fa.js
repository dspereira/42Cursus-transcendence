console.log("geerate_code.js is %cActive", 'color: #90EE90')

_401_html_body = '<div class="container text-center"><h1 class="display-1 text-danger">401</h1><h2 class="mb-4">Unauthorized</h2><p class="lead mb-4">Oops! You are not authorized to access this page.</p><a href="/2fa" class="btn btn-primary">Go Back to Homepage</a></div>'

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	async function is_already_configured()
	{
		const response = await fetch("http://127.0.0.1:8000/api/two_factor_auth/is_already_configured", {
			credentials: 'include',
			method: 'GET'
		});

		if (response.status === 401)
			document.querySelector(".configure_2fa_body").innerHTML = _401_html_body;
		else
		{
			const data = await response.json();

			if (data)
			{
				console.log("Status: " + data['status'])
			
				let button_configure = document.getElementById('configure_btn');
				let button_update_config = document.getElementById('update_config_btn');
				console.log("Already Configured -> " + data["already_configured"])
				if (data["already_configured"] == false)
				{
					document.querySelector(".configured_status").innerHTML = data['message'];
					button_update_config.setAttribute('disabled', '');
				}
				else
				{
					document.querySelector(".configured_status").innerHTML = data['message'];
					button_configure.setAttribute('disabled', '');
				}
			}
			else
				document.querySelector(".configured_status").innerHTML = "Data is Empty";
		}
	}

	function configure_button()
	{
		document.getElementById("configure_btn").addEventListener("click", function() {
			window.location.href = "http://127.0.0.1:8080/2fa/configuration";
		});
	}

	function update_config_button()
	{
		document.getElementById("update_config_btn").addEventListener("click", function() {
			window.location.href = "http://127.0.0.1:8080/2fa/update_configuration";
		});
	}

	is_already_configured();
	configure_button();
	update_config_button();
});
