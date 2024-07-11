import {redirect} from "../js/router.js";
import {callAPI} from "../utils/callApiUtils.js";

const styles = `

	.configs-container {
		display: flex;
		justify-content: space-between;
		margin-bottom: 30px;
	}

	.text-configs {
		display: flex;
		flex-direction: column;
		width: 40%;
	}

	.text-configs h1 {
		font-size: 32px;
	}

	.hide {
		display: none;
	}

	.show {
		display: block;
	}

	#new-username {
		margin-bottom: 30px;
	}

	.image-configs{
		display: flex;
		flex-direction: column;
		margin-top: 20px;
		margin-right: 20px;
	}

	image-preview {
		width: 100px;
		height: 100px;
	}

	.image-buttons {
		display: flex;
		align-items: center;
		gap: 50px;
	}

	.input-image-icon {
		font-size: 50px;
		cursor: pointer;
	}

	.generate-seed-button{
		height: 50px;
	}
`;

const getHtml = function(data) {
	const html = `
		<form id="settings-form">
			<div class="configs-container">
				<div class="text-configs">
					<h1>Change username</h1>
					<div class="alert alert-danger error-message hide" role="alert">
						Username already in use.
					</div>
					<input type="text" class="input-padding form-control form-control-lg" id="new-username" placeholder="New Username" maxlength="100">
					<h1>Change bio</h1>
					<input type="text" class="input-padding form-control form-control-lg" id="new-bio" placeholder="New Bio" maxlength="255">
				</div>
				<div class="image-configs">
					<img class="image-preview">
					<div class="image-buttons">
						<label for="newImage">
							<i class="bi bi-image input-image-icon""></i>
						</label>
						<input id="newImage" type="file" accept="image/jpeg, image/png, image/jpg" id="image-input" style="display: none;">
						<button id="seedButton" class="btn btn-secondary generate-seed-button">Generate New Avatar</button>
					</div>
				</div>
			</div>
			<button type="submit" class="btn btn-success btn-submit">Apply Changes</button>
		</form>
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

		this.dataForm = {};
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

		this.#submit();
		this.#uploadImage();
		this.#generateNewSeed();
	}

	#generateNewSeed() {
		const seedButton = this.html.querySelector("#seedButton")
		seedButton.addEventListener('click', (event) => {
			event.preventDefault();
			const newSeed = Math.random().toString(36).substring(2,7);
			let preview = this.html.querySelector(".image-preview");
			preview.src = "https://api.dicebear.com/8.x/bottts/svg?seed=" + newSeed;
			this.dataForm.newImage = '';
			this.dataForm.newSeed = newSeed;
		})
	}

	#uploadImage() {
		const uploadImage = this.html.querySelector("#newImage")
		uploadImage.addEventListener('change', (event) => {
			event.preventDefault();
			let preview = this.html.querySelector(".image-preview");
			preview.src = URL.createObjectURL(uploadImage.files[0]);
			this.dataForm.newImage = uploadImage.files[0];
			this.dataForm.newSeed = '';
		})
	}

	#submit() {
		const settingsForm = this.html.querySelector("#settings-form");
		settingsForm.addEventListener("submit", (event) => {
			event.preventDefault();

			this.dataForm.newUsername = this.html.querySelector("#new-username").value.trim();
			this.dataForm.newBio = this.html.querySelector("#new-bio").value.trim();

			callAPI("POST", "http://127.0.0.1:8000/api/profile/setnewconfigs", this.dataForm, this.#apiResHandlerCalback);
		});
	}

	#apiResHandlerCalback = (res, data) => {
		if (res.ok && data.message === "success")
			this.#hideErrorMessage();
		else
			this.#showErrorMessage();
	}

	#hideErrorMessage() {
		const errorMessage = this.html.querySelector(".error-message")
		errorMessage.classList.remove("show");
		errorMessage.classList.add("hide");
	}

	#showErrorMessage() {
		const errorMessage = this.html.querySelector(".error-message")
		errorMessage.classList.remove("hide");
		errorMessage.classList.add("show");
	}
}

customElements.define("app-configs", AppConfigs);