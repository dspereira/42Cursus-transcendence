console.log("front_page.js is %cActive", 'color: #90EE90')




document.addEventListener("DOMContentLoaded", function() {

	console.log("Pagina HTML totalmente carregada !")
	
	document.getElementById("join_button").addEventListener('click', () => {
		console.log("join button has been pressed");
		input = get_number('game_id');
		check_id(input);
	});
});


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
	const tournament_input = document.getElementById(id).value;

		if (tournament_input < 0) {
			console.log("No number entered. Please provide a valid number.");
			alert("Please enter a valid id.");
			return 0; // Exit the function early if the input is invalid
		}

	return tournament_input
}