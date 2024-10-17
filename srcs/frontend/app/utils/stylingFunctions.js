export function pfpStyle(className, width) {
	if (!className || !width)
		return ;
	return `
	${className} {
		width: ${width};
		clip-path: circle();
		object-fit: cover;
		aspect-ratio: 1 / 1;
	}
	`;
}