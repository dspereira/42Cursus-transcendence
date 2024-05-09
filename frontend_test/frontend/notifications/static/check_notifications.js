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
		acceptBtn.classList.add('btn', 'btn-success', 'mr-2');
		acceptBtn.innerHTML = '&#10004;&#65039;';
		acceptBtn.addEventListener('click', function() {
			acceptNotification(notification);
		});

		const denyBtn = document.createElement('button');
		denyBtn.classList.add('btn', 'btn-danger');
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

	renderNotifications();

	// TESTING - Adicionar Notificações
	/* setTimeout(function() {
		addNotification("Mensagem 1")
		setTimeout(function() {
			addNotification("Mensagem 2")
			setTimeout(function() {
				addNotification("Mensagem 3")
			}, 2000);
		}, 2000);
	}, 2000); */

});
