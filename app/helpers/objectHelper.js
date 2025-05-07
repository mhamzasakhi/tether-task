exports.copyObject = (obj) => JSON.parse(JSON.stringify(obj));

// remove null, undefined & empty objects
exports.compactObject = (obj) => {
    let newObj = {};
    Object.keys(obj).forEach((key) => {
        if (obj[key] || obj[key] === false || obj[key] === 0) {
            newObj = { ...newObj, [key]: obj[key] };
        }
    });
    return newObj;
};