import {redirect} from "../js/router.js";
import {callAPI} from "../utils/callApiUtils.js";

const styles = `

	.configs-container {
		display: flex;
		margin-bottom: 15px;
	}

	.configs-container h1 {
		font-size: 36px;
	}

	.text-configs {
		display: flex;
		flex-direction: column;
		width: 50%;
		margin-right: 200px;
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
		margin-top: 20px;
		margin-right: 20px;
	}

	image-preview {
		width: 100px;
		height: 100px;
	}

	.image-buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 15px;
		margin-left: 10px;
	}

	.input-image-icon {
		font-size: 50px;
		cursor: pointer;
	}

	.generate-seed-button {
		height: 50px;
	}

	.two-factor-configs h1 {
		font-size: 36px;
		margin-top: 30px;
	}

	.two-factor-options {
		display: flex;
	}

	.two-factor-options label {
		margin-left: 5px;
		margin-right: 20px;
	}

	.language-configs h1 {
		font-size: 36px;
		margin-top: 30px;
	}

	.submit-options {
		margin-top: 30px;
	}
`;

const getHtml = function(data) {
	const html = `
		<form id="settings-form">
			<div class="configs-container">
				<div class="text-configs">
					<h1>Profile Settings</h1>
					<hr>
					<label for="new-username">Change Username</label>
					<div class="alert alert-danger error-message hide" role="alert">
						Username already in use.
					</div>
					<input type="text" class="input-padding form-control form-control-lg" id="new-username" placeholder="New Username" maxlength="50">
					<label for="new-username">Change Bio</label>
					<textarea type="text" class="input-padding form-control form-control-lg" id="new-bio" placeholder="New Bio" rows="3" maxlength="255"></textarea>
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
			<div class="two-factor-configs">
				<h1>Security Settings</h1>
				<hr width="50%">
				<label for="two-factor-options">Choose where to recieve your two factor authentication:</label>
				<div class="two-factor-options">
					<input type="checkbox" id="qrcode" name="qrcode" />
					<label for="qrcode">QR Code</label>
					<input type="checkbox" id="email" name="email" />
					<label for="email">Email</label>
					<input type="checkbox" id="phone" name="phone" />
					<label for="phone">Phone</label>
				</div>
			</div>
			<div class="language-configs">
				<h1>Language Settings</h1>
				<hr width="50%">
				<label for="cars">Choose language:</label>
				<select name="language" id="language-option">
				  <option value="pt">Portugues 🇵🇹</option>
				  <option value="en">English 🇬🇧</option>
				</select>
			</div>
			<button type="submit" class="btn btn-success btn-submit submit-options">Apply Changes</button>
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

		this.#getUserInfo();
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

			console.log(this.dataForm);
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

	#getUserInfo() {
		callAPI("GET", "http://127.0.0.1:8000/api/profile/", null, (res, data) => {
			this.#loadProfile(data);
		});
	}

	#loadProfile(data) {
		this.#loadImage(data.image_url);
		this.#loadUsername(data.username);
		this.#loadBio(data.bio);
	}

	#loadImage(image_url) {
		const htmlElement = this.html.querySelector('.image-preview');
		htmlElement.src = image_url;
	}

	#loadUsername(username) {
		const htmlElement = this.html.querySelector('#new-username');
		htmlElement.value = username;
	}

	#loadBio(bio) {
		const htmlElement = this.html.querySelector('#new-bio');
		htmlElement.value = bio;
	}

}

customElements.define("app-configs", AppConfigs);