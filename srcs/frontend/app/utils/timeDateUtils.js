const formatWithLeadingZero = function(value) {
	return value < 10 ? `0${value}` : `${value}`;
} 

const parseDate = function(date) {
	const timeDate = new Date(date * 1000);
	const dayStr = formatWithLeadingZero(timeDate.getDate()); 
	const monthStr = formatWithLeadingZero(timeDate.getMonth() + 1); 
	const hoursStr = formatWithLeadingZero(timeDate.getHours()); 
	const minutesStr = formatWithLeadingZero(timeDate.getMinutes());
	return `${dayStr}/${monthStr}/${timeDate.getFullYear()} ${hoursStr}:${minutesStr}`;
}

export default parseDate;