console.log("list_tournaments.js is %cActive", 'color: #90EE90')

function list_tournaments()
{
	fetch("http://127.0.0.1:8000/api/tournament/list-tournaments", {
		credentials: 'include',
		method: "GET",
	})
	.then(response => {
		if (!response.ok) {
			console.log("No body in response")
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then(data => {
		//Create views for tournaments that display ALL tournaments, get them into an array as done in : /chat/list_rooms
		const select = document.getElementById("Tournament_list");
		rooms = data["Tournaments"];
		message = data["message"];

		// console.log(message, "--->", rooms, "<--- rooms... hopefully");

		if (rooms)
		{
			console.log("--------------------------")
			console.log("1 | 2 | 3 | 4")
			console.log("--------------------------")
			rooms.forEach(room => {
				console.log(`${room.first_place} | ${room.second_place} | ${room.third_place} | ${room.forth_place}`);
				console.log(`${room.player1} | ${room.player2} | ${room.player3} | ${room.player4}`);
				console.log(`${room.semi_final1} | ${room.semi_final2} | ${room.loser_bracket} | ${room.final}`);
				const option = document.createElement('option');
				option.value = 33;
				option.textContent = `${room.id}`;
				select.appendChild(option);
			});
			console.log("--------------------------");
			}
		})
	.catch(error => {
		console.log("PIAMSMASA")
		console.log("List Tournaments Fetch Error", error);
	});
}

document.addEventListener("DOMContentLoaded", function() {


	//dar add a button listener para cada fetch
	console.log("Pagina HTML totalmente carregada !")

	document.getElementById("list_button").addEventListener('click', () =>{
		list_tournaments();
	})

});
