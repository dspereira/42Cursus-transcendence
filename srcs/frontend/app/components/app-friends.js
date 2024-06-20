const styles = `
.friends-section {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	gap: 30px;
	padding: 0px 10px 0px 10px;
}

.lateral-menu {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}

.list {
	width:100%;
}

.lateral-menu button {
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

.lateral-menu button > span {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 10px;
}

user-card {
	display: block;
	margin-bottom: 20px;
}
`;

const getHtml = function(data) {

	const html = `
		<div class="friends-section">
			<div class="lateral-menu">
				<button>
					<span>
						<i class="icon bi bi-search"></i>
						<span class="icon-text">Search</span>
					</span>
				</button>
				<button>
					<span>
						<i class="icon bi bi-people"></i>
						<span class="icon-text">All Friends</span>
					</span>
				</button>
				<button>
					<span>
						<i class="icon bi bi-person-plus"></i>
						<span class="icon-text">Requests</span>
					</span>
				</button>
			</div>
			<div class="list">
				<user-card
					profile-photo="https://api.dicebear.com/8.x/bottts/svg?seed=asdfsadfas"
					username="dsilveri"
					friend="true">
				</user-card>
				<user-card
					profile-photo="https://api.dicebear.com/8.x/bottts/svg?seed=asdfsadfassdf"
					username="user"
					friend="false">
				</user-card>
			</div>
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
