console.log("chatroom.js is %cActive", 'color: #90EE90')

_401ErrorPage = "<h1>Error 401</h1><p>Sorry, an error occurred. Please try again later.</p>";

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	let selected_user_id = "";
	let selected_user_name = "";
	let user_chatrooms_txt_area = document.querySelector(".user_chatrooms_txt_area");

	user_chatrooms_txt_area.value = ""

	function listAllUsers() {
		fetch("http://127.0.0.1:8000/api/auth/users_list", {
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

	function getSelectedUser()
	{
		const selectElement = document.querySelector('.show_all_users');

		selectElement.addEventListener('change', function() {
			const selectedIndex = selectElement.selectedIndex;
			
			if (selectedIndex !== -1)
			{
				const selectedOption = selectElement.options[selectedIndex];
				selected_user_id = selectedOption.value;
				selected_user_name = selectedOption.textContent.trim();
			}
		});
	}

	async function getUserChatRooms()
	{
		const request_url = "http://127.0.0.1:8000/api/chat/get_user_chat_rooms/"
		let query_params = {
			"user_id": selected_user_id,
		};

		const params_count = Object.keys(query_params).length;
		let counter = 0

		if (!query_params)
			final_url = request_url;
		else
		{
			final_url = request_url + "?";
			for (let key in query_params)
			{
				if (query_params.hasOwnProperty(key))
				{
					final_url += key + "=" + encodeURIComponent(query_params[key]);
					if (params_count > 1 && counter < params_count - 1)
						final_url += "&";
					counter++;
				}
			}
		}

		const response = await fetch(final_url, {
				credentials: 'include',
				method: 'GET'
		});
		const data = await response.json();

		if (data)
		{
			user_chatrooms_txt_area.value = ""
			
			chatrooms_count = data["chatrooms_count"]
			if (chatrooms_count)
			{
				chatrooms_list = data["user_chatrooms"]	
				chatrooms_list.forEach(room => {
					user_chatrooms_txt_area.value += "Room: " + room.room_name + " | ID: " + room.room_id + "\n";
				});
			}
			else if (data["status"] == 200) 
				user_chatrooms_txt_area.value = "The user does not have any ChatRooms associated with him."
			else
				user_chatrooms_txt_area.value = "Please select a valis user."
		}
		else
			console.log("Nobody is with Login.");
	}

	function buttonPress()
	{
		const selectElement = document.querySelector('.check_user_chatrooms');

		selectElement.addEventListener('click', function() {
			getUserChatRooms();
		});
	}

	listAllUsers();
	listChatRooms();
	getSelectedUser();
	buttonPress();
});
