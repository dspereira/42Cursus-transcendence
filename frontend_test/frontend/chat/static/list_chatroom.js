console.log("list_chatroom.js is %cActive", 'color: #90EE90')

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	function listChatRooms()
	{
		fetch("http://127.0.0.1:8000/chat/api/list_rooms", {
			credentials: 'include',
			method: "GET",
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {

			const select = document.getElementById('chatrooms_select');
			rooms = data["ChatRooms"];
			message = data["message"];

			console.log(message);

			if (rooms.length > 0)
			{
				console.log("--------------------------")
        		rooms.forEach(room => {
					console.log("ID:", room.id);
            		console.log("Nome:", room.name);
            		console.log("Online:", room.online);
					console.log("--------------------------")
					const option = document.createElement('option');
					option.value = room.id;
					option.textContent = room.name + " -> " + room.online;
					select.appendChild(option);
        		});
			}
		})
		.catch(error => {
			throw new Error("List Rooms Fetch Error");
		});
	}
	listChatRooms();
});
