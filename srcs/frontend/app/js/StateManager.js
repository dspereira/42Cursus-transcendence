const globalEvents = ["isLoggedIn", "chatSocket", "tournamentId", "idBrowser", "friendIdInvitedFromChat"];

class StateManager {

	constructor() {
		if (StateManager.instance) {
			return StateManager.instance;
		}

		this.states = {
			sidePanel: "open",
			pageReady: false, // remover o page ready
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
			inviteToPlayFriendID: null,
			hasFriendInvite: null,
			removeFriendIdFromChat: null,
			csrfToken: null
		}
		this.stateEvents = {
			sidePanel: [],
			pageReady: [],
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
			inviteToPlayFriendID: [],
			hasFriendInvite: [],
			removeFriendIdFromChat: [],
			csrfToken: []
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


	// Fazer um loop e passar por todos os eventos e estados
	cleanAllStatesAndEvents() {
		this.states.sidePanel = "open";
		this.states.pageReady = false,
		this.states.friendChatId = null;
		this.states.newChatMessage = null;
		this.states.chatMessagesCounter = 0;
		this.states.userId = null;
		this.states.idBrowser = null;
		this.states.chatUserData = null;
		this.states.userImage =  null;
		this.states.messageSend = null;
	}
}

const stateManager = new StateManager();

// prevent to add new methods or attributes
Object.freeze(stateManager);
export default stateManager;
