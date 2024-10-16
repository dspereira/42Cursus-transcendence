import {callAPI} from "../utils/callApiUtils.js";
import stateManager from "../js/StateManager.js";
import { colors } from "../js/globalStyles.js";
import charLimit from "../utils/characterLimit.js";
import { charLimiter } from "../utils/characterLimit.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `

	.profile-grid-container {
		display: flex;
		min-width: 200px;
		flex-direction: column;
		align-items: center;
		border-radius: 10px;
		background: ${colors.second_card};
		color: ${colors.primary_text};
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
		width:100%;
		font-size: 18px;
		border-radius: 5px;
		border-style: hidden;
		margin: 25px 0px 0px 0px;
		padding: 20px 0px 20px 0px;
		background-color: ${colors.third_card};
	}

	.separator {
		display: flex;
		width: 80%;
		height: 2px;
		border-radius: 10px;
		justify-content: center;
		align-items: center;
		margin: 25px 0px 25px 0px;
		background-color: ${colors.second_card};
	}

	.separator-v {
		display: none;
		width: 3px;
		height: 120px;
		border-radius: 10px;
		justify-content: center;
		align-items: center;
		margin: 0px 10px 0px 10px;
		background-color: ${colors.second_card};
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
		border-radius: 5px;
		font-size: 21px;
		width: 100%;
		margin-bottom: 10px;
		text-align: center;
		color: ${colors.second_text};
	}

	.bio-and-stats {
		display: flex;
		width: 90%;
		min-width: 200px;
		flex-direction: column;
		align-items: center;
		border-radius: 10px;
	}

	@media (max-width: 1100px) {
		.profile-grid-container {
			width: 100%;
			flex-direction: column;
			justify-content: center;
			gap: 20px;
		}

		.game-stats-container, .tournament-stats-container {
			width: 40%;
		}

		.game-stats {
			flex-direction: row;
			gap: 10px;
			padding: 20px;
		}

		.game-stats > .separator {
			display: none;
		}
		.game-stats > .separator-v {
			display: flex;
		}
	}

	@media (max-width: 660px) {
		.game-stats-container, .tournament-stats-container {
			width: 100%;
		}

		.game-stats {
			flex-direction: column;
		}

		.game-stats > .separator {
			display: flex;
		}

		.game-stats > .separator-v {
			display: none;
		}
	
	}

	.game-stats-container, .tournament-stats-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.games-win-rate, .tournaments-win-rate {
		margin-bottom: 10px;
	}

	.online-status {
		position: absolute;
		display: inline-block;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background-color: green;
		z-index: 2;
		bottom: 33px;
		right: 20px;
		border: 2px solid white;
	}

	.profile-photo-status {
		position: relative;
	}

	.hide {
		display: none;
	}

	.small-margin {
		margin-bottom: 10px;
	}

`;

const getHtml = function(data) {
	const html = `
		<div class="profile-grid-container">
			<div class="profile-info">
				<div class="profile-photo-status">
					<img class="profile-picture" src="" alt="Profile Picture">
					<div class="online-status hide"></div>
				</div>
				<div class="username-container">
					<div class="username"></div>
				</div>
			</div>
			<div class="bio-and-stats">
				<div class="game-stats">
					<!-- Total games tournaments included -->
					<div class="game-stats-container">
						<div class="total-games small-margin"></div>
						<div class="games-win-rate"></div>
						<div class="win-rate-bar game"></div>
						<div class="wins-losses game">
							<div class="wins game"></div>
							<div class="losses game"></div>
						</div>
					</div>
					<div class="separator"></div>
					<div class="separator-v"></div>
					<div class="tournament-stats-container">
						<div class="total-tournaments small-margin"></div>
						<div class="tournaments-win-rate"></div>
						<div class="win-rate-bar tournament"></div>
						<div class="wins-losses tournament">
							<div class="wins tournament"></div>
							<div class="losses tournament"></div>
						</div>
					</div>
				</div>
				<br></br>
				<div class="bio-box">
					<span class="bio"></span>
				</div>
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
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.data[name] = newValue;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);

		this.totalGames = this.html.querySelector('.total-games');
		this.gameWinRate = this.html.querySelector('.games-win-rate');
		this.winRateBarGame = this.html.querySelector('.win-rate-bar.game');
		this.gamesWins = this.html.querySelector('.wins.game');
		this.gamesLoses = this.html.querySelector('.losses.game');

		this.totalTournaments = this.html.querySelector('.total-tournaments');
		this.tournamentWinRate = this.html.querySelector('.tournaments-win-rate');
		this.winRateBarTournaments = this.html.querySelector('.win-rate-bar.tournament');
		this.tournamentWins = this.html.querySelector('.wins.tournament');
		this.tournamentLoses = this.html.querySelector('.losses.tournament');
	}

	#scripts() {
		this.#getProfileInfo();
	}

	#getProfileInfo() {
		callAPI("GET", `/profile/?username=${this.data.username}`, null, (res, resData) => {
			if (res.ok && resData && resData.data)
				this.#updateProfile(resData.data);
		});
	}

	#updateProfile(data) {
		this.#updateImage(data.image_url);
		this.#updateUsername(data.username);
		this.#updateBio(data.bio);
		this.#updateStats(this.#getPlayedStatsObj(data));
		this.#updateOnline(data.online);
	}

	#updateImage(image_url) {
		const htmlElement = this.html.querySelector('.profile-picture');
		if (htmlElement)
			htmlElement.src = image_url;
	}

	#updateUsername(username) {
		const htmlElement = this.html.querySelector('.username');
		if (htmlElement)
			htmlElement.textContent = charLimiter(username, charLimit);
	}

	#updateBio(bio) {
		const htmlElement = this.html.querySelector('.bio');
		if (htmlElement)
			htmlElement.textContent = bio;
	}

	#updateStats(stats) {
		this.totalGames.innerHTML = `Total games: ${stats.totalGames}`;
		this.gameWinRate.innerHTML = `Game win rate: ${stats.totalGames > 0 ? `${stats.gamesWinRate}%` : "---"}`;

		if (!stats.totalGames)
			this.winRateBarGame.style.background = `linear-gradient(to right, ${colors.game_win} 0%, ${colors.game_loss} 100%)`;
		else
			this.winRateBarGame.style.background = `linear-gradient(to right, ${colors.game_win} ${stats.gamesWinRate}%, ${colors.game_loss} ${stats.gamesWinRate}%)`;
		
		this.gamesWins.innerHTML = `W: ${stats.gamesWon}`;
		this.gamesLoses.innerHTML = `L: ${stats.gamesLost}`;

		this.totalTournaments.innerHTML = `Total tornaments: ${stats.totalTournaments}`;
		this.tournamentWinRate.innerHTML = `Tornament win rate: ${stats.totalTournaments > 0 ? `${stats.tournamentsWinRate}%`: "---"}`;
		
		if (!stats.totalTournaments)
			this.winRateBarTournaments.style.background = `linear-gradient(to right,  ${colors.game_win} 0%, ${colors.game_loss} 100%)`;
		else
			this.winRateBarTournaments.style.background = `linear-gradient(to right,  ${colors.game_win} ${stats.tournamentsWinRate}%, ${colors.game_loss} ${stats.tournamentsWinRate}%)`;

		this.tournamentWins.innerHTML = `W: ${stats.tournamentsWon}`;
		this.tournamentLoses.innerHTML = `L: ${stats.tournamentsLost}`;
	}

	#updateOnline(online) {
		if (!online || online == "false")
			return ;
		const onlineHtml = this.html.querySelector(".online-status");
		if (onlineHtml)
			onlineHtml.classList.remove("hide");
	}

	#getPlayedStatsObj(data) {
		return {
			totalGames: data.total_games,
			gamesWon: data.victories,
			gamesLost: data.defeats,
			gamesWinRate: data.win_rate,
			totalTournaments: data.tournaments_played,
			tournamentsWon: data.tournaments_won,
			tournamentsLost: data.tournaments_lost,
			tournamentsWinRate: data.tournaments_win_rate,
		}
	}
}

customElements.define("user-profile", UserProfile);
