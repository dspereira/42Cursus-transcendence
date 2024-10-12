import { redirect } from "../js/router.js";
import { colors } from "../js/globalStyles.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `
	.game-grid-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 10px;
		width: 100%;
		min-width: 460px;
		min-height: 76px;
		padding: 5px 15px 5px 15px;
		margin-bottom: 20px;
		color: ${colors.primary_text};
	}

	.left {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 33.33%;
	}

	.center {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 33.33%;
	}

	.right {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 33.33%;
	}

	.tournament-win {
		border: 3px solid ${colors.game_win};
	}

	.tournament-loss {
		border: 3px solid ${colors.game_loss};
	}
`;

const getHtml = function(data) {
	const html = `
		<div class="game-grid-container ${data.isWinner == "true" ? "tournament-win" : "tournament-loss"}">
			<div class="left">
				<div>${data.name}</div>
			</div>
			<div class="center">
				<div>${data.date}</div>
			</div>
			<div class="right">
				<button type="button" class="btn btn-primary btn-tornament-info">See More Info</button>
			</div>
		</div>
	`;
	return html;
}

export default class TournamentCard extends HTMLElement {
	static observedAttributes = ["id", "name", "is-winner", "date"];

	constructor() {
		super()
		this.data = {};
	}

	connectedCallback() {
		this.#initComponent();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name == "is-winner")
			name = "isWinner";
		this.data[name] = newValue;
	}

	#initComponent() {
		this.html = componentSetup(this, getHtml(this.data), styles);
	}

	#scripts() {
		this.#btnTornamentInfo();
	}

	#btnTornamentInfo() {
		const btn = this.html.querySelector(".btn-tornament-info");
		if (!btn)
			return ;

		btn.addEventListener("click", () => {
			redirect(`/tournament/${this.data.id}`);
		});
	}
}

customElements.define("tournament-card", TournamentCard);
