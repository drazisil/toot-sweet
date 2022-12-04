import { ActivityPubJSON } from "./handlers"

export function hasId(input: ActivityPubJSON) {
    return (typeof input['id'] != "undefined") ? true : false
}

export function hasType(input: ActivityPubJSON) {
    return (typeof input['type'] != "undefined") ? true : false
}

export function activityTypeIsValid(input: string) {
    const validTypes = [
        'Follow'
    ]

    return validTypes.includes(input)
}
