
// justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly | start | end | left | right ... + safe | unsafe;

const styles = `

.user-card {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	border-radius: 8px;
	padding: 10px 25px 10px 25px;
	background-color: #A9A9A9;
}

.user {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 20px;
}

.buttons {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 20px;
}

.user-photo {
	width: 50px;
}

.user-name {
	font-size: 16px;
	font-weight: bold;
}

.buttons i {
	font-size: 16px;
}

`;

const getHtml = function(data) {

	const html = `
	
		<div class="user-card">
			<div class="user">
				<img src="https://api.dicebear.com/8.x/bottts/svg?seed=candeia" class="user-photo" alt="profile photo chat"/>
				<span class="user-name">utilizado_test</span>
			</div>
			<div class="buttons">
				<div
					<button type="button" class="btn btn-success">
						<i class="bi bi-controller"></i>
					</button>
				</div>
				<div
					<button type="button" class="btn btn-success">
						<i class="bi bi-person-plus"></i>
					</button>
				</div>
				<div
					<button type="button" class="btn btn-success">
						<i class="bi bi-chat"></i>
					</button>
				</div>
			</div>
		</div>

	`;
	return html;
}

export default class UserCard extends HTMLElement {
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

customElements.define("user-card", UserCard);


