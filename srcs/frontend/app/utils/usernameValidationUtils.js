const isValidUsername = function(username) {
    if (username) {
        const regex = /^[a-zA-Z0-9_-]+$/;
        const usernameLen = username.length;
        if (usernameLen > 0 && usernameLen <= 15) {
            if (regex.test(username))
                return true;
        }
    }
    return false;
};

export default isValidUsername;
