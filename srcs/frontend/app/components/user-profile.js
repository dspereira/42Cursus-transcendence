import {callAPI} from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";

const styles = `

	.profile-grid-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10px;
		background: #9F9F9F;
	}

	.profile-info {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.profile-picture {
		width: 180px;
		height: 180px;
		clip-path: circle();
		object-fit: cover;
		margin-top: 15px;
		margin-bottom: 15px;
	}

	.username-container {
		display: flex;
		gap: 15px;
	}

	.username {
		font-size: 32px;
	}

	.icon-add {
		font-size: 16px;
	}
	
	.game-stats {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 21px;
		margin-top: 25px;
	}

	.win-rate-bar {
		width: 150px;
		height: 20px;
		border-radius: 15px;
	}

	.wins-losses {
		display: flex;
		gap: 75px;
	}

	.bio-box {
		text-overflow: ellipsis;
		border: 2px solid #000;
		border-radius: 15px;
		background-color: #E7E7E7;
		font-size: 21px;
		width: 85%;
		margin-bottom: 10px;
		text-align: center;
	}
	
`;

const getHtml = function(data) {
	
	
	
	// Verificar se é amigo ou não é amigo e trocar os botões
	let addFriendBtn = "";
	if (stateManager.getState("username") != data.username)
		addFriendBtn = `<button class="btn btn-success"><i class="icon-add bi bi-person-plus"></i></button>`;



	const html = `
		<div class="profile-grid-container">
			<div class="profile-info">
				<div>
					<img class="profile-picture" src="" alt="Profile Picture">
				</div>
				<div class="username-container">
					<h1 class="username"></h1>
					${addFriendBtn}
				</div>
			</div>
			<div class="game-stats">
				<div id="win-rate-bar" class="win-rate-bar"></div>
				<div class="wins-losses">
					<p class="wins"></p>
					<p class="losses"></p>
				</div>
				<p class="tournements-won"></p>
			</div>
			<div class="bio-box">
				<span class="bio"></span>
			</div>
		</div>
	`;

	return html;
}

export default class UserProfile extends HTMLElement {
	static observedAttributes = ["username"];

	constructor() {
		super();
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
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
		this.#getProfileInfo();
	}

	#getProfileInfo() {
		callAPI("GET", `http://127.0.0.1:8000/api/profile/?username=${this.data.username}`, null, (res, resData) => {
			if (res.ok && resData && resData.data) {
				const data = resData.data;
				this.#updateProfile(data);
			}
		});
	}

	#updateProfile(data) {
		this.#updateImage(data.image_url);
		this.#updateUsername(data.username);
		this.#updateBio(data.bio);
		this.#updateWinRate(data.victories, data.defeats, data.win_rate, data.total_games);
		this.#updateTournaments(data.tournaments_won);
	}

	#updateImage(image_url) {
		const htmlElement = this.html.querySelector('.profile-picture');
		if (htmlElement)
			htmlElement.src = image_url;
	}

	#updateUsername(username) {
		const htmlElement = this.html.querySelector('.username');
		if (htmlElement)
			htmlElement.textContent = username;
	}

	#updateBio(bio) {
		const htmlElement = this.html.querySelector('.bio');
		if (htmlElement)
			htmlElement.textContent = bio;
	}

	#updateWinRate(wins, losses, win_rate, total_games) {
		const winsElement = this.html.querySelector('.wins');
		const lossesElement = this.html.querySelector('.losses');
		const winRateBarElement = this.html.querySelector('#win-rate-bar');

		if (winsElement)
			winsElement.textContent = `W: ${wins}`;
		if (lossesElement) {
			lossesElement.textContent = `L: ${losses}`;
		}
		if (winRateBarElement) {
			if (!total_games)
				winRateBarElement.style.background = `linear-gradient(to right, blue 0%, red 100%)`;
			else if (!win_rate)
				winRateBarElement.style.background = `red`;
			else
				winRateBarElement.style.background = `linear-gradient(to right, blue ${win_rate}%, red ${win_rate}%)`;
		}
	}

	#updateTournaments(tournaments) {
		const htmlElement = this.html.querySelector('.tournements-won');
		if (htmlElement)
			htmlElement.textContent = `Tournements won: ${tournaments}`;
	}
}

customElements.define("user-profile", UserProfile);
