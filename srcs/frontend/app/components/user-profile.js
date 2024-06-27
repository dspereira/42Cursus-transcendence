import {callAPI} from "../utils/callApiUtils.js";


const styles = `

	.profile-grid-container {
		display: flex;
		flex-direction: column;
		/* margin-right: 150px;
		padding: 5px 10px; */
		border-radius: 10px;
		background: grey;
		width: 250px;
	}

	.profile-picture-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.profile-picture {
		width: 100px;
		height: auto;
		clip-path: circle;
	}

	.button-container {
		display: flex;
		gap: 5px;
		/* margin-top: 5px; */
	}

	.button-container button {
		/* padding: 2px 5px; */
		border: none;
		border-radius: 10px;
		cursor: pointer;
		font-size: 14px;
	}

	.add-friend-button {
		background-color: #4CAF50;
		color: white;
	}

	.block-user-button {
		background-color: #f44336;
		color: white;
	}
	
	.user-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 21px;
	}

	.user-info h1{
		font-size: 32px;
	}

	.win-rate-bar {
		width: 150px;
		height: 20px;
		border-radius: 15px;
	}

	.bio-box {
		display: flex;
		justify-content: center;
		text-overflow: ellipsis;
		/* padding: 7px; */
		border: 2px solid #000;
		border-radius: 15px;
		background-color: #f0f0f0;
		font-size: 21px;
	}
	
`;

const getHtml = function(data) {

	const html = `
		<div class="profile-grid-container">
			<div class="grid-item profile-picture-container">
				<img class="profile-picture" src="" alt="Profile Picture">
				<div class="button-container">
					<button class="add-friend-button">Add Friend</button>
					<button class="block-user-button">Play Game</button>
				</div>
			</div>
			<div class="grid-item">
				<div class="user-info">
					<h1 class="username"></h1>
					<p class="wins"></p>
						<div id="win-rate-bar" class="win-rate-bar"></div>
					<p class="losses"></p>
					<p class="tournements-won"></p>
				</div>
			</div>
			<div class="grid-item">
				<div class="bio-box">
					<span class="bio">A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy</span>
				</div>
			</div>
		</div>
	`;

	return html;
}

export default class UserProfile extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super();
	}

	connectedCallback() {
		this.#initComponent();
		this.#render();
		this.#scripts();
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

		this.#getUserInfo()

	}

	#getUserInfo() {
		callAPI("GET", "http://127.0.0.1:8000/api/profile/", null, (res, data) => {
			this.#updateProfile(data);
		});
	}

	#updateProfile(data) {
		this.#updateImage(data.image_url);
		this.#updateUsername(data.username);
		/* this.#updateBio(data.bio); */
		this.#updateWinRate(data.victories, data.defeats, data.win_rate);
		this.#updateTournaments(data.tournaments_won);
	}

	#updateImage(image_url) {
		const htmlElement = this.html.querySelector('.profile-picture');
		if (htmlElement) {
			htmlElement.src = image_url;
		}
	}

	#updateUsername(username) {
		const htmlElement = this.html.querySelector('.username');
		if (htmlElement) {
			htmlElement.textContent = username;
		}
	}

	#updateBio(bio) {
		const htmlElement = this.html.querySelector('.bio');
		if (htmlElement) {
			htmlElement.textContent = bio;
		}
	}

	#updateWinRate(wins, losses, win_rate) {
		const winsElement = this.html.querySelector('.wins');
		const lossesElement = this.html.querySelector('.losses');
		const winRateBarElement = this.html.querySelector('#win-rate-bar');
		console.log(winRateBarElement);

		if (winsElement) {
			winsElement.textContent = `W: ${wins}`;
		}
		if (lossesElement) {
			lossesElement.textContent = `L: ${losses}`;
		}
		if (winRateBarElement) {
			winRateBarElement.style.background = `linear-gradient(to right, blue ${win_rate}%, red ${100 - win_rate}%)`;
		}
	}

	#updateTournaments(tournaments) {
		const htmlElement = this.html.querySelector('.tournements-won');
		if (htmlElement) {
			htmlElement.textContent = `Tournements won: ${tournaments}`;
		}
	}
}

customElements.define("user-profile", UserProfile);


