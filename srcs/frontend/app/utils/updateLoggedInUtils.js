import stateManager from "../js/StateManager.js";

const updateLoggedInStatus = function(state) {
	if (state != stateManager.getState("isLoggedIn")) {
		stateManager.setState("isLoggedIn", state);
		localStorage.setItem("isLoggedIn", `${state}`);
	}
} 

export default updateLoggedInStatus;
