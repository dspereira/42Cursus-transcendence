
const styles = `

/* Friend List */
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


/* Chat panel */

.chat-panel .profile-photo {
	width: 50px;
}

.msg {
	margin-bottom: 20px;	
}

.card-msg {
	display: block;
	max-width: 70%;
}

.card-text {
	margin-top: 6px;
	padding: 5px 8px 5px 8px;
	border-radius: 8px; 
}

.friend-color {
	background-color: #FF5733;
}

.own-color {
	background-color: #33FFBD;
}


.friend-pos {
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	gap: 15px;
	
}

.own-pos {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	gap: 15px;
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

				<div class="msg friend-pos">
					<div>
						<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo" class="profile-photo" alt="profile photo chat"/>
					</div>
					<div class="card-msg">
						<div class="friend-color card-text">Bacon ipsum dolor amet bresaola beef tongue, burgdoggen flank brisket ham meatloaf pastrami chislic. Bresaola shoulder alcatra frankfurter leberkas boudin capicola. Meatball buffalo swine cow, ham hock short loin ball tip fatback pancetta landjaeger pork loin kevin drumstick shank. </div>
					</div>
				</div>

				<div class="msg own-pos">
					<div class="card-msg">
						<div class="own-color card-text">Bacon ipsum dolor amet bresaola beef tongue, burgdoggen flank brisket ham meatloaf pastrami chislic. Bresaola shoulder alcatra frankfurter leberkas boudin capicola. Meatball buffalo swine cow, ham hock short loin ball tip fatback pancetta landjaeger pork loin kevin drumstick shank. </div>
					</div>
					<div>
						<img src="https://api.dicebear.com/8.x/bottts/svg?seed=Diogo" class="profile-photo" alt="profile photo chat"/>
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