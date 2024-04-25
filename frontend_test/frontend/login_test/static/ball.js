export class Ball {
	constructor() {
		this.x = 400;
		this.y = 250;
		this.radius = 4;
		this.xDir = 1;
		this.yDir = 0.75;
	}
	update(coords)
	{
		this.x = coords.x;
		this.y = coords.y;
	}
	draw(ctx)
	{
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.fill();
	}
}
