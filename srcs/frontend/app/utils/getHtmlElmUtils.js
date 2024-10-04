export const getHtmlElm = function(pageObj) {
    return `<${pageObj.componentName}></${pageObj.componentName}>`;
}

export const getDynamicHtmlElm = function(pageObj, key, keyName) {
    return `<${pageObj.componentName} ${keyName}="${key}"></${pageObj.componentName}>`;
}

