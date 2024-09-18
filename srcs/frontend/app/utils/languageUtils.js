const getLanguageDict = (language, enDict, ptDict, esDict) => {
    switch (language) {
        case "en":
            return enDict;
        case "pt":
            return ptDict;
        case "es":
            return esDict;
        default:
            return enDict;
    }
};

export default getLanguageDict