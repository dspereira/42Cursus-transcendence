const globalEvents = ["isLoggedIn", "chatSocket", "tournamentId", "idBrowser", "friendIdInvitedFromChat"];

class StateManager {

	constructor() {
		if (StateManager.instance) {
			return StateManager.instance;
		}

		this.states = {
			sidePanel: "open",
			isLoggedIn: null,   // realy change when user logout and not when chage refresh token
			friendChatId: null,
			newChatMessage: null,
			chatMessagesCounter: 0,
			userId: null,
			username: null,
			chatSocket: null,
			idBrowser: null,
			chatUserData: null,
			userImage: null,
			messageSend: null,
			onlineStatus: null,
			blockStatus: null,
			gameStatus: null,
			lobbyStatus: null,
			gameTimeToStart: null,
			gameWinner: null,
			hasLobbyEnded: null,
			hasRefreshToken: null,
			gameSocket: null,
			isTournamentChanged: null,
			tournamentGameLobby: null,
			tournamentId: null,
			isChatMsgReadyToSend: null,
			errorMsg: null,
			friendIdInvitedFromChat: null,
			hasFriendInvite: null,
			removeFriendIdFromChat: null,
			inviteToPlayFriendID: null,
			hasFriendInvite: null,
			removeFriendIdFromChat: null,
			isOnline: navigator.onLine
		}

		this.stateEvents = {
			sidePanel: [],
			isLoggedIn: [],
			friendChatId: [],
			newChatMessage: [],
			chatMessagesCounter: [],
			userId: [],
			username: [],
			chatSocket: [],
			idBrowser: [],
			chatUserData: [],
			userImage: [],
			messageSend: [],
			onlineStatus: [],
			blockStatus: [],
			gameStatus: [],
			lobbyStatus: [],
			gameTimeToStart: [],
			gameWinner: [],
			hasLobbyEnded: [],
			hasRefreshToken: [],
			gameSocket: [],
			isTournamentChanged: [],
			tournamentGameLobby: [],
			finishedTournament: [],
			tournamentId: [],
			isChatMsgReadyToSend: [],
			errorMsg: [],
			friendIdInvitedFromChat: [],
			hasFriendInvite: [],
			removeFriendIdFromChat: [],
			inviteToPlayFriendID: [],
			hasFriendInvite: [],
			removeFriendIdFromChat: [],
			isOnline: []
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

	cleanStateEvents(name) {
		if (name)
			this.stateEvents[name] = [];
	}

	// DEBUG
	showAllStates() {
		Object.entries(this.states).forEach(([key, value]) => {
			console.log(`${key}: ${value}`);
		});
	}

	cleanAllStatesAndEvents() {	
		for (let key in this.states)
			this.states[key] = null;
		this.states.chatMessagesCounter = 0;
		this.states.sidePanel = "open";
		this.states.isLoggedIn = false;
		this.states.isOnline = navigator.onLine;
	}
}

const stateManager = new StateManager();

// prevent to add new methods or attributes
Object.freeze(stateManager);
export default stateManager;
