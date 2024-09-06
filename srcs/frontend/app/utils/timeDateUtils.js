const parseDate = function(date) {
    const dmPart = date.split("T")[0]; //get the part with the day and month
    const hmPart = date.split("T")[1]; //get the part with the hour and minute
    const day = dmPart.split("-")[2];
    const month = dmPart.split("-")[1];
    const year = dmPart.split("-")[0];
    const hour = hmPart.split(":")[0];
    const minute = hmPart.split(":")[1];
    return `${day}/${month}/${year} ${hour}:${minute}`;
}
export default parseDate;