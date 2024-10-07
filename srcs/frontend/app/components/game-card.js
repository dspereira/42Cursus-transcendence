import { colors } from "../js/globalStyles.js";
import {callAPI} from "../utils/callApiUtils.js";
import { redirect } from "../js/router.js";

const styles = `
	.game-grid-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 10px;
		min-width: 460px;
		width: 100%;
		padding: 5px 15px 5px 15px;
		margin-bottom: 20px;
		color: ${colors.primary_text};
	}

	.game-win {
		border: 3px solid ${colors.game_win};
	}

	.game-loss {
		border: 3px solid ${colors.game_loss};
	}

	.player-container {
		position: relative;
		display: flex;
		align-items: center;
		flex-direction: row;
		gap: 10px;
	}

	/*@media (max-width: 1000px) {
		.player-container {
			flex-direction: column;
			justify-content: flex-start;
		}
	}*/

	.profile-picture {
		width: 50px;
		height: 50px;
		clip-path: circle();
		object-fit: cover;
	}

	.username {
		margin-top: 7px;
		font-size: 16px;
	}

	.score-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}

	.score {
		font-size: 24px;
	}

	.date {
		font-size: 14px;
	}
	
	.left {
		justify-content: flex-start;
		width: 33.33%;
	}

	.center {
		display: flex;
		justify-content: center;
		width: 33.33%;
	}

	.right {
		justify-content: flex-end;
		width: 33.33%;
	}

	.clickable {
		cursor: pointer;
	}

	.hover-popup {
		position: fixed;
		padding: 10px;
		background-color: ${colors.main_card};
		color: ${colors.primary_text};
		opacity: 0.9;
		backdrop-filter: blur(5px);
		border-radius: 5px;
		white-space: nowrap;
		display: none;
		pointer-events: none;
		z-index: 1000;
		transform: translate(-50%, 10px);
	}
`;

const getHtml = function(data) {
	const html = `
		<div class="game-grid-container ${data.isWinner == "true" ? "game-win" : "game-loss"}">
			<div class="player-container left">
				<img class="profile-picture clickable" id="${data.player1}-img" src=${data.player1Image}>
				<div class="username">${data.player1}</div>
				<div id="hover-popup-${data.player1}" class="hover-popup"></div>
			</div>
			<div class="score-container center">
				<div class="date">${data.date}</div>
				<div class="score">${data.player1Score} - ${data.player2Score}</div>
			</div>
			<div class="player-container right">
				<div class="username">${data.player2}</div>
				<img class="profile-picture clickable" id="${data.player2}-img" src=${data.player2Image}>
				<div id="hover-popup-${data.player2}" class="hover-popup"></div>
			</div>
		</div>
	`;
	return html;
}

export default class GameCard extends HTMLElement {
	static observedAttributes = ["player1", "player1-image", "player1-score", "player2", "player2-image", "player2-score", "is-winner", "date"];

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
		if (name == "player1-image")
			name = "player1Image";
		else if (name == "player1-score")
			name = "player1Score";
		else if (name == "player2-image")
			name = "player2Image";
		else if (name == "player2-score")
			name = "player2Score";
		else if (name == "is-winner")
			name = "isWinner";
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
		this.#addProfileRedirect(this.data.player1);
		this.#addProfileRedirect(this.data.player2);
	}

	#addProfileRedirect(username) {
		const movePopup = (event) => {
			popup.style.left = event.clientX + 'px';
			popup.style.top = event.clientY + 'px';
		};

		const profilePhoto = document.getElementById(`${username}-img`);
		const popup = document.getElementById(`hover-popup-${username}`);
		popup.innerHTML = `${username}'s profile`;
		profilePhoto.addEventListener("click", () => {
			redirect(`profile/${username}`)
		});
		profilePhoto.addEventListener('mouseenter', () => {
			popup.style.display = 'block'
			profilePhoto.addEventListener('mousemove', movePopup);
			});
		profilePhoto.addEventListener('mouseleave', () => {
			popup.style.display = 'none'
			profilePhoto.removeEventListener('mousemove', movePopup);
		});
	}

}

customElements.define("game-card", GameCard);
