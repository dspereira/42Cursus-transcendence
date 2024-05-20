console.log("game_create.js is %cActive", 'color: #90EE90')




document.addEventListener("DOMContentLoaded", function() {

	document.getElementById("create_button").addEventListener('click', () =>{
		console.log("create button has been pressed");
		input = get_number('invitee_id');
		flushSelectOptions();
		create_game(input);
	});

	document.getElementById("join_button").addEventListener('click', () => {
		console.log("join button has been pressed");
		input = get_number('game_id');
		check_id(input);
	});
});


function create_game(invitee_id){
	fetch("http://127.0.0.1:8000/api/game/create-game", {
		credentials: 'include',
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			invitee: invitee_id,
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

		const select = document.getElementById("game_list");

		const option = document.createElement('option');
		option.value = data["game_id"];
		console.log("game id:", data["game_id"])
		option.textContent = data["message"] + "    id: " + data["game_id"];

		select.appendChild(option)
	})
	.catch(error => {
		console.log("failed to create game:", error);
	});
}

function check_id(id){
	fetch("http://127.0.0.1:8000/api/game/check-id", {
		credentials: 'include',
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			game_id: id,
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
		if (data["message"] == "Valid id" )
		{
			localStorage.setItem('game_id', id);
			window.location.assign('http://127.0.0.1:8080/game/game/');
		}
		else
		alert("Invalid id")
	})
	.catch(error => {
		console.log("failed to create game:", error);
	});
}


function get_number(id)
{
	const game_input = document.getElementById(id).value;

		if (game_input < 0) {
			console.log("No number entered. Please provide a valid number.");
			alert("Please enter a valid id.");
			return 0; // Exit the function early if the input is invalid
		}

	return game_input
}

function flushSelectOptions() {
	const selectElement = document.querySelector('.form-select');
	if (selectElement) {
		while (selectElement.options.length > 0) {
			selectElement.remove(0);
		}
	}
}
