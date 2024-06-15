const globalEvents = ["isLoggedIn", "refreshChatSocket"];

class StateManager {

	constructor() {
		if (StateManager.instance) {
			return StateManager.instance;
		}

		this.states = {
			sidePanel: "open",
			pageReady: false,
			isLoggedIn: null,
			friendChatId: null,
			newChatMessage: null,
			chatMessagesCounter: 0,
			userId: null,
			refreshChatSocket: null,
		}
		this.stateEvents = {
			sidePanel: [],
			pageReady: [],
			isLoggedIn: [],
			friendChatId: [],
			newChatMessage: [],
			chatMessagesCounter: [],
			userId: [],
			refreshChatSocket: [],
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

	// DEBUG
	showAllStates() {
		Object.entries(this.states).forEach(([key, value]) => {
			console.log(`${key}: ${value}`);
		});
	}
}

const stateManager = new StateManager();

// prevent to add new methods or attributes
Object.freeze(stateManager);
export default stateManager;
