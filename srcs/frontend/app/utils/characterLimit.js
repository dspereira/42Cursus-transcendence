export function charLimiter(name, limit) {
	if (!(name && name.length > limit))
		return name;
	return name.slice(0, limit - 3) + "...";
}

const charLimit = 10;

export default charLimit;