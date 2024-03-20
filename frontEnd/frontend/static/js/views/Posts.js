import Aview from "./Aview.js";

export default class extends Aview {
	constructor(params)
	{
		super(params);
		this.setTitle("Posts");
	}

	async getHtml() 
	{
		return `
			<h1>Posts!</h1>
			<p>
				Let's read some posts!
			</p>
			<p><b><a href="/" data-link>Home.</a></b></p>
			<p><b><a href="/posts/2" data-link>Post sobre bananas.</a><b></p>
		`;
	}
}