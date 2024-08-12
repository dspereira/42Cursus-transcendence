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
}

.friend-list {
	width: 70%;
}

.invites-send {
	width: 30%;
}

`;

const getHtml = function(data) {
	const html = `
		<div class="players">
			<div class="player">
				<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
				<div>waiting...</div>
			</div>
			<div class="player">
				<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
				<div>waiting...</div>
			</div>
			
			<div class="player">
				<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
				<div>waiting...</div>
			</div>
			<div class="player">
				<div><img src="../img/default_profile.png" class="default-photo" alt="avatar"></div>
				<div>waiting...</div>
			</div>
		</div>
		<div class="buttons">
			<button type="button" class="btn btn-success btn-success">Start</button>
			<button type="button" class="btn btn-danger btn-cancel">Cancel</button>
		</div>
		<div class="border-separation"></div>

		<div class="invites-section">
			<div class="friend-list">

			</div>
			<div class="invites-send">

			</div>
		</div>


	`;
	return html;
}

export default class TourneyLobby extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	disconnectedCallback() {

	}

	attributeChangedCallback(name, oldValue, newValue) {
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

	}
}

customElements.define("tourney-lobby", TourneyLobby);
