console.log("chatroom.js is %cActive", 'color: #90EE90')

_401ErrorPage = "<h1>Error 401</h1><p>Sorry, an error occurred. Please try again later.</p>";

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	const path = window.location.pathname;
	const parts = path.split('/');
	const room_id = parts[parts.indexOf('chatroom') + 1];

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
			user_id = data['id'];
			console.log("User ID -> ", user_id);
			console.log("User    -> ", data['user']);

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
