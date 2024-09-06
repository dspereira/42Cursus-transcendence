import { adjustContent } from "../utils/adjustContent.js";
import stateManager from "../js/StateManager.js";
import { callAPI } from "../utils/callApiUtils.js";
import { render } from "../js/router.js";

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
		background-color: #EAE4DD;
		border-radius: 10px;
		padding: 30px;
		width: 100%;
	}
`;

const getHtml = function(data) {
	console.log(data.info);

	const html = `
	<app-header></app-header>
	<side-panel selected="tournaments"></side-panel>
	<div class="content content-small">
		
		<h1>${data.info.name}</h1>
		<div class="container-bracket">
			<div class="bracket">
				<div class="game">
					<div class="player">
						<div><img src="${data.info.games[0].player1.image}" class="profile-photo" alt="profile photo"/></div>
						<div class="border-container-1">
							<div class="elm">&nbsp;</div>
							<div class="elm border-t border-r">&nbsp;</div>
						</div>
						<div class="border-container-2">
							<div class="elm">&nbsp;</div>
							<div class="elm border-b">&nbsp;</div>
						</div>
					</div>
					<div class="player">
						<img src="${data.info.games[0].player2.image}" class="profile-photo" alt="profile photo"/>
						<div class="border-container-1">
							<div class="elm border-b border-r">&nbsp;</div>
							<div class="elm">&nbsp;</div>
						</div>
						<div class="border-container-2"></div>
					</div>
				</div>


				<div class="game-center">
					<div class="players-center">
						<div>
							<img src="${data.info.games[2].player1.image}" class="profile-photo" alt="profile photo"/>
						</div>
						<div><img src="/img/trophy-icon.png" class="trophy" alt="trophy"></div>
						<div>
							<img src="${data.info.games[2].player2.image}" class="profile-photo" alt="profile photo"/>
						</div>
					</div>
				</div>


				<div class="game">
					<div class="player">
						<div class="border-container-2">
							<div class="elm">&nbsp;</div>
							<div class="elm border-b">&nbsp;</div>
						</div>
						<div class="border-container-1">
							<div class="elm">&nbsp;</div>
							<div class="elm border-t border-l">&nbsp;</div>
						</div>
						<div><img src="${data.info.games[1].player1.image}" class="profile-photo" alt="profile photo"/></div>
					</div>
					<div class="player">
						<div class="border-container-2">
							<div class="elm">&nbsp;</div>
							<div class="elm">&nbsp;</div>
						</div>
						<div class="border-container-1">
							<div class="elm border-l">&nbsp;</div>
							<div class="elm border-t ">&nbsp;</div>
						</div>
						<div><img src="${data.info.games[1].player2.image}" class="profile-photo" alt="profile photo"/></div>
					</div>
				</div>
			</div>
			
			<div class="winner">
				<div>
					<img src="${data.info.games[2].winner.image}" class="profile-photo-winner" alt="profile photo"/>
				</div>
				<div>
					WINNER
				</div>
			</div>

		</div>

	</div>
	`;
	return html;
}


const title = "Tournament Info";

export default class PageTournamentInfo extends HTMLElement {
	static #componentName = "page-tournament-info";
	static observedAttributes = ["id"];

	constructor() {
		super()
		this.data = {};
		this.info = null;
	}

	connectedCallback() {
		if (!this.data.id) {
			render("<page-404></page-404>");
		}
		else {
			callAPI("GET", `http://127.0.0.1:8000/api/tournament/info/?id=${this.data.id}`, null, (res, data) => {
				if (res.ok && data && data.info) {
					this.data["info"] = data.info;
					this.#start();
				}
				else
					render("<page-404></page-404>");
			});
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.data[name] = newValue;
	}	

	static get componentName() {
		return this.#componentName;
	}

	#start() {
		this.#initComponent();
		this.#render();
		this.#scripts();
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
		adjustContent(this.html.querySelector(".content"));
	}
}

customElements.define(PageTournamentInfo.componentName, PageTournamentInfo);
