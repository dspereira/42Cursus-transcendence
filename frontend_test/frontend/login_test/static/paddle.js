export class Paddle {
	constructor(game, xPos, yPos, width, height) {
		this.game = game;
		this.x = xPos;
		this.y = yPos;
		this.width = width;
		this.height = height;
	}
	update(coords)
	{
		console.log("coords:" + coords.x + " " + coords.y);
		this.x = coords.x;
		this.y = coords.y;
	}
	draw(context)
	{
		console.log(this.y);
		context.fillRect(this.x, this.y, this.width, this.height);
		context.fillRect(400, 250, 100, 100);

	}
}
