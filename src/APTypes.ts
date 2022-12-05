class LangString {
    language: string;
    content: string;
}
class Link {
    href: string;
    rel: string;
    mediaType: string;
    name: string;
    hreflang: string;
    height: number;
    width: number;
    preview: ASObject | Link;
}
type ASImage = ASObject;
class ASObject {
    id: string;
    type: string;
    attachment?: ASObject | Link;
    attributedTo?: ASObject | Link;
    audience?: ASObject | Link;
    content?: string | LangString;
    context?: string;
    contentMap?: string[] | LangString[];
    name?: string | LangString;
    nameMap?: string[] | LangString[];
    endTime?: Date;
    generator?: ASObject | Link;
    icon?: ASImage | Link;
    image?: ASImage | Link;
    inReplyTo?: ASObject | Link;
    location?: ASObject | Link;
    preview?: ASObject | Link;
    published?: Date;
    replies?: Collection[];
    startTime?: Date;
    summary?: string | LangString;
    summaryMap?: string[] | LangString[];
    tag?: ASObject | Link;
    updated?: Date;
    url?: Link;
    to?: ASObject | Link;
    bto?: ASObject | Link;
    cc?: ASObject | Link;
    bcc?: ASObject | Link;
    mediaType?: string;
    duration?: string;
}
class Collection extends ASObject {
    items: [ASObject | Link];
    totalItems: number;
    current: CollectionPage | Link;
}
class CollectionPage extends Collection {
    partOf: Link | Collection;
    next: Link | CollectionPage;
    prev: Link | CollectionPage;
}
class OrderedCollection extends ASObject {
    orderedItems: [ASObject | Link];
    totalItems: number;
    current: OrderedCollectionPage | Link;
    startIndex?: number;
}
class OrderedCollectionPage extends Collection {
    partOf: Link | OrderedCollection;
    next: Link | OrderedCollectionPage;
    prev: Link | OrderedCollectionPage;
}
class AccessCollection {
    _internal: OrderedCollection | Collection;

    toString(authorized = false) {
        if (authorized) {
            return this._internal;
        } else {
            return [];
        }
    }
}
class PublicInbox extends OrderedCollection { }
class Endpoint {
    proxyUrl?: Link;
    oauthAuthorizationEndpoint?: Link;
    oauthTokenEndpoint?: Link;
    provideClientKey?: Link;
    signClientKey?: Link;
    sharedInbox?: PublicInbox;
}
export class ActorPerson {
    '@context' = 'https://www.w3.org/ns/activitystreams'
    id: string;
    type = 'Person'
    inbox: OrderedCollection = new OrderedCollection();
    outbox: OrderedCollection = new OrderedCollection();
    following: AccessCollection = new AccessCollection();
    liked: AccessCollection = new AccessCollection();
    streams?: Collection[] = [];
    preferedUsername?: string;
    endpoints?: Link | Endpoint;
    isSubscribedToPublic: boolean

    constructor({id, subPublic = false}: {id: string, subPublic?: boolean}) {
        this.id = id
        if (subPublic) {
            this.isSubscribedToPublic = true
        }
    }
}

export class ActivityReject {
    '@context' = 'https://www.w3.org/ns/activitystreams'
    id: string;
    type = 'Reject'
    actor: string
    object: string;

    constructor({targetObject, id, actor}: {targetObject: string, id: string, actor: string}) {
        this.id = id
        this.actor = actor
        this.object = targetObject
    }

    toJSON() {
        return {
            "@context": this["@context"],
            "id": this.id,
            "type": this.type,
            "actor": this.actor,
            "object": this.object
        }
    }
}
