const styles = `
	.graph {
		display: flex;
		justify-content: flex-start;
		background-color: #939185;
		border-radius: 8px;
	}

	.game-size-1 {
		width: 30%
	}

	.game-size-2 {
		width: 40%;
	}

	.padding-35 {
		padding: 35px;
	}

	.game-flex {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
	}

	.game-flex-row {
		flex-direction: row;
	}

	.game-flex-column {
		flex-direction: column;
	}

	.player {
		display: flex;
		/*justify-content: center;*/
		align-items: center;
		gap: 10px;
		background-color: #F6F5F5;
		width: 100%;
		height: 60px;
		border-radius: 8px;
	}

	.profile-photo {
		width: 40px;
		margin-left: 10px;
	}
`;

const getHtml = function(data) {
	const html = `
		<div class="graph">
			<div class="game-size-1 padding-35 game-flex game-flex-column">
				<div class="player">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=diogo" class="profile-photo" alt="profile photo chat"/>
					<span class="username">dsilveri</span>
				</div>
				<div class="player">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=diogo" class="profile-photo" alt="profile photo chat"/>
					<span class="username">dsilveri</span>
				</div>
			</div>
			<div class="game-size-2 game-flex game-flex-row">
				<div class="player">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=diogo" class="profile-photo" alt="profile photo chat"/>
					<span class="username">dsilveri</span>
				</div>
				<div class="player">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=diogo" class="profile-photo" alt="profile photo chat"/>
					<span class="username">dsilveri</span>
				</div>
			</div>
			<div class="game-size-1 padding-35 game-flex game-flex-column">
				<div class="player">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=diogo" class="profile-photo" alt="profile photo chat"/>
					<span class="username">dsilveri</span>
				</div>
				<div class="player">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=diogo" class="profile-photo" alt="profile photo chat"/>
					<span class="username">dsilveri</span>
				</div>
			</div>
		</div>
	`;
	return html;
}

export default class TourneyGraph extends HTMLElement {
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

customElements.define("tourney-graph", TourneyGraph);
