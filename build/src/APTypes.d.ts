declare class LangString {
    language: string;
    content: string;
}
declare class Link {
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
declare class ASObject {
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
declare class Collection extends ASObject {
    items: [ASObject | Link];
    totalItems: number;
    current: CollectionPage | Link;
}
declare class CollectionPage extends Collection {
    partOf: Link | Collection;
    next: Link | CollectionPage;
    prev: Link | CollectionPage;
}
declare class OrderedCollection extends ASObject {
    orderedItems: [ASObject | Link];
    totalItems: number;
    current: OrderedCollectionPage | Link;
    startIndex?: number;
}
declare class OrderedCollectionPage extends Collection {
    partOf: Link | OrderedCollection;
    next: Link | OrderedCollectionPage;
    prev: Link | OrderedCollectionPage;
}
declare class AccessCollection {
    _internal: OrderedCollection | Collection;
    toString(authorized?: boolean): Collection | OrderedCollection | never[];
}
declare class PublicInbox extends OrderedCollection {
}
declare class Endpoint {
    proxyUrl?: Link;
    oauthAuthorizationEndpoint?: Link;
    oauthTokenEndpoint?: Link;
    provideClientKey?: Link;
    signClientKey?: Link;
    sharedInbox?: PublicInbox;
}
export declare class ActorPerson {
    '@context': string;
    id: string;
    type: string;
    inbox: OrderedCollection;
    outbox: OrderedCollection;
    following: AccessCollection;
    liked: AccessCollection;
    streams?: Collection[];
    preferedUsername?: string;
    endpoints?: Link | Endpoint;
    isSubscribedToPublic: boolean;
    constructor({ id, subPublic }: {
        id: string;
        subPublic?: boolean;
    });
}
export {};
