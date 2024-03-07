console.log("chatroom.js is %cActive", 'color: #90EE90')

_401ErrorPage = "<h1>Error 401</h1><p>Sorry, an error occurred. Please try again later.</p>";

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	function getRoomName()
	{
		const path = window.location.pathname;
		const parts = path.split('/');
		const room_id = parts[parts.indexOf('chatroom') + 1];

		fetch('http://127.0.0.1:8000/chat/api/get_room_name/' + room_id, {
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
						document.querySelector(".chatroom_name_title").innerHTML = dataRoomName + " ChatRoom";
						document.querySelector(".chatroom_name_header").innerHTML = dataRoomName + " ChatRoom";
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

});
