console.log("geerate_code.js is %cActive", 'color: #90EE90')

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	async function is_already_configured()
	{
		const response = await fetch("http://127.0.0.1:8000/api/two_factor_auth/is_already_configured", {
			credentials: 'include',
			method: 'GET'
		});
		const data = await response.json();

		if (data)
		{
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

	is_already_configured();
});
