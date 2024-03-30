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

			<h1 class="fw-bold">Under construction!</h1>
			<p><b><a href="/" data-link>Home.</a></b></p>

			`;
	}
}