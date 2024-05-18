console.log("front_page.js is %cActive", 'color: #90EE90')




document.addEventListener("DOMContentLoaded", function() {


	//dar add a button listener para cada fetch
	console.log("Pagina HTML totalmente carregada !")
	
	// document.getElementById("list_button").addEventListener('click', () =>{
	// 	console.log("list button has been pressed");
	// 	flushSelectOptions();
	// 	// list_tournaments();
	// });

});

function flushSelectOptions() {
	const selectElement = document.querySelector('.form-select');
	if (selectElement) {
		while (selectElement.options.length > 0) {
			selectElement.remove(0);
		}
	}
}