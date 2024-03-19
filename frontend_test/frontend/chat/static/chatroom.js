console.log("chatroom.js is %cActive", 'color: #90EE90')

_401ErrorPage = "<h1>Error 401</h1><p>Sorry, an error occurred. Please try again later.</p>";

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	const path = window.location.pathname;
	const parts = path.split('/');
	const room_id = parts[parts.indexOf('chatroom') + 1];

	const chat_form = document.querySelector(".myChatForm")

	let logged_user_id = null
	let logged_user_name = null
	
	function connect() {
		
		console.log("URL WebSocket")
		result_str = "ws://127.0.0.1:8000/chat_connection/" + room_id + "/";
		console.log(result_str);

		chatSocket = new WebSocket(result_str);

		chatSocket.onopen = function(e) {
			console.log("Successfully connected to the WebSocket.");
		}

		chatSocket.onclose = function(e) {
			console.log("WebSocket connection closed unexpectedly. Trying to reconnect in 2s...");
			setTimeout(function() {
				console.log("Reconnecting...");
				connect();
			}, 2000);
		};

		chat_form.addEventListener("submit", function(event) {
			event.preventDefault();
	
			let messasge = event.target.message.value;
			chatSocket.send(JSON.stringify({
				"message": messasge,
			}))
			chat_form.reset()
		});

		chatSocket.onmessage = function(e) {
			const data = JSON.parse(e.data);
			console.log(data);
	
			switch (data.type) {
				case "chat_message":
					chat_log = data.user + ": " + data.message;
					console.log(chat_log)
					// chatLog.value += data.user + ": " + data.message + "\n";
					break;
				default:
					console.error("Unknown message type!");
					break;
			}
	
			// scroll 'chatLog' to the bottom
			// chatLog.scrollTop = chatLog.scrollHeight;
		};

		chatSocket.onerror = function(err) {
			console.log("WebSocket encountered an error: " + err.message);
			console.log("Closing the socket.");
			chatSocket.close();
		}
	}

	function getRoomName()
	{
		api_request_url = 'http://127.0.0.1:8000/chat/api/get_chat_room/' + '?room_id=' + room_id

		fetch(api_request_url, {
			credentials: 'include',
			method: "GET",
		})
		.then(response => data = response.json())
		.then(data => {

			if (data)
			{
				if (data.status != 401)
				{
					// console.log("----------------------");
					// console.log(data);
					// console.log("----------------------");
					
					dataMessage = data["message"];
					dataExist = data["exist"];
					dataRoomName = data["room_name"];
					console.log("Message:\n", dataMessage);
					console.log("Exist: ", dataExist);
					console.log("Room Name: ", dataRoomName);
					
					if (dataExist)
						document.querySelector(".chatroom_name_title").innerHTML = "ChatRoom -> " + dataRoomName;
						document.querySelector(".chatroom_name_header").innerHTML = "ChatRoom -> " + dataRoomName;
				}
				else if (data.status === 401)
					document.querySelector(".myBody").innerHTML = _401ErrorPage;
				connect();
			}
		})
		.catch(error => {
			console.error(error)
		});
	}

	async function user_have_chatroom_access()
	{
		const response = await fetch("http://127.0.0.1:8000/user/api/user_info", {
			credentials: 'include',
			method: 'GET'
		});
		const data = await response.json();
		if (data && data['id'] && data['user'])
		{
			logged_user_id = data['id'];
			logged_user_name = data['user'];
			console.log("User ID -> ", logged_user_id);
			console.log("User    -> ", logged_user_name);

			url = "http://127.0.0.1:8000/chat/api/check_user_chat_room_access/";
			query_params = "?user_id=" + data['id'] + "&room_id=" + room_id;
			request_url= url + query_params;

			const response = await fetch(request_url, {
				credentials: 'include',
				method: 'GET'
			});
			const data_room = await response.json();
			if (data_room && data_room["status"] === 200)
				getRoomName();
			else
				document.querySelector(".myBody").innerHTML = _401ErrorPage;;
		}
		else
			document.querySelector(".myBody").innerHTML = _401ErrorPage;;
	}

	user_have_chatroom_access()
});
