const styles = `

.friends-section {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	gap: 30px;
}

.lateral-menu {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}

.list {


}

button {
	display: block;
	background : transparent;
	border: 0;
	padding: 0;
	font-family: innherit;
	text-align: left;
	width: 100%;
	margin-bottom: 16px; 
}

.icon {
	font-size: 22px;
}

.icon-text {
	font-size: 14px;
}

button > span {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 10px;

}

`;

const getHtml = function(data) {

	const html = `
		<div class="friends-section">
			<div class="lateral-menu">
				<button>
					<span>
						<i class="icon bi bi-search"></i>
						<span class="icon-text">search</span>
					</span>
				</button>
				<button>
					<span>
						<i class="icon bi bi-people"></i>
						<span class="icon-text">My Friends</span>
					</span>
				</button>
				<button>
					<span>
						<i class="icon bi bi-person-plus"></i>
						<span class="icon-text">Requests</span>
					</span>
				</button>
			</div>
			<div class="list">lista</div>
		</div>
	`;
	return html;
}

export default class AppFriends extends HTMLElement {
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

customElements.define("app-friends", AppFriends);
