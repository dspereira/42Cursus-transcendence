console.log("check_notifications.js is %cActive", 'color: #90EE90')

_401ErrorPage = "<h1>Error 401</h1><p>Sorry, an error occurred. Please try again later.</p>";

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	let notifications = [];

	function create_notification_card(notification) {
		const card = document.createElement('div');
		card.classList.add('card', 'mb-3');
	
		const cardHeader = document.createElement('div');
		cardHeader.classList.add('card-header');

		const timestamp = new Date(notification.timestamp * 1000);
		const timestampOptions = { hour12: false };
		const timestampStr = timestamp.toLocaleTimeString('en-US', timestampOptions);

		const timestampSpan = document.createElement('span');
		timestampSpan.classList.add('float-end', 'text-muted');
		timestampSpan.textContent = timestampStr;
	
		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');
	
		const cardText = document.createElement('p');
		cardText.classList.add('card-text');
		cardText.textContent = notification.message;
	
		const acceptBtn = document.createElement('button');
		acceptBtn.classList.add('btn', 'btn-outline-success', 'mr-2');
		acceptBtn.innerHTML = '&#10004;&#65039;';
		acceptBtn.addEventListener('click', function() {
			accept_notification(notification);
		});
	
		const denyBtn = document.createElement('button');
		denyBtn.classList.add('btn', 'btn-outline-danger');
		denyBtn.innerHTML = '&#10060;';
		denyBtn.addEventListener('click', function() {
			deny_notification(notification);
		});
	
		cardHeader.appendChild(timestampSpan);
		card.appendChild(cardHeader);
		cardBody.appendChild(cardText);
		cardBody.appendChild(acceptBtn);
		cardBody.appendChild(denyBtn);
		card.appendChild(cardBody);
	
		return card;
	}

	function render_notifications() {
		const container = document.getElementById('notification-container');
		container.innerHTML = '';
		notifications.forEach(notification => {
			container.appendChild(create_notification_card(notification));
		});
	}

	function add_notification(new_notification)
	{
		notifications.unshift(JSON.parse(new_notification));
		render_notifications();
	}

	function accept_notification(notification) {
		const index = notifications.indexOf(notification);
		if (notification) {
			console.log(`Accepted: ${notification.message}`);
			notifications.splice(index, 1);
		}
		render_notifications();
	}

	function deny_notification(notification)
	{
		const index = notifications.indexOf(notification);
		if (notification) {
			console.log(`Denied: ${notification.message}`);
			notifications.splice(index, 1);
		}
		render_notifications();
	}

	function init_notifications(notifications_list_string)
	{
		let new_notifications = JSON.parse(notifications_list_string)
		for (let i = 0; i < new_notifications.length; i++)
			notifications.unshift(new_notifications[i]);
		render_notifications();
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
					init_notifications(data['notifications']);
				else if (data['type'] == "send_friend_notification")
					add_notification(data['friend_req_notification'])
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
