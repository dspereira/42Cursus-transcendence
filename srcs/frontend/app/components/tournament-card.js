import { redirect } from "../js/router.js";
import componentSetup from "../utils/componentSetupUtils.js";

const styles = `
	.game-grid-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 10px;
		width; 100%;
		padding: 10px 15px 10px 15px;
		margin-bottom: 20px;
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
		border: 3px solid blue;
		background-color: #00CCCC;
	}

	.tournament-loss {
		border: 3px solid red;
		background-color: #FF6666;
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
				<button type="button" class="btn btn-primary btn-tornament-info">${this.data.langDict.see_more_info_button}</button>
			</div>
		</div>
	`;
	return html;
}

export default class TournamentCard extends HTMLElement {
	static observedAttributes = ["id", "name", "is-winner", "date", "lang-dict"];

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
		if (name == "lang-dict")
			name = "langDict";
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
