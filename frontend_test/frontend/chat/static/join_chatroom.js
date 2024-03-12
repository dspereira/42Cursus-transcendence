console.log("create_chatroom.js is %cActive", 'color: #90EE90')

document.addEventListener("DOMContentLoaded", function() {

	let selected_chatroom_option = "";
	let chage_to_selected_chatroom_checkbox = false;

	function getSelectedChatRoom()
	{
		const selectElement = document.getElementById('chatrooms_select');
		
		selectElement.addEventListener('change', function() {
			const selectedIndex = selectElement.selectedIndex;
			
			if (selectedIndex !== -1)
			{
				const selectedOption = selectElement.options[selectedIndex];
				selected_chatroom_option = selectedOption.value;
			}

		});
	}

	function buttonPress()
	{
		const selectElement = document.getElementById('join_button');

		selectElement.addEventListener('click', function() {

			status_output = "";
			if (selected_chatroom_option.length != 0)
				status_output = "Selected Room: " + selected_chatroom_option;
			else
				status_output = "Selecione uma Sala";
			console.log(status_output);
			document.querySelector(".status_join_chatroom").innerHTML = status_output;

			if (selected_chatroom_option.length != 0 && chage_to_selected_chatroom_checkbox)
				window.location.pathname = "/chat/chatroom/" + selected_chatroom_option + "/"
		});
	}

	function getSelectedChatRoomCheckboxStatus()
	{
		const checkbox = document.getElementById('chage_to_selected_chatroom_checkbox');

		checkbox.checked = false;
        checkbox.addEventListener('change', function()
		{
            if (checkbox.checked)
				chage_to_selected_chatroom_checkbox = true;
			else
				chage_to_selected_chatroom_checkbox = false;
			console.log("Status da CheckBox: ", chage_to_selected_chatroom_checkbox);
        });
	}

	getSelectedChatRoomCheckboxStatus();
	getSelectedChatRoom();
	buttonPress();
});
