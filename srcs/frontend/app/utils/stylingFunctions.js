export function pfpStyle(className, width, height) {
	if (!className || !width || !height)
		return ;
	return `
	${className} {
		width: ${width};
		height: ${height};
		clip-path: circle();
		object-fit: cover;
	}
	`;
}