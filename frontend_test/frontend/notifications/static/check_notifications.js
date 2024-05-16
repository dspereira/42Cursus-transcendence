console.log("check_notifications.js is %cActive", 'color: #90EE90')

_401ErrorPage = "<h1>Error 401</h1><p>Sorry, an error occurred. Please try again later.</p>";

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	let notifications = [];

	function create_notification_card(notification_socket, notification) {
		const card = document.createElement('div');
		card.classList.add('card', 'mb-3');

		const cardHeader = document.createElement('div');
		cardHeader.classList.add('card-header', 'd-flex', 'justify-content-between', 'align-items-center'); // Usando flexbox para alinhar
	
		const cardTitle = document.createElement('h5');
		cardTitle.classList.add('card-title', 'mb-0');
		switch (notification.type) {
			case "friend_request":
				cardTitle.textContent = "FRIEND REQUEST";
				break;
			case "game_invite":
				cardTitle.textContent = "GAME INVITE";
				break;
			default:
				cardTitle.textContent = notification.type;
				break;
		}

		const timestamp = new Date(notification.timestamp * 1000);
		const timestampOptions = { hour12: false };
		const timestampStr = timestamp.toLocaleTimeString('en-US', timestampOptions);

		const timestampSpan = document.createElement('span');
		timestampSpan.textContent = timestampStr;

		const headerContent = document.createElement('div');
		headerContent.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'w-100');

		headerContent.appendChild(cardTitle);
		headerContent.appendChild(timestampSpan);

		cardHeader.appendChild(headerContent);
		card.appendChild(cardHeader);

		switch (notification.type) {
			case "friend_request":
				card.style.backgroundColor = "rgba(0, 174, 255, 0.5)";
				break;
			case "game_invite":
				card.style.backgroundColor = "rgba(255, 255, 0, 0.6)";
				break;
			default:
				break;
		}

		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');
	
		const cardText = document.createElement('p');
		cardText.classList.add('card-text');
		cardText.textContent = notification.message;
	
		const acceptBtn = document.createElement('button');
    	acceptBtn.classList.add('btn', 'btn-outline-success', 'mr-2');
    	acceptBtn.innerHTML = '&#10004;&#65039;';
    	acceptBtn.addEventListener('click', function() {
    	    accept_notification(notification_socket, notification);
    	});

    	const denyBtn = document.createElement('button');
    	denyBtn.classList.add('btn', 'btn-outline-danger');
    	denyBtn.innerHTML = '&#10060;';
    	denyBtn.addEventListener('click', function() {
    	    deny_notification(notification_socket, notification);
    	});

		cardBody.appendChild(cardText);
		cardBody.appendChild(acceptBtn);
		cardBody.appendChild(denyBtn);
		card.appendChild(cardBody);
	
		return card;
	}

	function render_notifications(notification_socket)
	{
		const container = document.getElementById('notification-container');
		container.innerHTML = '';
		notifications.forEach(notification => {
			container.appendChild(create_notification_card(notification_socket, notification));
		});
	}

	function add_notification(notification_socket, new_notification)
	{
		notifications.unshift(JSON.parse(new_notification));
		render_notifications(notification_socket);
	}

	function send_friend_notification_status(notification_socket, notification, status)
	{
		notification_socket.send(JSON.stringify({
			"type": "friend_request_status",
			"status": status,
			"notification_id": notification.id
		}));
	}

	function accept_notification(notification_socket, notification) {
		const index = notifications.indexOf(notification);
		if (notification) {
			console.log(`Accepted: ${notification.message}`);
			notifications.splice(index, 1);
		}
		send_friend_notification_status(notification_socket, notification, "accepted");
		render_notifications(notification_socket);
	}

	function deny_notification(notification_socket, notification)
	{
		const index = notifications.indexOf(notification);
		if (notification) {
			console.log(`Denied: ${notification.message}`);
			notifications.splice(index, 1);
		}
		send_friend_notification_status(notification_socket, notification, "denied");
		render_notifications(notification_socket);
	}

	function init_notifications(notification_socket, notifications_list_string)
	{
		let new_notifications = JSON.parse(notifications_list_string)
		for (let i = 0; i < new_notifications.length; i++)
			notifications.unshift(new_notifications[i]);
		render_notifications(notification_socket);
		/* notifications.forEach(element => {
			console.log(element.id, element.from_user, element.timestamp);
		}); */
	}

	function connect()
	{
		let notification_socket = null;
		
		result_str = "ws://127.0.0.1:8000/notifications/";
		notification_socket = new WebSocket(result_str);

		notification_socket.onopen = function(event)
		{
			notification_socket.send(JSON.stringify({
				"type": "get_all_notifications",
			}))
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
	
		notification_socket.onmessage = function(event)
		{
			const data = JSON.parse(event.data);
			
			if (data)
			{
				console.log(data);
				if (data['type'] == "send_all_notifications")
					init_notifications(notification_socket, data['notifications']);
				else if (data['type'] == "send_friend_notification")
					add_notification(notification_socket, data['friend_req_notification'])
				else if (data['type'] == "send_game_invite_notification")
					add_notification(notification_socket, data['game_inv_notification'])
			}
		};

		notification_socket.onerror = function(err)
		{
			console.log("WebSocket encountered an error: " + err.message);
			console.log("Closing the socket.");
			notification_socket.close();
		}
	
	}

	connect()

});
