console.log("image_scripts.js is %cActive", 'color: #90EE90')

_401_html_body = '<div class="container text-center"><h1 class="display-1 text-danger">401</h1><h2 class="mb-4">Unauthorized</h2><p class="lead mb-4">Oops! You are not authorized to access this page.</p><a href="/2fa" class="btn btn-primary">Go Back to Homepage</a></div>'

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	async function getUserInfo()
	{
		const response = await fetch("http://127.0.0.1:8000/api/profile/", {
			credentials: 'include',
			method: 'GET'
		});

		if (response.status === 401)
			document.getElementById("profile_body").innerHTML = _401_html_body;
		else
		{
			const data = await response.json();

			if (data)
			{
				document.getElementById("username").innerHTML = "Username: " + data["username"];
				document.getElementById("bio").innerHTML = "Bio: " + data["bio"];
                document.getElementById("statistics").innerHTML = "Total Games: " + data["total_games"] + "<br>Victories: " + data["victories"] + "<br>Defeats: " + data["defeats"] + "<br>Win Rate: " + data["win_rate"] + "<br>Tournaments won: " + data["tournaments_won"];
				document.getElementById("imageContainer").innerHTML = "<img src='" + data["image_url"] + "' alt='User Image'>";
				//showImage()
			}
		}
	}

	async function showImage()
	{
		const response = await fetch("http://127.0.0.1:8000/api/profile/getimage", {
			credentials: 'include',
			method: 'GET'
		});

		if (response.status === 401)
			document.getElementById("profile_body").innerHTML = _401_html_body;
		else
		{
			const data = await response.json();

			if (data)
                document.getElementById("imageContainer").innerHTML = "<img src='" + data["image_url"] + "' alt='User Image'>";
		}
	}

    getUserInfo();
})