import Aview from "./Aview.js";

export default class extends Aview {
	constructor(params)
	{
		super(params);
		this.setTitle("Profile");
	}

	async getHtml() 
	{
		return `
			<h1>This Your account page!</h1>

			look how pretty you look:
			<p>
			<img src="/images/bobTheBuilder.png" alt="YourPhoto" width="250" height="300"> 
			</p>
			<h1 class="fw-bold">Under construction!</h1>
			`;
	}
}