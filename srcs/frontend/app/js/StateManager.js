const globalEvents = ["isLoggedIn"];

class StateManager {

	constructor() {
		if (StateManager.instance) {
			return StateManager.instance;
		}

		this.states = {
			sidePanel: "open",
			pageReady: false,
			isLoggedIn: false,
			friendChatId: null,
			newChatMessage: null,
		}
		this.stateEvents = {
			sidePanel: [],
			pageReady: [],
			isLoggedIn: [],
			friendChatId: [],
			newChatMessage: [],
		}

		StateManager.instance = this;
	}

	getState(name) {
		return this.states[name];
	}

	setState(name, value) {
		if (this.states.hasOwnProperty(name)) {
			this.states[name] = value;
			this.triggerEvent(name);
		}
	}

	addEvent(event, callback) {
		if (this.stateEvents[event]) {
			this.stateEvents[event].push(callback);
		}
	}

	triggerEvent(event) {
		const stateValue = this.states[event];
		if (this.stateEvents[event])
			this.stateEvents[event].forEach(callback => callback(stateValue));
	}

	cleanEvents() {

		for (const key in this.stateEvents) {
			if (!globalEvents.includes(key))
				this.stateEvents[key] = [];
		}
	}
}

const stateManager = new StateManager();

// prevent to add new methods or attributes
Object.freeze(stateManager);
export default stateManager;
