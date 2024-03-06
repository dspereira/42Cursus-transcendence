console.log("index.js is %cActive", 'color: #90EE90')

document.addEventListener("DOMContentLoaded", function() {

	// Após apertar o botão para criar uma Chat Room
	document.getElementById("roomCreateForm").addEventListener("submit", function(event) {
		event.preventDefault();
	
		const formData = new FormData(roomCreateForm);
		const jsonData = {};
		formData.forEach((value, key) => {
			jsonData[key] = value;
		});
	
		console.log("-----------------------------");
		console.log(jsonData);
		console.log("-----------------------------");

		/* fetch("http://127.0.0.1:8000/user/api/login", {
			credentials: 'include',
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(jsonData)
		})
		.then(response => data = response.json())
		.then (data => {
			console.log("=========================");
			console.log(`message	: ${data["message"]}`);
	
			const msgElm = document.querySelector(".message");
			msgElm.classList.remove("displayNone");
			msgElm.classList.remove("success");
			msgElm.classList.remove("error");
			msgElm.innerHTML = data["message"];
			if (data["success"] == "true")
				msgElm.classList.add("success");
			else if (data["success"] == "false")
				msgElm.classList.add("error");
		})
		.catch(error => {
			console.log("Login fetch Error");
		});*/
	});

});
