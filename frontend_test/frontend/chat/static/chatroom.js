console.log("chatroom.js is %cActive", 'color: #90EE90')

_401ErrorPage = "<h1>Error 401</h1><p>Sorry, an error occurred. Please try again later.</p>";

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	function getRoomName()
	{
		const path = window.location.pathname;
		const parts = path.split('/');
		const room_id = parts[parts.indexOf('chatroom') + 1];

		api_request_url = 'http://127.0.0.1:8000/chat/api/get_room_name/' + '?room_id=' + room_id

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
					console.log("----------------------");
					console.log(data);
					console.log("----------------------");
					
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
	getRoomName();

	function getSessionId()
	{
		const cookies = document.cookie;
		const cookieArray = cookies.split(';');
		let sessionId = null;
		for (let i = 0; i < cookieArray.length; i++) {
			const cookie = cookieArray[i].trim();
			if (cookie.startsWith('session_id=')) {
				sessionId = cookie.substring('session_id='.length);
				break;
			}
		}
		return (sessionId)		
	}
	console.log(getSessionId());

	async function logData() 
	{
		const response = await fetch("http://127.0.0.1:8000/user/api/test", {
			credentials: 'include',
			method: 'GET'
		});
		const data = await response.json();
		console.log(data);
		if (data && data["user"])
			document.querySelector(".user_data").innerHTML = "User Loged: " +  data["user"];
		else
			document.querySelector(".user_data").innerHTML = "User Loged: Anonymous User";
	}
	logData();

});
