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
			document.querySelector(".room_creation_status").innerHTML = "Status -> " +  data["message"];
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

		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
		console.log(data);
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

		if (data)
		{
			console.log("ID: " + data['id']);
			console.log("User: " + data['user']);
		}
		else
			console.log("Nobody is with Login.");
	}
	logData();

});
