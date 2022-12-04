export function hasId(input) {
    return (typeof input['id'] != "undefined") ? true : false;
}
export function hasType(input) {
    return (typeof input['type'] != "undefined") ? true : false;
}
export function activityTypeIsValid(input) {
    const validTypes = [
        'Follow'
    ];
    return validTypes.includes(input);
}
//# sourceMappingURL=index.js.map