import {callAPI} from "../utils/callApiUtils.js";


const styles = `

	.game-history{
		height: 800px;
		overflow-y: scroll;
	}
	
	.game-history::-webkit-scrollbar {
		background: none;
		scrollbar-width: thin;
	}

	.game-history::-webkit-scrollbar-thumb {
		background: #E7E7E7;
		border-radius: 50px;
	}

	.game-grid-container {
		display: flex;
		gap: 20px;
		height: 120px;
		align-items: flex-end;
		border-radius: 20px;
	}

	.game-win {
		border: 3px solid blue;
		background-color: #00CCCC;
	}

	.game-loss {
		border: 3px solid red;
		background-color: #FF6666;
	}

	.grid-item {
	   /*  padding: 20px; */
		height: 100%;
	}

	.profile-picture-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.profile-picture {
		width: 80px;
		height: auto;
		clip-path:circle();
	}

	.text-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

`;

const getHtml = function(data) {

	const html = `
	<div class="game-history">
		<div class="game-grid-container game-win">
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=pcampos-" alt="Profile Picture">
			</div>
			<div class="grid-item text-container">
				<h2>pcampos-</h1>
			</div>
			<div class="grid-item text-container">
				<h1 class="score">7 - 3</h1>
			</div>
			<div class="grid-item text-container">
				<h2>ralves-g</h1>
			</div>
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=ralves-g" alt="Profile Picture">
			</div>
		</div>
		<br><br>
		<div class="game-grid-container game-loss">
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=pcampos-" alt="Profile Picture">
			</div>
			<div class="grid-item text-container">
				<h2>pcampos-</h2>
			</div>
			<div class="grid-item text-container">
				<h1>6 - 7</h1>
			</div>
			<div class="grid-item text-container">
				<h2>ralves-g</h2>
			</div>
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=ralves-g" alt="Profile Picture">
			</div>
		</div>
		<br><br>
		<div class="game-grid-container game-win">
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=pcampos-" alt="Profile Picture">
			</div>
			<div class="grid-item text-container">
				<h2>pcampos-</h1>
			</div>
			<div class="grid-item text-container">
				<h1 class="score">7 - 3</h1>
			</div>
			<div class="grid-item text-container">
				<h2>ralves-g</h1>
			</div>
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=ralves-g" alt="Profile Picture">
			</div>
		</div>
		<br><br>
		<div class="game-grid-container game-win">
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=pcampos-" alt="Profile Picture">
			</div>
			<div class="grid-item text-container">
				<h2>pcampos-</h1>
			</div>
			<div class="grid-item text-container">
				<h1 class="score">7 - 3</h1>
			</div>
			<div class="grid-item text-container">
				<h2>ralves-g</h1>
			</div>
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=ralves-g" alt="Profile Picture">
			</div>
		</div>
		<br><br>
		<div class="game-grid-container game-win">
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=pcampos-" alt="Profile Picture">
			</div>
			<div class="grid-item text-container">
				<h2>pcampos-</h1>
			</div>
			<div class="grid-item text-container">
				<h1 class="score">7 - 3</h1>
			</div>
			<div class="grid-item text-container">
				<h2>ralves-g</h1>
			</div>
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=ralves-g" alt="Profile Picture">
			</div>
		</div>
		<br><br>
		<div class="game-grid-container game-win">
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=pcampos-" alt="Profile Picture">
			</div>
			<div class="grid-item text-container">
				<h2>pcampos-</h1>
			</div>
			<div class="grid-item text-container">
				<h1 class="score">7 - 3</h1>
			</div>
			<div class="grid-item text-container">
				<h2>ralves-g</h1>
			</div>
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=ralves-g" alt="Profile Picture">
			</div>
		</div>
		<br><br>
		<div class="game-grid-container game-win">
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=pcampos-" alt="Profile Picture">
			</div>
			<div class="grid-item text-container">
				<h2>pcampos-</h1>
			</div>
			<div class="grid-item text-container">
				<h1 class="score">7 - 3</h1>
			</div>
			<div class="grid-item text-container">
				<h2>ralves-g</h1>
			</div>
			<div class="grid-item profile-picture-container">
				<img id="profile-picture" class="profile-picture" src="	https://api.dicebear.com/8.x/bottts/svg?seed=ralves-g" alt="Profile Picture">
			</div>
		</div>
	</div>
	`;

	return html;
}

export default class GameCard extends HTMLElement {
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

	}

}

customElements.define("game-card", GameCard);


