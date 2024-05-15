console.log("list_tournaments.js is %cActive", 'color: #90EE90')




document.addEventListener("DOMContentLoaded", function() {


	//dar add a button listener para cada fetch
	console.log("Pagina HTML totalmente carregada !")
	
	document.getElementById("list_button").addEventListener('click', () =>{
		console.log("list button has been pressed");
		flushSelectOptions();
		list_tournaments();
	});
	document.getElementById("read_number_button").addEventListener('click', () => {
		console.log("read button has been pressed");
		flushSelectOptions();
		send_invite();
	});
	document.getElementById("create_button").addEventListener('click', () =>{
		console.log("create button has been pressed");
		flushSelectOptions();
		create_tournament();
	});
	document.getElementById("update_button").addEventListener('click', () => {
		console.log("update button has been pressed");
		flushSelectOptions();
		update_tournament();
	});

});


function update_tournament() {
	
	const tournament_input = document.getElementById('tournament_id').value;

	if (!tournament_input) {
		console.log("No number entered. Please provide a valid number.");
		alert("Please enter a tournament id before requesting the update.");
		return; // Exit the function early if the input is invalid
	}

	fetch("http://127.0.0.1:8000/api/tournament/update-tournament", {
		credentials: 'include',
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			tournament_id: tournament_input
		})
	})
	.then(response => {
		if (!response.ok) {
			console.log("No body in response")
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then ((data) => {

		const select = document.getElementById("Tournament_list");

		const option = document.createElement('option');
		option.value = 1
		option.textContent = data["message"];

		select.appendChild(option)

	})
	.catch(error => {
		console.log("Invite to Tournament Fetch Error", error);
	});
}

function create_tournament(){
	fetch("http://127.0.0.1:8000/api/tournament/create-tournament", {
		credentials: 'include',
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		}
		})
		.then(response => {
			if (!response.ok) {
				console.log("No body in response")
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then ((data) => {

			const select = document.getElementById("Tournament_list");

			const option = document.createElement('option');
			option.value = data["tournament_id"];
			console.log("Tournament id:", data["tournament_id"])
			option.textContent = data["message"] + "    id: " + data["tournament_id"];

			select.appendChild(option)

		})
		.catch(error => {
			console.log("Create Tournament Fetch Error", error);
		});
}


function send_invite() {
	const number_input = document.getElementById('invite_id').value;
	const tournament_input = document.getElementById('tournament_id').value;

	if (!number_input || !tournament_input) {
		console.log("No number entered. Please provide a valid number.");
		alert("Please enter an id before sending the invite.");
		return; // Exit the function early if the input is invalid
	}

	fetch("http://127.0.0.1:8000/api/tournament/invite-tournament", {
		credentials: 'include',
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			invitee: number_input,
			tournament_id: tournament_input
		})
	})
	.then(response => {
		if (!response.ok) {
			console.log("No body in response")
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then ((data) => {

		const select = document.getElementById("Tournament_list");

		const option = document.createElement('option');
		option.value = 1
		option.textContent = data["message"];

		select.appendChild(option)

	})
	.catch(error => {
		console.log("Invite to Tournament Fetch Error", error);
	});
}

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
				console.log("--------------------------");
				const option = document.createElement('option');
				option.value = 33;
				option.textContent = `${room.id} winner ${room.first_place}`;
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

function flushSelectOptions() {
	const selectElement = document.querySelector('.form-select');
	if (selectElement) {
		while (selectElement.options.length > 0) {
			selectElement.remove(0);
		}
	}
}
