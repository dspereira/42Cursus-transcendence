import { callAPI } from "../utils/callApiUtils.js";

const styles = `
.players {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.player {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
}

.profile-photo {
	width: 120px;
	height: auto;
	clip-path:circle();
}

.default-photo {
	width: 120px;
	height: auto;
	background-color: #7D8ABC;
	border: 5px solid #7D8ABC;
	border-radius: 50%;
	clip-path:circle();
}

.buttons {
	display: flex;
	justify-content: center;
	gap: 30px;
	margin-top: 50px;
}

.btn-success, .btn-cancel {
	width: 120px;
}

.border-separation {
	width: 60%;
	margin: 0 auto;
	margin-top: 50px;
	margin-bottom: 50px;
	border-bottom: 3px solid #EEEDEB;
}

.invites-section {
	display: flex;
	width: 100%;
	height: 50vh;
	gap: 10px;
}

.friend-list {
	width: 70%;
	background-color: #D3D3D3;
	border-radius: 5px;
	padding: 20px;
}

.invites-send {
	width: 30%;
	background-color: #D3D3D3;
	border-radius: 5px;
	padding: 20px;
}

.search-icon {
	position: absolute;
	margin-top: 6px;
	margin-left: 15px;
	font-size: 16px;
}

.search-bar input {
	padding-left: 40px;
}

.search-bar {
	margin-bottom: 25px;
}
`;

const getHtml = function(data) {
	const html = `
		<div class="players">
			<div class="player">
				<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
				<div class="username">waiting...</div>
			</div>
			<div class="player">
				<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
				<div class="username">waiting...</div>
			</div>
			
			<div class="player">
				<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
				<div class="username">waiting...</div>
			</div>
			<div class="player">
				<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
				<div class="username">waiting...</div>
			</div>
		</div>
		<div class="buttons">
			<button type="button" class="btn btn-success btn-success">Start</button>
			<button type="button" class="btn btn-danger btn-cancel">Cancel</button>
		</div>
		<div class="border-separation"></div>

		<div class="invites-section">
			<div class="friend-list">
				<div class="search-bar">
					<div class="form-group">
						<i class="search-icon bi bi-search"></i>
						<input type="text" class="form-control form-control-md" id="search" placeholder="Search friends..." maxlength="50">
					</div>
				</div>
				<div class="friends"></div>
			</div>
			<div class="invites-send">

			</div>
		</div>
	`;
	return html;
}

export default class TourneyLobby extends HTMLElement {
	static observedAttributes = ["tournament-id", "owner-id"];

	constructor() {
		super()
		this.data = {};
		this.intervalID = null;
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	disconnectedCallback() {
		if (this.intervalID)
			clearInterval(this.intervalID);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "tournament-id")
			name = "tournamentId";
		else if (name == "owner-id")
			name = "ownerId";
		this.data[name] = newValue;
	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html(this.data);
		if (styles) {
			this.elmtId = `elmtId_${Math.floor(Math.random() * 100000000000)}`;
			this.styles = document.createElement("style");
			this.styles.textContent = this.#styles();
			this.html.classList.add(`${this.elmtId}`);
		}
	}

	#styles() {
		if (styles)
			return `@scope (.${this.elmtId}) {${styles}}`;
		return null;
	}

	#html(data){
		return getHtml(data);
	}

	#render() {
		if (styles)
			this.appendChild(this.styles);
		this.appendChild(this.html);
	}

	#scripts() {
		this.#joinedPlayersPolling();
	}

	#setDefaultPhoto() {

	}

	#setProfilePhoto(elmHtml, playerData) {
		let img = elmHtml.querySelector("img");
		img.setAttribute("src", playerData.image);
		img.classList.remove("default-photo");
		img.classList.add("profile-photo");
		elmHtml.querySelector(".username").innerHTML = playerData.username;
		elmHtml.classList.add(`id-${playerData.id}`);
	}

	#updatePlayers(players) {
		const playersNodeList = this.html.querySelectorAll(".player");
		let player = null;

		if (!playersNodeList)
			return ;
		playersNodeList.forEach((elm, idx) => {
			if (idx >= players.length)
				return ;
			player = players[idx];
			if (!elm.classList.contains(`id-${player.id}`)) {
				this.#setProfilePhoto(elm, player);
			}
		});
	}

	#joinedPlayersCall() {
		callAPI("GET", `http://127.0.0.1:8000/api/tournament/players?id=${this.data.tournamentId}`, null, (res, data) => {
			if (res.ok) {
				if (data.players)
					this.#updatePlayers(data.players);
			}
		});
	}

	#joinedPlayersPolling() {
		this.intervalID = setInterval(() => {
			this.#joinedPlayersCall();
		}, 5000);
	}
}

customElements.define("tourney-lobby", TourneyLobby);
