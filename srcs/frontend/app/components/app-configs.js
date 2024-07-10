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
					<label for="newImage" class="button">
						<i class="bi bi-camera"></i>
					</label>
					<input id="newImage" type="file" accept="image/jpeg, image/png, image/jpg" id="image-input" style="opacity: 0;">
					<button id="seedButton" class="btn btn-secondary">Generate New Avatar</button>
					<img id="imagePreview">
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
		
		let dataForm = new FormData();
		dataForm.append("newUsername",'');
		dataForm.append("newBio", '');
		dataForm.append("newImage", '');
		dataForm.append("newSeed", '');


		this.#submit(dataForm);
		this.#uploadImage(dataForm);
		this.#generateNewSeed(dataForm);
	}

	#generateNewSeed(dataForm) {
		const seedButton = this.html.querySelector("#seedButton")
		seedButton.addEventListener('click', (event) => {
			event.preventDefault();
			const newSeed = Math.random().toString(36).substring(2,7);
			var preview = this.html.querySelector("#imagePreview");
			preview.src = "https://api.dicebear.com/8.x/bottts/svg?seed=" + newSeed;
			dataForm["newImage"] = '';
			dataForm["newSeed"] = newSeed;
		})
	}

	#uploadImage(dataForm) {
		const uploadImage = this.html.querySelector("#newImage")
		uploadImage.addEventListener('change', (event) => {
			event.preventDefault();
			var preview = this.html.querySelector("#imagePreview");
			preview.src = URL.createObjectURL(uploadImage.files[0]);
			dataForm["newImage"] = uploadImage.files[0];
			dataForm["newSeed"] = '';
		})
	}

	#submit(dataForm) {
		const settingsForm = this.html.querySelector("#settings-form");
		settingsForm.addEventListener("submit", (event) => {
			event.preventDefault();

			dataForm.append("newUsername", this.html.querySelector("#new-username").value.trim());
			dataForm.append("newBio", this.html.querySelector("#new-bio").value.trim());

			callAPI("POST", "http://127.0.0.1:8000/api/profile/setnewconfigs", dataForm);
		});
	}

}

customElements.define("app-configs", AppConfigs);