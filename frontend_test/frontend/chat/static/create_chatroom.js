console.log("create_chatroom.js is %cActive", 'color: #90EE90')

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	user_id = -1

	// Após apertar o botão para criar uma Chat Room
	document.getElementById("roomCreateForm").addEventListener("submit", function(event) {
		event.preventDefault();

		const formData = new FormData(roomCreateForm);
		const jsonData = {};
		formData.forEach((value, key) => {
			jsonData[key] = value;
		});

		fetch("http://127.0.0.1:8000/chat/api/create_room", {
			credentials: 'include',
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(jsonData)
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			data_obj = data["message"]
			data_message = data_obj["message"]
			data_room_id = data_obj["room_id"]

			document.querySelector(".room_creation_status").innerHTML = "Status -> " +  data_message;

			console.log("====================================")
			console.log("Room Id: ", data_room_id)
			console.log("====================================")

			const jsonJoinRoomData = {
				"room_id": data_room_id,
				"user_id": user_id
			};

			fetch("http://127.0.0.1:8000/chat/api/add_user_to_chat_room", {
				credentials: 'include',
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(jsonJoinRoomData)
			})
				.then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					return response.json();
				})
				.then(data => {
					if (data)
					{
						console.log(data)
					}
					else
						console.log("Data is Empty")
				})
				.catch(error => {
					throw new Error("Create Room Fetch Error");
				});
		})
		.catch(error => {
			throw new Error("Create Room Fetch Error");
		});
	});

	async function logData()
	{
		const response = await fetch("http://127.0.0.1:8000/user/api/user_info", {
			credentials: 'include',
			method: 'GET'
		});
		const data = await response.json();

		if (data)
		{
			user_id = data['id'];
			user_indo_text = "ID: " + user_id + " | User: " + data['user']
			console.log("-------------------------")
			console.log("User With Active Login")
			console.log(user_indo_text)
			console.log("-------------------------")
		}
		else
			console.log("Nobody is with Login.");
	}
	logData();

	async function getAllUsersData()
	{
		const response = await fetch("http://127.0.0.1:8000/user/api/users_list", {
			credentials: 'include',
			method: 'GET'
		});
		const data = await response.json();

		if (data)
		{
			users_list = data[""]
			console.log(data["message"]);
		}
		else
			console.log("Data is empy.");
	}
	getAllUsersData();
});
