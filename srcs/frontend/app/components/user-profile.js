import {callAPI} from "../utils/callApiUtils.js";
import onerrorEventImg from "../utils/imageErrorUtil.js";

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
	const html = `
		<div class="profile-grid-container">
			<div class="profile-info">
				<div>
					<img class="profile-picture" src="" alt="Profile Picture">
				</div>
				<div class="username-container">
					<div class="username"></div>
				</div>
			</div>
			<div class="game-stats">
				<!-- Total games tournaments included -->
				<div class="total-games"></div>
				<div class="games-win-rate"></div>
				<div class="win-rate-bar game"></div>
				<div class="wins-losses game">
					<div class="wins game"></div>
					<div class="losses game"></div>
				</div>

				<div class="total-tournaments"></div>
				<div class="tournaments-win-rate"></div>
				<div class="win-rate-bar tournament"></div>
				<div class="wins-losses tournament">
					<div class="wins tournament"></div>
					<div class="losses tournament"></div>
				</div>
			</div>

			<br></br>
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
		onerrorEventImg(this.html);
		this.#getProfileInfo();
	}

	#getProfileInfo() {
		callAPI("GET", `http://127.0.0.1:8000/api/profile/?username=${this.data.username}`, null, (res, resData) => {
			if (res.ok && resData && resData.data)
				this.#updateProfile(resData.data);
		});
	}

	#updateProfile(data) {
		this.#updateImage(data.image_url);
		this.#updateUsername(data.username);
		this.#updateBio(data.bio);
		this.#updateStats(this.#getPlayedStatsObj(data));
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

	#updateStats(stats) {
		this.totalGames.innerHTML = `Total games: ${stats.totalGames}`;
		this.gameWinRate.innerHTML = `Games win rate: ${stats.gamesWinRate}`;

		if (!stats.gamesWinRate && !stats.totalGames)
			this.winRateBarGame.style.background = `linear-gradient(to right, blue 0%, red 100%)`;
		else
			this.winRateBarGame.style.background = `linear-gradient(to right, blue ${stats.gamesWinRate}%, red ${stats.gamesWinRate}%)`;
		
		this.gamesWins.innerHTML = `W: ${stats.gamesWon}`;
		this.gamesLoses.innerHTML = `L: ${stats.gamesLost}`;

		this.totalTournaments.innerHTML = `Total tornaments: ${stats.totalTournaments}`;
		this.tournamentWinRate.innerHTML = `Tornaments win rate: ${stats.tournamentsWinRate}`;
		
		if (!stats.tournamentsWinRate && !stats.totalTournaments)
			this.winRateBarTournaments.style.background = `linear-gradient(to right, blue 0%, red 100%)`;
		else
			this.winRateBarTournaments.style.background = `linear-gradient(to right, blue ${stats.tournamentsWinRate}%, red ${stats.tournamentsWinRate}%)`;

		this.tournamentWins.innerHTML = `W: ${stats.tournamentsWon}`;
		this.tournamentLoses.innerHTML = `L: ${stats.tournamentsLost}`;
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
