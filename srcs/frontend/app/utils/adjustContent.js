import stateManager from "../js/StateManager.js";

export const adjustContent = function(content) {
	stateManager.addEvent("sidePanel", (state) => {
		if (content) {
			content.classList.remove("content-small");
			content.classList.remove("content-large");

			if (state === "open")
				content.classList.add("content-small");
			else if (state === "close")
				content.classList.add("content-large");
		}
	});
	stateManager.triggerEvent("sidePanel");   
}