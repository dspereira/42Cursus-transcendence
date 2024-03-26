document.addEventListener("DOMContentLoaded", function() {
    console.log("Pagina HTML totalmente carregada !");

	let selected_chatroom_id = "";
	let selected_user_id = "";

    function listChatRooms() {
		fetch("http://127.0.0.1:8000/api/chat/list_rooms", {
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
			const selects = document.getElementsByClassName("show_all_chatrooms");	
			const rooms = data["ChatRooms"];
			const message = data["message"];
	
			console.log(message);
	
			if (rooms.length > 0) {
				console.log("--------------------------");
				console.log("ID | NAME | ONLINE");
				console.log("--------------------------");
				rooms.forEach(room => {
					console.log(`${room.id} | ${room.name} | ${room.online}`);
					Array.from(selects).forEach(select => {
						const option = document.createElement('option');
						option.value = room.id;
						option.textContent = `${room.name} | ${room.online}`;
						select.appendChild(option);
					});
				});
				console.log("--------------------------");
			}
		})
		.catch(error => {
			console.error("Error fetching chat rooms:", error);
		});
	}

	function listAllUsers() {
		fetch("http://127.0.0.1:8000/user/api/users_list", {
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
			const selects = document.getElementsByClassName("show_all_users");	
			const users = data["users_list"];
			const users_count = data["users_count"];
			const message = data["message"];
	
			console.log(message);
	
			if (users_count > 0) {
				console.log("--------------------------");
				console.log("ID | NAME | ONLINE");
				console.log("--------------------------");
				users.forEach(user => {
					console.log(`${user.id} | ${user.username}`);
					Array.from(selects).forEach(select => {
						const option = document.createElement('option');
						option.value = user.id;
						option.textContent = `${user.username}`;
						select.appendChild(option);
					});
				});
				console.log("--------------------------");
			}
		})
			.catch(error => {
			console.error("Error fetching chat rooms:", error);
		});
	}

	function getSelectedUser()
	{
		const selectElement = document.querySelector('.show_all_users');

		selectElement.addEventListener('change', function() {
			const selectedIndex = selectElement.selectedIndex;
			
			if (selectedIndex !== -1)
			{
				const selectedOption = selectElement.options[selectedIndex];
				selected_user_id = selectedOption.value;
			}
		});
	}

	function getSelectedChatRoom()
	{
		const selectElement = document.querySelector('.show_all_chatrooms');

		selectElement.addEventListener('change', function() {
			const selectedIndex = selectElement.selectedIndex;
			
			if (selectedIndex !== -1)
			{
				const selectedOption = selectElement.options[selectedIndex];
				selected_chatroom_id = selectedOption.value;
			}
		});
	}

	async function addUserToChatRoom()
	{
		let jsonJoinRoomData = {
			"room_id": selected_chatroom_id,
			"user_id": selected_user_id
		};

		const response = await fetch("http://127.0.0.1:8000/api/chat/add_user_to_chat_room", {
			credentials: 'include',
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(jsonJoinRoomData)
		});
		const data = await response.json();

		if (data)
		{
			console.log(data["message"])
		}
		else
			console.log("Data is Empty")
	}

	function addUserToChatRoomButton()
	{
		const selectElement = document.querySelector('.add_user_to_chatroom');

		selectElement.addEventListener('click', function() {
			addUserToChatRoom();
		});
	}

	listChatRooms();
	listAllUsers();
	getSelectedChatRoom();
	getSelectedUser();
	addUserToChatRoomButton();
});
