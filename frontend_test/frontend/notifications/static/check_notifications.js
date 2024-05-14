console.log("check_notifications.js is %cActive", 'color: #90EE90')

_401ErrorPage = "<h1>Error 401</h1><p>Sorry, an error occurred. Please try again later.</p>";

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	const notifications = [
		{ message: 'Notification 1', type: 'info' },
		{ message: 'Notification 2', type: 'warning' },
		{ message: 'Notification 3', type: 'success' }
	];

	function createNotificationCard(notification) {
		const card = document.createElement('div');
		card.classList.add('card', 'mb-3');

		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');

		const cardText = document.createElement('p');
		cardText.classList.add('card-text');
		cardText.textContent = notification.message;
	
		const acceptBtn = document.createElement('button');
		acceptBtn.classList.add('btn', 'btn-outline-success', 'mr-2');
		acceptBtn.innerHTML = '&#10004;&#65039;';
		acceptBtn.addEventListener('click', function() {
			acceptNotification(notification);
		});

		const denyBtn = document.createElement('button');
		denyBtn.classList.add('btn', 'btn-outline-danger');
		denyBtn.innerHTML = '&#10060;';
		denyBtn.addEventListener('click', function() {
			denyNotification(notification);
		});

		cardBody.appendChild(cardText);
		cardBody.appendChild(acceptBtn);
		cardBody.appendChild(denyBtn);
		card.appendChild(cardBody);

		return card;
	}

	function renderNotifications() {
		const container = document.getElementById('notification-container');
		container.innerHTML = '';
		notifications.forEach(notification => {
			container.appendChild(createNotificationCard(notification));
		});
	}

	function addNotification(message) {
		const newNotification = {
			id: notifications.length + 1,
			message: message,
			type: 'info'
		};
		notifications.unshift(newNotification);
		renderNotifications();
	}

	function acceptNotification(notification) {
		const index = notifications.indexOf(notification);
		if (notification) {
			console.log(`Accepted: ${notification.message}`);
			notifications.splice(index, 1);
		}
		renderNotifications();
	}

	function denyNotification(notification) {
		const index = notifications.indexOf(notification);
		if (notification) {
			console.log(`Denied: ${notification.message}`);
			notifications.splice(index, 1);
		}
		renderNotifications();
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

		/* chat_form.addEventListener("submit", function(event) {
			event.preventDefault();

			let message = event.target.message.value;
			if (message)
			{

				notification_socket.send(JSON.stringify({
					"message": message,
				}))
			}
			chat_form.reset()
		}); */
	
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

	renderNotifications();
	connect()

	// TESTING - Adicionar Notificações
	setTimeout(function() {
		addNotification("Mensagem 1")
		setTimeout(function() {
			addNotification("Mensagem 2")
			setTimeout(function() {
				addNotification("Mensagem 3")
			}, 2000);
		}, 2000);
	}, 2000);

});
