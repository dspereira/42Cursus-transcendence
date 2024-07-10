console.log("friend_request.js is %cActive", 'color: #90EE90')

_401ErrorPage = "<h1>Error 401</h1><p>Sorry, an error occurred. Please try again later.</p>";

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	game_form = document.getElementById('game_invite_form')

	function connect()
	{
		let notification_socket = null;

		result_str = "ws://127.0.0.1:8000/notifications/";
		notification_socket = new WebSocket(result_str);

		notification_socket.onopen = function(event)
		{
			console.log("Successfully connected to the WebSocket.");
		}

		notification_socket.onclose = function(event)
		{
			notification_socket = null;

			const code = event.code;

			if (code == 4000)
				document.getElementById('notifications_body').innerHTML = _401ErrorPage

			console.log("Exit Code: " + code);
			console.log("WebSocket connection closed unexpectedly. Trying to reconnect in 2s...");
			setTimeout(function() {
				console.log("Reconnecting...");
				// connect();
			}, 2000);
		};

		game_form.addEventListener("submit", function(event) {
			event.preventDefault();

			let receiver_name = event.target.receiver_name.value;
			let game = event.target.game.value;
			console.log("Username:" + receiver_name);
			console.log("Game:" + game);
			if (receiver_name)
			{
				console.log("Friend: " + receiver_name);
				notification_socket.send(JSON.stringify({
					"type": "game_invite",
					"receiver_name": receiver_name,
					"game": game
				}))
			}
			game_form.reset()
		});

		notification_socket.onmessage = function(event)
		{
			const data = JSON.parse(event.data);
			console.log(data);
		};
	
		notification_socket.onerror = function(err)
		{
			console.log("WebSocket encountered an error: " + err.message);
			console.log("Closing the socket.");
			notification_socket.close();
		}
	
	}

	connect();

});
