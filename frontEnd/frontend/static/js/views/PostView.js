import Aview from "./Aview.js";

export default class extends Aview {
	constructor(params)
	{
		super(params);
		this.setTitle("BananaSite");
	}

	async getHtml() 
	{
		return `
			<h1>This is a post about bananas!</h1>
			<p>
				They are very good for your health!
			</p>
			<p><b><a href="/" data-link>Home.</a></b></p>
			<p><b><a href="/posts" data-link>Posts.</a></b></p>
		`;
	}
}