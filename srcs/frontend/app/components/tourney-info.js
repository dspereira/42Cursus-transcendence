import parseDate from "../utils/timeDateUtils.js";
import { colors } from "../js/globalStyles.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `
	.bracket {
		display: flex;
		width: 100%;
	}

	.game {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 33.33%;
	}

	.game-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 33.33%;
	}
	
	.profile-photo {
		width: 65px;
		height: auto;
		clip-path:circle();
		cursor: pointer;
		margin: 10px;
	}

	.player {
		display: flex;
		width: 100%;
	}

	.players-center {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%
	}

	.border-container-1 {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 40%;
	}

	.border-container-2 {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.border-t {
		border-top: 2px solid red;
	}

	.border-b {
		border-bottom: 2px solid red;
	}

	.border-r {
		border-right: 2px solid red;
	}

	.border-l {
		border-left: 2px solid red;
	}
	
	.elm {
		width: 100%;
		height: 50%;	
	}

	.trophy {
		width: 70px;
	}
		
	.winner {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;	
	}

	.profile-photo-winner {
		width: 80px;
		height: auto;
		clip-path:circle();
		cursor: pointer;
	}

	.container-bracket {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		background-color: ${colors.second_card};
		border-radius: 10px;
		padding: 30px;
		width: 100%;
	}


	.tournament-container {
		display: flex;
		flex-direction: column;
		height: auto;
		min-width: 460px;
		border-radius: 10px;
		border-style: hidden;
		background-color: ${colors.second_card};
		margin-bottom: 30px;
	}

	.brackets-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 250px;
		width: 100%;
		padding: 30px 5% 10px 5%;
	}

	.players-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 180px;
		width: 90px;
	}

	.player-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 85px;
		width: 90px;
	}

	.left-fork, .right-fork {
		border: 2px solid ${colors.btn_default};
		height: 90px;
		min-width: 15px;
		width: 100%;
		max-width: 100%;
	}
		
	.left-fork {
		border-left: hidden;
	}

	.right-fork {
		border-right: hidden;
	}

	.line {
		max-width: 100%;
		width: 100%;
		min-width: 15px;
		height: 2px;
		background-color: ${colors.btn_default};
	}

	.trophy-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		width: 100%;
		min-width: 70px;

	}

	.winner-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: ${colors.primary_text};
		padding-bottom: 30px;
		font-weight: bold;
	}

	.tournament-name {
		font-size: 24px;
		color: ${colors.primary_text};
		text-align: center;
		margin-bottom: 10px;
	}


`;

const getHtml = function(data) {
	const game_0 = data.info.games[0];
	const game_1 = data.info.games[1]; 
	const game_2 = data.info.games[2];

	const html = `
		<div class="tournament-name">${data.info.name}</div>

		<div class="tournament-container">
			<div class=brackets-container>
				<div class="players-container">
					<img src="${game_0.player1.image}" class="profile-photo" alt="profile photo"/>
					<img src="${game_0.player2.image}" class="profile-photo" alt="profile photo"/>
				</div>
				<div class="left-fork"></div>
				<div class="line"></div>
				<div class="player-container">
					<img src="${game_2.player1.image}" class="profile-photo" alt="profile photo"/>
				</div>
				<div class="trophy-container"><img src="/img/trophy-icon.png" class="trophy" alt="trophy"></div>
				<div class="player-container">
					<img src="${game_2.player2.image}" class="profile-photo" alt="profile photo"/>
				</div>
				<div class="line"></div>
				<div class="right-fork"></div>
				<div class="players-container">
					<div><img src="${game_1.player1.image}" class="profile-photo" alt="profile photo"/></div>
					<div><img src="${game_1.player2.image}" class="profile-photo" alt="profile photo"/></div>
				</div>
			</div>
			<div class="winner-container">
					<img src="${data.info.games[2].winner.image}" class="profile-photo-winner" alt="profile photo"/>
					WINNER
			</div>
		</div>
		<game-card
			player1="${game_0.player1.username}"
			player1-image="${game_0.player1.image}"
			player1-score="${game_0.player1_score}"
			player2="${game_0.player2.username}"
			player2-image="${game_0.player2.image}"
			player2-score="${game_0.player2_score}"
			is-winner="${"true"}"
			date="${parseDate(game_0.played_time)}"
		></game-card>

		<game-card
			player1="${game_1.player1.username}"
			player1-image="${game_1.player1.image}"
			player1-score="${game_1.player1_score}"
			player2="${game_1.player2.username}"
			player2-image="${game_1.player2.image}"
			player2-score="${game_1.player2_score}"
			is-winner="${"true"}"
			date="${parseDate(game_1.played_time)}"
		></game-card>

		<game-card
			player1="${game_2.player1.username}"
			player1-image="${game_2.player1.image}"
			player1-score="${game_2.player1_score}"
			player2="${game_2.player2.username}"
			player2-image="${game_2.player2.image}"
			player2-score="${game_2.player2_score}"
			is-winner="${"true"}"
			date="${parseDate(game_2.played_time)}"
		></game-card>
	`;
	return html;
}

export default class TourneyInfo extends HTMLElement {
	static observedAttributes = ["info"];

	constructor() {
		super()
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#scripts();
	}

	disconnectedCallback() {
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "info")
			newValue = JSON.parse(newValue);
		this.data[name] = newValue;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);
	}

	#scripts() {

	}

}

customElements.define("tourney-info", TourneyInfo);

