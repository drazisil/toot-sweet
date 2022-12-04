import { logger } from "../server.js"
import { ActorPerson } from "./APTypes.js"

const actors: ActorPerson[] = []

export function addActor(actor:ActorPerson): void {
    logger.debug(`Adding actor with id: ${actor.id}`)
    actors.push(actor)
    logger.debug('added')
}

export function allActors(): ActorPerson[] {
    logger.debug('Getting all actiors')
    return actors
}

export function getActor(id: string): ActorPerson | null {
    return actors.find(actor => {
        actor.id === id
    }) ?? null
}
