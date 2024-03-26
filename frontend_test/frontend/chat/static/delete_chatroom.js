console.log("delete_chatroom.js is %cActive", 'color: #90EE90')

document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")

	// Após apertar o botão para criar uma Chat Room
	document.getElementById("roomDeleteForm").addEventListener("submit", function(event) {
		event.preventDefault();

		const formData = new FormData(roomDeleteForm);
		const jsonData = {};
		formData.forEach((value, key) => {
			jsonData[key] = value;
		});
		
		fetch("http://127.0.0.1:8000/api/chat/delete_room", {
			credentials: 'include',
			method: "DELETE",
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
			document.querySelector(".room_deletion_status").innerHTML = "Status -> " +  data["message"];
		})
		.catch(error => {
			throw new Error("Delete Room Fetch Error");
		});
	});
	
	document.getElementById("deleteAllRooms").addEventListener("click", function(event) {
		event.preventDefault();

		const formData = new FormData(roomDeleteForm);
		const jsonData = {};
		formData.forEach((value, key) => {
			jsonData[key] = value;
		});

		fetch("http://127.0.0.1:8000/api/chat/delete_all_rooms", {
			credentials: 'include',
			method: "DELETE",
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
			document.querySelector(".room_deletion_status").innerHTML = "Status -> " +  data["message"];
		})
		.catch(error => {
			throw new Error("Delete All Rooms Fetch Error");
		});
	});
});
