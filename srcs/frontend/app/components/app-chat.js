
const styles = `

.red { 
	border: 1px red solid;
}

.user {
	display: flex;
	border: 1px red solid;
	cursor: pointer;
	align-items: center;
	gap: 30px;
	margin-bottom: 20px;
}

.user .profile-photo {
	width: 60px;
	height: auto;
	clip-path:circle();
}

.user .name {
	font-size: 20px;
	font-weight: bold;
}

.chat-panel .profile-photo {
	width: 30px;
}

.chat-panel .message {
	font-size: 16px;
}

.sender .message {
	background-color: blue;
}

.receiver .message {
	background-color: green;
}

`;

const getHtml = function(data) {
	const html = `
	
	<div class="row">
		<div class="col-4 red">
			<div class="user">
				<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo1" class="profile-photo" alt="profile photo chat"/>
				<span class="name">Nome do utilizador</span>
			</div>
			<div class="user">
				<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo2" class="profile-photo" alt="profile photo chat"/>
				<span class="name">Nome do utilizador</span>
			</div>
			<div class="user">
				<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo3" class="profile-photo" alt="profile photo chat"/>
				<span class="name">Nome do utilizador</span>
			</div>
			<div class="user">
				<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo4" class="profile-photo" alt="profile photo chat"/>
				<span class="name">Nome do utilizador</span>
			</div>
		</div>

		<div class="col-8">
			<div class="chat-panel">
				<div class="sender">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo" class="profile-photo" alt="profile photo chat"/>
					<span class="message">Shankle buffalo tongue corned beef shoulder cow chislic hamburger beef sausage burgdoggen. Short ribs beef pork chop, andouille pork ribeye cow burgdoggen chicken pig tenderloin salami leberkas.</span>
				</div>
				<div class="receiver">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo" class="profile-photo" alt="profile photo chat"/>
					<div class="message">Shankle buffalo tongue corned beef shoulder cow chislic hamburger beef sausage burgdoggen. Short ribs beef pork chop, andouille pork ribeye cow burgdoggen chicken pig tenderloin salami leberkas.</div>
				</div>
				<div class="receiver">
					<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo" class="profile-photo" alt="profile photo chat"/>
					<div class="message">
						<span class="message">Shankle buffalo tongue corned beef shoulder cow .</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	`;
	return html;
}

export default class AppChat extends HTMLElement {
	static observedAttributes = [];

	constructor() {
		super()
		this.#initComponent();
		this.#render();
		this.#scripts();
	}

	attributeChangedCallback(name, oldValue, newValue) {

	}

	#initComponent() {
		this.html = document.createElement("div");
		this.html.innerHTML = this.#html();
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

customElements.define("app-chat", AppChat);