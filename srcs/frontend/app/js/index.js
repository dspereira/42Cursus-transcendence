import {router, setHistoryEvents} from "./router.js"

document.addEventListener('DOMContentLoaded', () => {
	router();
	setHistoryEvents();
});