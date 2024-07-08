import {redirect} from "../js/router.js";
import {callAPI} from "../utils/callApiUtils.js";

const styles = `

`;

const getHtml = function(data) {
	const html = `
		<div class="configs-container">
			<form id="settings-form">
				<div class="text-configs">
					<h1>Change username</h1>
					<div class="alert alert-danger hide" role="alert">
						Username already in use.
					</div>
					<input type="text" class="input-padding form-control form-control-lg" id="new-username" placeholder="New Username" maxlength="100">
					<h1>Change bio</h1>
					<input type="text" class="input-padding form-control form-control-lg" id="new-bio" placeholder="New Bio" maxlength="255">
				</div>
				<div class="image-configs">
					<img class="profile-picture" src="">
					<input type="file" accept="image/jpeg, image/png, image/jpg" id="image-input">
				</div>
				<button type="submit" class="btn btn-success btn-submit">Apply Changes</button>
			</form>
		</div>
	`;
	return html;
}

export default class AppConfigs extends HTMLElement {
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
		this.#getUserInfo();
		this.#submit();
	}

	#submit() {
		const settingsForm = this.html.querySelector("#settings-form");
		settingsForm.addEventListener("submit", (event) => {
			event.preventDefault();
			const dataForm = {
				newUsername: document.querySelector("#new-username").value.trim(),
				newBio: document.querySelector("#new-bio").value.trim()
			}
			if (dataForm.newUsername) {
				console.log(dataForm.newUsername);
			}
			if (dataForm.newBio) {
				console.log(dataForm.newBio);
			}
			callAPI("POST", "http://127.0.0.1:8000/api/profile/setnewconfigs", dataForm);
		});
	}

	#getUserInfo() {
		callAPI("GET", "http://127.0.0.1:8000/api/profile/getimage", null, (res, data) => {
			this.#updateImage(data.image_url);
		});
	}
	
	#updateImage(image_url) {
		const htmlElement = this.html.querySelector('.profile-picture');
		if (htmlElement) {
			htmlElement.src = image_url;
		}
	}

}

customElements.define("app-configs", AppConfigs);