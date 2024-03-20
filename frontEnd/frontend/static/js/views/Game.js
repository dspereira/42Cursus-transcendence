import Aview from "./Aview.js";

export default class extends Aview {
	constructor(params)
	{
		super(params);
		this.setTitle("Game");
	}

	async getHtml() 
	{
		return `
			<h1>Welcome to the Game!</h1>
			<p>
				This is the Game!
			</p>
			<p>
			<b><a href="/" data-link>Home.</a></b>
			</p>
		`;
	}
}